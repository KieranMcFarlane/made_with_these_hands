import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const safeId = /^[a-zA-Z0-9_-]+$/;

function assertSafeId(value, label) {
  if (!safeId.test(String(value))) throw new Error(`Invalid ${label}.`);
}

function compactSummary(summary) {
  if (!summary) return null;
  return {
    ok: summary.ok === true,
    gates: summary.gates || {},
    checked_at: summary.checked_at || null,
  };
}

export function createValidationJobManager({
  proposalsRoot,
  runValidation,
  now = () => new Date(),
  randomUUID = () => crypto.randomUUID(),
}) {
  const activeJobs = new Map();

  function jobDirectory(proposalId) {
    assertSafeId(proposalId, 'proposal id');
    return path.join(proposalsRoot, proposalId, 'validation-jobs');
  }

  function jobPath(proposalId, jobId) {
    assertSafeId(jobId, 'validation job id');
    return path.join(jobDirectory(proposalId), `${jobId}.json`);
  }

  async function writeJob(job) {
    const filename = jobPath(job.proposal_id, job.job_id);
    await fs.mkdir(path.dirname(filename), { recursive: true });
    await fs.writeFile(filename, `${JSON.stringify(job, null, 2)}\n`, 'utf8');
    return job;
  }

  async function readJob(proposalId, jobId) {
    return JSON.parse(await fs.readFile(jobPath(proposalId, jobId), 'utf8'));
  }

  async function findRunningJob(proposalId) {
    const directory = jobDirectory(proposalId);
    const filenames = await fs.readdir(directory).catch((error) => {
      if (error.code === 'ENOENT') return [];
      throw error;
    });
    const jobs = await Promise.all(
      filenames.filter((filename) => filename.endsWith('.json')).map(async (filename) => (
        JSON.parse(await fs.readFile(path.join(directory, filename), 'utf8'))
      )),
    );
    return jobs.find((job) => job.status === 'running') || null;
  }

  async function markInterrupted(job) {
    const timestamp = now().toISOString();
    return writeJob({
      ...job,
      status: 'interrupted',
      updated_at: timestamp,
      completed_at: timestamp,
      error: 'The Factory process restarted before validation completed. Start a new validation job.',
    });
  }

  function finishInBackground(job) {
    const promise = Promise.resolve()
      .then(() => runValidation(job.proposal_id))
      .then(async (summary) => {
        const timestamp = now().toISOString();
        return writeJob({
          ...job,
          status: 'completed',
          updated_at: timestamp,
          completed_at: timestamp,
          validation_summary: compactSummary(summary),
        });
      })
      .catch(async (error) => {
        const timestamp = now().toISOString();
        return writeJob({
          ...job,
          status: 'failed',
          updated_at: timestamp,
          completed_at: timestamp,
          error: error instanceof Error ? error.message : String(error),
        });
      })
      .finally(() => activeJobs.delete(job.job_id));
    activeJobs.set(job.job_id, promise);
  }

  async function start(proposalId) {
    const running = await findRunningJob(proposalId);
    if (running) {
      if (activeJobs.has(running.job_id)) return running;
      await markInterrupted(running);
    }

    const timestamp = now().toISOString();
    const job = await writeJob({
      job_id: randomUUID(),
      proposal_id: proposalId,
      status: 'running',
      started_at: timestamp,
      updated_at: timestamp,
      completed_at: null,
      validation_summary: null,
      error: null,
    });
    finishInBackground(job);
    return job;
  }

  async function get(proposalId, jobId) {
    const job = await readJob(proposalId, jobId);
    if (job.status === 'running' && !activeJobs.has(job.job_id)) {
      return markInterrupted(job);
    }
    return job;
  }

  return { start, get };
}
