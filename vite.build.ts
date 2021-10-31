/// <reference path="./src/@types/modules.d.ts" />
/// <reference path="./src/@types/types.d.ts" />

import Vue from '@vitejs/plugin-vue';
import { program } from 'commander';
import DotEnv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import * as Vite from 'vite';
import ViteComponents from 'vite-plugin-components';
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons';
import packageJson from './package.json';
import { rootPath } from './scripts/utils';
import AssetsRewrite from './scripts/vite/plugin-assets-rewrite';
import type { ParallelizeController } from './scripts/vite/plugin-parallelize';
import { createWebExtController } from './scripts/vite/plugin-web-ext';
import { getManifest } from './src/manifest';

DotEnv.config();

function listFiles(dirPath: string): string[] {
  return fs.readdirSync(dirPath).filter(filename => filename !== 'components.d.ts');
}

const viewsDir = rootPath('src/views');
const views = listFiles(viewsDir);
const contentScriptsDir = rootPath('src/content-scripts');
const contentScripts = listFiles(contentScriptsDir).filter(filename => filename !== 'services');
const servicesDir = rootPath('src/content-scripts/services');
const services = listFiles(servicesDir);
const backgroundDir = rootPath('src/background');
const background = listFiles(backgroundDir);

export async function writeManifest(browser: SupportedBrowser, mode: ExtensionMode) {
  const suffixes = {
    prod: '',
    beta: ' (Beta)',
    staged: ' (Staged)',
    test: ' (Dev)',
    dev: ' (Dev)',
  };
  await fs.writeJSON(
    rootPath('extension/manifest.json'),
    await getManifest(suffixes[mode], browser, mode),
    { spaces: 2 }
  );
  console.log('write manifest.json', { suffix: suffixes[mode], for: browser, mode });
}

async function getConfig(
  parallelizeController: ParallelizeController | undefined,
  type: 'view' | 'background' | 'content-script' | 'service' | 'parent',
  options: {
    name: string;
    entry: string;
    watch?: boolean;
    mode: ExtensionMode;
  }
): Promise<Vite.InlineConfig> {
  const plugins = [
    Vue(),
    ViteComponents({
      dirs: [rootPath('src')],
      globalComponentsDeclaration: true,
      customComponentResolvers: [ViteIconsResolver({ componentPrefix: '' })],
    }),
    ViteIcons(),
    AssetsRewrite(),
  ];
  if (parallelizeController) {
    plugins.push(await parallelizeController.plugin());
  }

  const baseConfig: Vite.InlineConfig = {
    clearScreen: false,
    plugins,
    build: {
      emptyOutDir: false,
      sourcemap: ['dev', 'staged', 'beta'].includes(options.mode) ? 'inline' : undefined,
      watch: options.watch
        ? {
            clearScreen: false,
          }
        : undefined,
    },
    define: {
      EXTENSION_VERSION: `'${packageJson.version}'`,
    },
    mode: options.watch ? 'development' : 'production',
    resolve: {
      alias: {
        '~/': `${rootPath('src')}/`,
        '~api': rootPath('src/common/api'),
        '~env': rootPath('src/common/utils/env'),
      },
    },
    optimizeDeps: !options.watch
      ? {
          include: ['vue', '@vueuse/core'],
          exclude: ['vue-demi'],
        }
      : undefined,
  };

  if (type === 'view')
    return {
      ...baseConfig,
      root: rootPath(viewsDir, options.name),
      base: `/${options.name}/`,
      build: {
        ...baseConfig.build,
        outDir: rootPath(`extension/${options.name}`),
        lib: {
          entry: options.entry,
          name: options.name.replace(/-/g, '_'),
          formats: ['umd'],
        },
      },
    };

  if (type === 'background')
    return {
      ...baseConfig,
      build: {
        ...baseConfig.build,
        outDir: rootPath('extension/background'),
        lib: {
          entry: options.entry,
          fileName: () => `${options.name}.js`,
          formats: ['umd'],
          name: options.name.replace(/-/g, '_'),
        },
      },
    };

  if (type === 'content-script')
    return {
      ...baseConfig,
      root: rootPath(contentScriptsDir, options.name),
      base: `/${options.name}/`,
      build: {
        ...baseConfig.build,
        outDir: rootPath(`extension/content-scripts/${options.name}`),
        lib: {
          entry: options.entry,
          fileName: () => 'index.js',
          formats: ['umd'],
          name: options.name.replace(/-/g, '_'),
        },
      },
    };

  if (type === 'service')
    return {
      ...baseConfig,
      root: rootPath(contentScriptsDir, 'services', options.name),
      base: `/${options.name}/`,
      build: {
        ...baseConfig.build,
        outDir: rootPath(`extension/content-scripts/services/${options.name}`),
        lib: {
          entry: options.entry,
          fileName: () => 'index.js',
          formats: ['umd'],
          name: options.name.replace(/-/g, '_'),
        },
      },
    };

  if (type === 'parent')
    return {
      ...baseConfig,
      root: rootPath(contentScriptsDir, 'services', options.name),
      base: `/${options.name}/`,
      build: {
        ...baseConfig.build,
        outDir: rootPath(`extension/content-scripts/services/${options.name}`),
        lib: {
          entry: options.entry,
          fileName: () => 'parent.js',
          formats: ['umd'],
          name: options.name.replace(/-/g, '_'),
        },
      },
    };

  throw Error('Encountered unknown type during build: ' + type);
}

async function build(browser: SupportedBrowser, mode: ExtensionMode, watch?: boolean) {
  const parallelizeController = watch
    ? createWebExtController({
        chromiumBinary: process.env.BUILD_CHROMIUM_EXECUTABLE ?? 'chrome',
        chromiumProfile: process.env.BUILD_CHROMIUM_PROFILE,
        firefox: process.env.BUILD_FIREFOX_BINARY ?? 'firefox',
        firefoxProfile: process.env.BUILD_FIREFOX_PROFILE,
        startUrl: [
          'http://localhost:7238',
          browser === 'firefox' ? 'about:addons' : 'chrome://extensions',
          browser === 'firefox' ? 'about:debugging#/runtime/this-firefox' : '',
        ],
        target: [browser === 'firefox' ? 'firefox-desktop' : 'chromium'],
      })
    : undefined;

  // src/views/{view}/index.html
  const viewConfigs = await Promise.all(
    views.map(view =>
      getConfig(parallelizeController, 'view', {
        name: view,
        entry: path.join(viewsDir, view, 'index.html'),
        watch,
        mode,
      })
    )
  );

  // src/background/{script}/index.ts
  const backgroundConfigs = await Promise.all(
    background.map(script =>
      getConfig(parallelizeController, 'background', {
        name: script.replace('.ts', ''),
        entry: path.join(backgroundDir, script),
        watch,
        mode,
      })
    )
  );

  // src/content-scripts/{contentScript}/index.ts
  const contentScriptConfigs = await Promise.all(
    contentScripts.map(contentScript =>
      getConfig(parallelizeController, 'content-script', {
        name: contentScript,
        entry: path.join(contentScriptsDir, contentScript, 'index.ts'),
        watch,
        mode,
      })
    )
  );

  // src/content-scripts/services/{service}/init-player.ts
  const initPlayerConfigs = await Promise.all(
    services.map(service =>
      getConfig(parallelizeController, 'service', {
        name: service,
        entry: path.join(servicesDir, service, 'init-player.ts'),
        watch,
        mode,
      })
    )
  );

  // src/content-scripts/services/{service}/parent.ts
  const parentConfigs = await Promise.all(
    services.map(service =>
      getConfig(parallelizeController, 'parent', {
        name: service,
        entry: path.join(servicesDir, service, 'parent.ts'),
        watch,
        mode,
      })
    )
  );

  const configs = [
    ...viewConfigs,
    ...backgroundConfigs,
    ...contentScriptConfigs,
    ...initPlayerConfigs,
    ...parentConfigs,
  ];

  // Clean output directory
  ['content-scripts', 'background', ...views].forEach(dirName => {
    const dir = rootPath('extension', dirName);
    fs.rmdirSync(dir, { recursive: true });
    console.log('Cleaning build directory: ' + dir);
  });

  try {
    process.env.VITE_EXT_MODE = mode;
    await writeManifest(browser, mode);
    await Promise.all(configs.map(Vite.build));
  } catch (err) {
    console.error(err);
  }
}

// CLI

process.on('unhandledRejection', err => {
  console.error('un-caught:', err);
  process.exit(1);
});

program
  .option('-w --watch', 'Watch for file changes and rebuild', false)
  .option('-f --for <for>', 'Which browser to build for', 'firefox')
  .option('-m --mode <mode>', 'The mode to build', 'dev')
  .action(async options => await build(options.for, options.mode, options.watch));

(async () => {
  await program.parseAsync(process.argv);
})();
