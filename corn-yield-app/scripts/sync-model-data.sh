#!/bin/bash
set -e

BUCKET="sagemaker-us-west-2-058264079478"
KEY="corncast/results.json"
DEST="app/lib/liveResults.json"

echo "⬇️  Downloading model results from S3..."
aws s3 cp "s3://${BUCKET}/${KEY}" "${DEST}"
echo "✅  Synced to ${DEST}"
echo ""
echo "Now restart the dev server: npm run dev"
