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

# NEXT_PUBLIC_* vars are inlined at BUILD time by Next.js — pass them as
# build-env-vars. Set them before running (or in your shell profile):
#   NEXT_PUBLIC_CDN_BASE   → point blog asset URLs at GCS (else serve from /public)
#   NEXT_PUBLIC_CANVAS_URL → show the "Canvas" sidebar link → the canvas site
# Example:
#   export NEXT_PUBLIC_CDN_BASE=https://storage.googleapis.com/franklin-run-assets
#   export NEXT_PUBLIC_CANVAS_URL=https://canvas.franklin.run
#   npm run deploy
BUILD_ENVS=""
[ -n "${NEXT_PUBLIC_CDN_BASE:-}" ]   && BUILD_ENVS="${BUILD_ENVS},NEXT_PUBLIC_CDN_BASE=${NEXT_PUBLIC_CDN_BASE}"
[ -n "${NEXT_PUBLIC_CANVAS_URL:-}" ] && BUILD_ENVS="${BUILD_ENVS},NEXT_PUBLIC_CANVAS_URL=${NEXT_PUBLIC_CANVAS_URL}"
BUILD_ENVS="${BUILD_ENVS#,}" # strip leading comma

echo " cdn     : ${NEXT_PUBLIC_CDN_BASE:-(none — serving assets from container)}"
echo " canvas  : ${NEXT_PUBLIC_CANVAS_URL:-(none — link hidden)}"

if [ -n "${BUILD_ENVS}" ]; then
  gcloud run deploy "${SERVICE}" \
    --source . \
    --region "${REGION}" \
    --project "${PROJECT}" \
    --allow-unauthenticated \
    --set-build-env-vars="${BUILD_ENVS}" \
    --quiet
else
  gcloud run deploy "${SERVICE}" \
    --source . \
    --region "${REGION}" \
    --project "${PROJECT}" \
    --allow-unauthenticated \
    --quiet
fi

echo
echo "✅ Deployed ${SHA} to https://franklin.run"
