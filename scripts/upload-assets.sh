#!/usr/bin/env bash
# Sync public assets to Google Cloud Storage for CDN serving.
#
# One-time bucket setup (run manually before first sync):
#   gcloud storage buckets create gs://franklin-run-assets \
#     --project=blockrun-prod-2026 --location=us-central1 \
#     --uniform-bucket-level-access
#   gcloud storage buckets add-iam-policy-binding gs://franklin-run-assets \
#     --member=allUsers --role=roles/storage.objectViewer
#
# After bucket exists, run this script anytime assets change:
#   bash scripts/upload-assets.sh
#
# Then rebuild + redeploy with NEXT_PUBLIC_CDN_BASE pointing at the bucket.
# See scripts/deploy.sh for where to set that env var.

set -euo pipefail

PROJECT="${PROJECT:-blockrun-prod-2026}"
BUCKET="${BUCKET:-franklin-run-assets}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Folders to mirror under public/ → gs://$BUCKET/
FOLDERS=(
  "seo/blog"
  "images"
  "videos"
)

# Loose top-level files in public/ (favicons, apple-touch-icon, etc.) that
# the site references via cdnUrl("/favicon.png") and similar.
ROOT_FILES=(
  "favicon.svg"
  "favicon.png"
  "apple-touch-icon.png"
)

echo "→ Project:  $PROJECT"
echo "→ Bucket:   gs://$BUCKET"
echo "→ Source:   $ROOT/public"
echo

if ! command -v gcloud >/dev/null 2>&1; then
  echo "ERROR: gcloud CLI not installed. Install: https://cloud.google.com/sdk/docs/install" >&2
  exit 1
fi

if ! gcloud storage buckets describe "gs://$BUCKET" --project="$PROJECT" >/dev/null 2>&1; then
  cat <<EOF >&2
ERROR: Bucket gs://$BUCKET does not exist or you lack access.

Create it first:
  gcloud storage buckets create gs://$BUCKET \\
    --project=$PROJECT --location=us-central1 \\
    --uniform-bucket-level-access

Then make it public-read:
  gcloud storage buckets add-iam-policy-binding gs://$BUCKET \\
    --member=allUsers --role=roles/storage.objectViewer
EOF
  exit 1
fi

# rsync each folder. --delete-unmatched-destination-objects keeps the bucket
# in sync with disk so deleted files don't linger and serve stale.
for folder in "${FOLDERS[@]}"; do
  src="$ROOT/public/$folder"
  if [ ! -d "$src" ]; then
    echo "skip  $folder (not present)"
    continue
  fi
  echo "sync  $folder"
  gcloud storage rsync --recursive --delete-unmatched-destination-objects \
    "$src" "gs://$BUCKET/$folder"
done

# Upload top-level public files individually (no folder prefix in bucket).
for file in "${ROOT_FILES[@]}"; do
  src="$ROOT/public/$file"
  if [ ! -f "$src" ]; then
    echo "skip  $file (not present)"
    continue
  fi
  echo "copy  $file"
  gcloud storage cp "$src" "gs://$BUCKET/$file"
done

# Apply long-cache headers to everything (assets are content-addressed by
# slug/locale; on content change, the slug or path will change, or you can
# invalidate manually). 1 year, immutable.
echo
echo "→ Setting Cache-Control: public, max-age=31536000, immutable"
gcloud storage objects update "gs://$BUCKET/**" \
  --cache-control="public, max-age=31536000, immutable" \
  --project="$PROJECT" >/dev/null

echo
echo "Done. Public URL prefix:"
echo "  https://storage.googleapis.com/$BUCKET"
echo
echo "Set this in your deploy env (scripts/deploy.sh) before rebuilding:"
echo "  NEXT_PUBLIC_CDN_BASE=https://storage.googleapis.com/$BUCKET"
