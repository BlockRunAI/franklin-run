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

# NEXT_PUBLIC_CDN_BASE is inlined at build time by Next.js. Set it as an
# env var before running this script (or in your shell profile) to point
# blog asset URLs at GCS. Empty/unset → assets continue serving from /public.
#
# Example:
#   export NEXT_PUBLIC_CDN_BASE=https://storage.googleapis.com/franklin-run-assets
#   npm run deploy
if [ -n "${NEXT_PUBLIC_CDN_BASE:-}" ]; then
  echo " cdn     : ${NEXT_PUBLIC_CDN_BASE}"
  gcloud run deploy "${SERVICE}" \
    --source . \
    --region "${REGION}" \
    --project "${PROJECT}" \
    --allow-unauthenticated \
    --set-build-env-vars="NEXT_PUBLIC_CDN_BASE=${NEXT_PUBLIC_CDN_BASE}" \
    --quiet
else
  echo " cdn     : (none — serving assets from container)"
  gcloud run deploy "${SERVICE}" \
    --source . \
    --region "${REGION}" \
    --project "${PROJECT}" \
    --allow-unauthenticated \
    --quiet
fi

echo
echo "✅ Deployed ${SHA} to https://franklin.run"
