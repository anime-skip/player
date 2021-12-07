import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs-extra';
import path from 'path';
import { bash, CODE, RESET, run, skipForDryRuns, subStep, title, UNDERLINE } from '../utils';
import { PackageConfig } from './config';

// https://stackoverflow.com/questions/11616630/how-can-i-print-a-circular-structure-in-a-json-like-format#answer-11616993
function safeStringify(obj: any, indent = 2) {
  let cache: any[] | null = [];
  const retVal = JSON.stringify(
    obj,
    (_, value) => {
      if (value instanceof Buffer) {
        value = value.toString(); // This is in addition to the stack overflow code
      }
      return typeof value === 'object' && value !== null
        ? cache!.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache!.push(value) && value // Store value in our collection
        : value;
    },
    indent
  );
  cache = null;
  return retVal;
}

async function tryApiCall<T>(caller: () => Promise<T>) {
  try {
    return await caller();
  } catch (err: any) {
    if (err.response) {
      throw new Error(
        `Request failed with status ${err.response.status}:\nRequest:${safeStringify(
          err.config
        )}\nResponse: ${safeStringify({
          data: err.response.data,
          status: err.response.status,
        })}`
      );
    } else {
      throw err;
    }
  }
}

export async function deploy(config: PackageConfig) {
  const firefoxDist = path.join(config.OUTPUT_DIR, '.firefox-dist');
  const firefoxSigningConfig =
    config.PACKAGE_MODE === 'beta'
      ? {
          WEB_EXT_ARTIFACTS_DIR: config.OUTPUT_DIR,
          WEB_EXT_API_KEY: config.FIREFOX_BETA_SIGNING_ISSUER,
          WEB_EXT_API_SECRET: config.FIREFOX_BETA_SIGNING_SECRET,
          WEB_EXT_ID: config.FIREFOX_BETA_SIGNING_ID,
          WEB_EXT_CHANNEL: 'listed',
          WEB_EXT_SOURCE_DIR: firefoxDist,
        }
      : {
          WEB_EXT_ARTIFACTS_DIR: config.OUTPUT_DIR,
          WEB_EXT_API_KEY: config.FIREFOX_SIGNING_ISSUER,
          WEB_EXT_API_SECRET: config.FIREFOX_SIGNING_SECRET,
          WEB_EXT_ID: config.FIREFOX_SIGNING_ID,
          WEB_EXT_CHANNEL: 'listed',
          WEB_EXT_SOURCE_DIR: firefoxDist,
        };
  const chromeAppId =
    config.PACKAGE_MODE === 'beta' ? config.CHROME_BETA_APP_ID : config.CHROME_APP_ID;
  const chromeReviewQueryParams =
    config.PACKAGE_MODE === 'beta' ? undefined /*{ publishTarget: 'trustedTesters' }*/ : undefined;

  if (!config.SKIP_FIREFOX) {
    title('Deploy');

    await run(`Signing and downloading ${CODE}firefox.xpi`, () =>
      skipForDryRuns(async () => {
        try {
          await bash(`pnpm web-ext --no-config-discovery sign`, firefoxSigningConfig);
        } catch (err: any) {
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

  if (!config.SKIP_CHROME) {
    await run(`Uploading and submitting ${CODE}chrome.zip${RESET} for review`, async () => {
      // Get a new access token
      const accessToken = (
        await tryApiCall(() =>
          axios.post('https://oauth2.googleapis.com/token', {
            client_id: config.CHROME_CLIENT_ID,
            client_secret: config.CHROME_CLIENT_SECRET,
            refresh_token: config.CHROME_REFRESH_TOKEN,
            grant_type: 'refresh_token',
            redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
          })
        )
      ).data.access_token;
      const Authorization = `Bearer ${accessToken}`;

      // Upload the zip as a draft
      const formData = new FormData();
      formData.append(
        'image',
        fs.createReadStream(path.join(config.OUTPUT_DIR, `chrome-${config.PACKAGE_MODE}.zip`)),
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
                'x-goog-api-version': '2',
                'Content-Length': '0',
              },
            }
          )
        );
      });
    });
  }
}
