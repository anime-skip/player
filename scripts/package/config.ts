import { config } from 'dotenv';
import path from 'path';
import packageJson from '../../package.json';
import { rootPath } from '../utils';

export function getConfig() {
  config({
    path: '.env.package',
  });
  const PACKAGE_MODE = process.env.PACKAGE_MODE as 'prod' | 'beta';
  const DO_CHECKS = (process.env.DO_CHECKS ?? 'true') === 'true';
  const DO_FIREFOX = (process.env.DO_FIREFOX ?? 'true') === 'true';
  const DO_CHROME = (process.env.DO_CHROME ?? 'true') === 'true';
  const BUILD_NAME = `${packageJson.name}-${packageJson.version}-${PACKAGE_MODE}`;
  const artifactsDir = ['artifacts'];

  return {
    // Signing secrets
    FIREFOX_SIGNING_ISSUER: process.env.FIREFOX_SIGNING_ISSUER!,
    FIREFOX_SIGNING_SECRET: process.env.FIREFOX_SIGNING_SECRET!,
    FIREFOX_SIGNING_ID: process.env.FIREFOX_SIGNING_ID!,
    FIREFOX_BETA_SIGNING_ISSUER: process.env.FIREFOX_BETA_SIGNING_ISSUER,
    FIREFOX_BETA_SIGNING_SECRET: process.env.FIREFOX_BETA_SIGNING_SECRET,
    FIREFOX_BETA_SIGNING_ID: process.env.FIREFOX_BETA_SIGNING_ID,
    CHROME_CLIENT_ID: process.env.CHROME_CLIENT_ID!,
    CHROME_CLIENT_SECRET: process.env.CHROME_CLIENT_SECRET!,
    CHROME_REFRESH_TOKEN: process.env.CHROME_REFRESH_TOKEN!,
    CHROME_APP_ID: process.env.CHROME_APP_ID!,
    CHROME_BETA_APP_ID: process.env.CHROME_BETA_APP_ID!,

    // Build info
    PACKAGE_VERSION: packageJson.version,
    PACKAGE_NAME: packageJson.name,
    BUILD_NAME,
    PACKAGE_MODE,

    // Directories
    OUTPUT_DIR: rootPath(...artifactsDir),
    OUTPUT_DIR_DISPLAY: path.join('.', ...artifactsDir),

    // Flags
    DO_CHECKS,
    DO_FIREFOX,
    DO_CHROME,
  };
}

export type PackageConfig = ReturnType<typeof getConfig>;
