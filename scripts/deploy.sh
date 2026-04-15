#!/usr/bin/env bash
# Deploy franklin.run to Google Cloud Run.
#
# Usage:   ./scripts/deploy.sh
# Or npm:  npm run deploy
set -euo pipefail

PROJECT="blockrun-prod-2026"
SERVICE="franklin-run"
REGION="us-central1"
IMAGE="us-central1-docker.pkg.dev/${PROJECT}/blockrun-images/${SERVICE}"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
SHA=$(git rev-parse --short HEAD)
DIRTY=$(git status --porcelain)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Deploying franklin.run"
echo " project : ${PROJECT}"
echo " service : ${SERVICE} (${REGION})"
echo " image   : ${IMAGE}"
echo " branch  : ${BRANCH} @ ${SHA}"
if [ -n "$DIRTY" ]; then
  echo " WARNING : working tree has uncommitted changes"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

gcloud run deploy "${SERVICE}" \
  --source . \
  --image "${IMAGE}:${SHA}" \
  --region "${REGION}" \
  --project "${PROJECT}" \
  --allow-unauthenticated \
  --quiet

echo
echo "✅ Deployed ${SHA} to https://franklin.run"
