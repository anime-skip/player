/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios').default;
const { bash, run, subStep, skipForDryRuns, CODE, RESET, UNDERLINE, title } = require('./utils');
const fs = require('fs-extra');
const path = require('path');

/**
 *
 * @param {boolean} prod Is the deployment to production?
 */
module.exports = async function chromePublish(buildVars, env) {
  const firefoxDist = path.join(buildVars.OUTPUT_DIR, '.firefox-dist');
  const firefoxSigningEnv = env.BETA
    ? {
        WEB_EXT_ARTIFACTS_DIR: buildVars.OUTPUT_DIR,
        WEB_EXT_API_KEY: env.FIREFOX_BETA_SIGNING_ISSUER,
        WEB_EXT_API_SECRET: env.FIREFOX_BETA_SIGNING_SECRET,
        WEB_EXT_ID: env.FIREFOX_BETA_SIGNING_ID,
        WEB_EXT_CHANNEL: 'unlisted',
        WEB_EXT_SOURCE_DIR: firefoxDist,
      }
    : {
        WEB_EXT_ARTIFACTS_DIR: buildVars.OUTPUT_DIR,
        WEB_EXT_API_KEY: env.FIREFOX_SIGNING_ISSUER,
        WEB_EXT_API_SECRET: env.FIREFOX_SIGNING_SECRET,
        WEB_EXT_ID: env.FIREFOX_SIGNING_ID,
        WEB_EXT_CHANNEL: 'listed',
        WEB_EXT_SOURCE_DIR: firefoxDist,
      };
  const chromeAppId = env.BETA ? env.CHROME_BETA_APP_ID : env.CHROME_APP_ID;
  const chromeReviewQueryParams = env.BETA ? { publishTarget: 'trustedTesters' } : undefined;

  if (buildVars.DO_FIREFOX) {
    title('Deploy');

    await run(`Signing and downloading ${CODE}firefox.xpi`, () =>
      skipForDryRuns(
        async () => await bash(`yarn web-ext --no-config-discovery sign`, firefoxSigningEnv)
      )
    );
    subStep(
      `Submit new version manually: ${UNDERLINE}https://addons.mozilla.org/en-US/developers/addon/anime-skip/versions`
    );

    await run(`Removing firefox ${CODE}dist/${RESET} cache`, () => {
      fs.emptyDirSync(firefoxDist);
      fs.rmdirSync(firefoxDist);
    });

    await run(`Renaming signed artifact to ${CODE}firefox.xpi${RESET}`, () =>
      skipForDryRuns(async () =>
        bash(`mv "${buildVars.OUTPUT_DIR}"/*.xpi "${buildVars.OUTPUT_DIR}/firefox.xpi"`)
      )
    );
  }

  if (buildVars.DO_CHROME) {
    await run(`Uploading and submitting ${CODE}chrome.zip${RESET} for review`, async () => {
      // Get a new access token
      const accessToken = (
        await axios.post('https://oauth2.googleapis.com/token', {
          /* eslint-disable @typescript-eslint/camelcase */
          client_id: env.CHROME_CLIENT_ID,
          client_secret: env.CHROME_CLIENT_SECRET,
          refresh_token: env.CHROME_REFRESH_TOKEN,
          grant_type: 'refresh_token',
          redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
          /* eslint-enable @typescript-eslint/camelcase */
        })
      ).data.access_token;
      const Authorization = `Bearer ${accessToken}`;

      await skipForDryRuns(async () => {
        // Upload the zip as a draft
        const formData = new FormData();
        formData.append(
          'image',
          'chrome.zip',
          fs.createReadStream(path.join(buildVars.OUTPUT_DIR, 'chrome.zip'))
        );
        await axios.put(
          `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${chromeAppId}`,
          formData,
          {
            headers: {
              Authorization,
              'Content-Type': 'multipart/form-data',
              'x-goog-api-version': 2,
            },
          }
        );

        // Submit for review
        await axios.post(
          `https://www.googleapis.com/chromewebstore/v1.1/items/${chromeAppId}/publish`,
          undefined,
          {
            params: chromeReviewQueryParams,
            headers: {
              Authorization,
              'x-goog-api-version': 2,
              'Content-Length': 0,
            },
          }
        );
      });
    });
  }

  if (buildVars.DO_TAG) {
    await run(`Create and push ${CODE}v${buildVars.PACKAGE_VERSION}${RESET} tag`, () =>
      skipForDryRuns(() => bash(`git tag 'v${buildVars.PACKAGE_VERSION}' && git push --tags`))
    );
  }
};
