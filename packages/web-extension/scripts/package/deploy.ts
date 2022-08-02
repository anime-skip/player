import path from 'path';
import { publishExtension, PublishOptions } from 'publish-browser-extension';
import { isDryRun } from '../utils';
import { PackageConfig } from './config';

export async function deploy(config: PackageConfig) {
  const options: PublishOptions = {
    dryRun: isDryRun(),
  };
  const isBeta = config.PACKAGE_MODE === 'beta';

  if (!config.SKIP_FIREFOX) {
    options.firefox = {
      zip: path.resolve(config.OUTPUT_DIR, `firefox-${config.PACKAGE_MODE}.zip`),
      sourcesZip: path.resolve(config.OUTPUT_DIR, `sources.zip`),
      extensionId: isBeta ? config.FIREFOX_BETA_SIGNING_ID ?? '' : config.FIREFOX_SIGNING_ID,
      jwtIssuer: isBeta ? config.FIREFOX_BETA_SIGNING_ISSUER ?? '' : config.FIREFOX_SIGNING_ISSUER,
      jwtSecret: isBeta ? config.FIREFOX_BETA_SIGNING_SECRET ?? '' : config.FIREFOX_SIGNING_SECRET,
      channel: 'listed',
    };
  }
  if (!config.SKIP_CHROME) {
    options.chrome = {
      zip: path.resolve(config.OUTPUT_DIR, `chrome-${config.PACKAGE_MODE}.zip`),
      clientId: config.CHROME_CLIENT_ID,
      clientSecret: config.CHROME_CLIENT_SECRET,
      extensionId: isBeta ? config.CHROME_BETA_APP_ID : config.CHROME_APP_ID,
      refreshToken: config.CHROME_REFRESH_TOKEN,
      ...(isBeta && { publishTarget: undefined /* 'trustedTesters' */ }),
    };
  }

  await publishExtension(options);
}
