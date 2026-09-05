import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createValidationJobManager } from '../../tools/component-factory-mcp/validation-jobs.mjs';

async function waitForStatus(manager, proposalId, jobId, expected) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const job = await manager.get(proposalId, jobId);
    if (job.status === expected) return job;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error(`Validation job did not reach ${expected}.`);
}

test('validation jobs start immediately, deduplicate while active, and persist completion', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mwth-validation-jobs-'));
  let finishValidation;
  let runs = 0;
  const manager = createValidationJobManager({
    proposalsRoot: root,
    randomUUID: () => 'job-one',
    runValidation: async () => {
      runs += 1;
      return new Promise((resolve) => { finishValidation = resolve; });
    },
  });

  try {
    const started = await manager.start('proposal-one');
    assert.equal(started.status, 'running');
    assert.equal(started.job_id, 'job-one');

    await new Promise((resolve) => setImmediate(resolve));
    const duplicate = await manager.start('proposal-one');
    assert.equal(duplicate.job_id, started.job_id);
    assert.equal(runs, 1);

    finishValidation({
      ok: true,
      gates: { contract: true },
      checked_at: '2026-08-28T12:00:00.000Z',
      results: [{ gate: 'contract', output: 'large output is kept on the proposal' }],
    });
    const completed = await waitForStatus(manager, 'proposal-one', started.job_id, 'completed');
    assert.deepEqual(completed.validation_summary, {
      ok: true,
      gates: { contract: true },
      checked_at: '2026-08-28T12:00:00.000Z',
    });
    assert.equal('results' in completed.validation_summary, false);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('validation jobs persist failures without rejecting the MCP request', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mwth-validation-jobs-'));
  const manager = createValidationJobManager({
    proposalsRoot: root,
    randomUUID: () => 'job-failure',
    runValidation: async () => { throw new Error('Validation runner unavailable.'); },
  });

  try {
    const started = await manager.start('proposal-failure');
    const failed = await waitForStatus(manager, 'proposal-failure', started.job_id, 'failed');
    assert.equal(failed.error, 'Validation runner unavailable.');
    assert.match(failed.completed_at, /^\d{4}-\d{2}-\d{2}T/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('a running job from an earlier Factory process is reported as interrupted', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mwth-validation-jobs-'));
  const directory = path.join(root, 'proposal-restart', 'validation-jobs');
  const filename = path.join(directory, 'job-stale.json');
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(filename, `${JSON.stringify({
    job_id: 'job-stale',
    proposal_id: 'proposal-restart',
    status: 'running',
    started_at: '2026-08-28T10:00:00.000Z',
    updated_at: '2026-08-28T10:00:00.000Z',
    completed_at: null,
    validation_summary: null,
    error: null,
  }, null, 2)}\n`);

  const manager = createValidationJobManager({
    proposalsRoot: root,
    runValidation: async () => ({ ok: true }),
  });

  try {
    const interrupted = await manager.get('proposal-restart', 'job-stale');
    assert.equal(interrupted.status, 'interrupted');
    assert.match(interrupted.error, /Start a new validation job/);
    assert.equal(JSON.parse(await fs.readFile(filename, 'utf8')).status, 'interrupted');
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
