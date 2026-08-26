#!/usr/bin/env bash
set -euo pipefail

/usr/bin/docker stop --time 20 nakano-directus >/dev/null 2>&1 || true
/usr/bin/docker stop --time 20 nakano-directus-redis nakano-directus-db >/dev/null 2>&1 || true
