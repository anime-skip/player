# Upload and publish upload
#
# https://developer.chrome.com/webstore/using_webstore_api
# 
# Usage: source .env && ./scripts/chrome-publish.sh artifacts/anime-skip-web-ext-1.0.6/chrome.zip

set -e 

ARTIFACT="$1"

# Get new access token
echo ""
echo "Authenticating..."
ACCESS_TOKEN=$(curl "https://oauth2.googleapis.com/token" -d "client_id=${CHROME_CLIENT_ID}&client_secret=${CHROME_CLIENT_SECRET}&refresh_token=${CHROME_REFRESH_TOKEN}&grant_type=refresh_token&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | jq -r .access_token)

# Upload artifact
echo ""
echo "Uploading zip..."
curl \
  -H "Authorization: Bearer $ACCESS_TOKEN"  \
  -H "x-goog-api-version: 2" \
  -X PUT \
  -T "$ARTIFACT" \
  -v \
  "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$CHROME_APP_ID"

# Publish
# TODO - Remove `?publishTarget=trustedTesters` when ready to go public
echo ""
echo "Submit for review..."
curl \
  -X POST \
  -H "Authorization: Bearer $ACCESS_TOKEN"  \
  -H "x-goog-api-version: 2" \
  -H "Content-Length: 0" \
  -v \
  "https://www.googleapis.com/chromewebstore/v1.1/items/$CHROME_APP_ID/publish?publishTarget=trustedTesters"
