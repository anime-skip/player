/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios').default;
const { bash, run, subStep, skipForDryRuns, CODE, RESET, UNDERLINE, title } = require('./utils');
const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');

// https://stackoverflow.com/questions/11616630/how-can-i-print-a-circular-structure-in-a-json-like-format#answer-11616993
JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (_, value) => {
      if (value instanceof Buffer) {
        value = value.toString(); // This is in addition to the stack overflow code
      }
      return typeof value === 'object' && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value;
    },
    indent
  );
  cache = null;
  return retVal;
};

async function tryApiCall(caller) {
  try {
    return await caller();
  } catch (err) {
    if (err.response) {
      throw new Error(
        `Request failed with status ${err.response.status}:\nRequest:${JSON.safeStringify(
          err.config
        )}\nResponse: ${JSON.safeStringify({
          data: err.response.data,
          status: err.response.status,
        })}`
      );
    } else {
      throw err;
    }
  }
}

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
      skipForDryRuns(async () => {
        try {
          await bash(`yarn web-ext --no-config-discovery sign`, firefoxSigningEnv);
        } catch (err) {
          if (!err.message.includes('Your add-on has been submitted for review')) {
            throw err;
          }
        }
      })
    );
    subStep(`Your add-on has been submitted for review`);
    subStep(
      `Finish submission: ${UNDERLINE}https://addons.mozilla.org/en-US/developers/addon/anime-skip/versions`
    );

    await run(`Removing firefox ${CODE}dist/${RESET} cache`, () => {
      fs.emptyDirSync(firefoxDist);
      fs.rmdirSync(firefoxDist);
    });
  }

  if (buildVars.DO_CHROME) {
    await run(`Uploading and submitting ${CODE}chrome.zip${RESET} for review`, async () => {
      // Get a new access token\
      const response = await tryApiCall(() =>
        axios.post('https://oauth2.googleapis.com/token', {
          /* eslint-disable @typescript-eslint/camelcase */
          client_id: env.CHROME_CLIENT_ID,
          client_secret: env.CHROME_CLIENT_SECRET,
          refresh_token: env.CHROME_REFRESH_TOKEN,
          grant_type: 'refresh_token',
          redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
          /* eslint-enable @typescript-eslint/camelcase */
        })
      );
      console.log('\n\nResponse: ' + JSON.safeStringify(response.toJSON()) + '\n\n');
      const accessToken = response.data.access_token;
      const Authorization = `Bearer ${accessToken}`;

      // Upload the zip as a draft
      const formData = new FormData();
      formData.append(
        'image',
        fs.createReadStream(path.join(buildVars.OUTPUT_DIR, 'chrome.zip')),
        'chrome.zip'
      );
      await skipForDryRuns(async () => {
        await tryApiCall(() =>
          axios.put(
            `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${chromeAppId}`,
            formData,
            {
              headers: formData.getHeaders({
                Authorization,
                'x-goog-api-version': 2,
              }),
            }
          )
        );

        // Submit for review
        await tryApiCall(() =>
          axios.post(
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
          )
        );
      });
    });
  }
};
