# Directus v12 Runtime

This unit keeps the canonical `nakano-directus` Directus 12.0.2 container and
its Postgres/Redis dependencies running without starting the retired Directus
11 fallback or unrelated Nakano services.

Install or refresh the unit:

```bash
mkdir -p ~/.config/systemd/user
cp deploy/directus-v12/nakano-shared-directus-v12.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now nakano-shared-directus-v12.service
```

Verify:

```bash
docker inspect --format '{{.State.Health.Status}}' nakano-directus
curl --fail https://cms.nakanodigital.com/server/health
curl --head https://cms.nakanodigital.com/mcp
```

The service is intentionally narrow. It does not start the legacy Nakano estate.
The database currently contains one tenant only: `made-with-these-hands`.
Directus Core custom permission rules are disabled, so this database must remain
single tenant unless the entitlement or deployment topology changes.
