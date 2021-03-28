#!/usr/bin/env node
const webpack = require('webpack');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const { services, getManifest } = require('./src/manifest');

require('dotenv').config();

const args = yargs(hideBin(process.argv))
  .choices('mode', ['prod', 'beta', 'staged', 'dev'])
  .default('mode', 'dev')

  .boolean('build')

  .choices('for', ['firefox', 'chrome'])
  .default('for', 'firefox')

  .version(false).argv;

//#region Script Helpers

function relativePath(...paths) {
  return path.resolve(process.cwd(), ...paths);
}

function transformHtml(content) {
  return ejs.render(content.toString().replace('.ts', '.js'), {
    ...process.env,
  });
}

//#endregion

//#region Base Config

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const { VueLoaderPlugin } = require('vue-loader');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const ejs = require('ejs');

const config = {
  context: relativePath('src'),
  entry: {
    'background/index': './background/index.ts',
    'popup/index': './popup/index.ts',
    'options/index': './options/index.ts',

    'player/index': './player/index.ts',
    'content-scripts/all': './content-scripts/all.ts',
    'content-scripts/keyboard-blocker': './content-scripts/keyboard-blocker.ts',
    'content-scripts/anime-skip/index': './content-scripts/anime-skip/index.ts',
  },
  // TODO: Investigate code splitting options
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      assert: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/assets/',
          emitFile: false,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/fonts/',
          emitFile: false,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ global: 'window' }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyPlugin([
      { from: '../node_modules/webextension-polyfill/dist/browser-polyfill.js' },
      { from: 'assets', to: 'assets', ignore: ['icon.xcf'] },
      { from: 'popup/index.html', to: 'popup/index.html', transform: transformHtml },
      { from: 'options/index.html', to: 'options/index.html', transform: transformHtml },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform: _ => {
          try {
            console.log('Generating manifest...');
            const manifest = JSON.stringify(
              getManifest(nameVariants, args.for, args.mode),
              null,
              2
            );
            console.log('Done!');
            return manifest;
          } catch (err) {
            console.error('Failed to generate manifest:', err);
            throw err;
          }
        },
      },
    ]),
  ],
  stats: {
    assetsSort: '!size',
    entrypoints: false,
    excludeAssets: [/.*\.(png|svg)$/],
    modules: false,
  },
};

//#endregion

const baseName = 'Anime Skip Player';
const nameVariants = [];

const addEnvironmentVariable = (key, value) => {
  config.plugins.unshift(
    new webpack.DefinePlugin({
      'process.env': { [key]: `"${value}"` },
    })
  );
};

const defineVueBuildOptions = options => {
  config.plugins.unshift(
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: options.devTools,
    })
  );
};

const enableHotReloading = () => {
  let startArgs = [];
  if (process.env.USE_PROFILE === 'true') {
    const exampleUrl = relativePath('example/index.html');
    const useProfile = process.env.USE_PROFILE === 'true';
    if (args.for === 'firefox') {
      startArgs = [
        '--target firefox-desktop',
        useProfile ? `--firefox-profile=${process.env.FIREFOX_PROFILE_PATH}` : '',
        `--url ${exampleUrl}`,
        '--url about:debugging#/runtime/this-firefox',
        '--url about:addons',
      ];
    } else if (args.for === 'chrome') {
      startArgs = [
        '--target chromium',
        '--chromium-binary google-chrome',
        useProfile ? `--chromium-profile=${process.env.CHROME_PROFILE_PATH}` : '',
        `--url ${exampleUrl}`,
        '--url chrome://extensions',
      ];
    } else {
      console.warn('Auto opening ' + args.for + ' is not implemented');
    }
  }
  config.plugins.push(
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: [
          `yarn web-ext --config=.web-ext.config.js run ${startArgs.join(' ')}`,
          `echo -e \x1b[1m\x1b[95mOpening ${args.for}...\x1b[0m`,
        ],
        blocking: false,
        parallel: true,
      },
    })
  );

  config.plugins.push(
    new ExtensionReloader({
      manifest: relativePath('src/manifest.json'),
    })
  );
};

switch (args.mode) {
  case 'prod': {
    config.mode = 'production';
    addEnvironmentVariable('NODE_ENV', 'production');
    defineVueBuildOptions({ devTools: false });
    break;
  }
  case 'beta': {
    config.mode = 'production';
    nameVariants.push('Beta');
    addEnvironmentVariable('NODE_ENV', 'production');
    addEnvironmentVariable('IS_BETA', true);
    defineVueBuildOptions({ devTools: false });
    break;
  }
  case 'staged': {
    config.mode = 'production';
    nameVariants.push('Staged');
    addEnvironmentVariable('NODE_ENV', 'production');
    addEnvironmentVariable('ENABLE_LOGGING', true);
    addEnvironmentVariable('IS_STAGED', true);
    defineVueBuildOptions({ devTools: true });
    break;
  }
  case 'dev': {
    config.mode = 'development';
    nameVariants.push('Dev');
    addEnvironmentVariable('NODE_ENV', 'development');
    addEnvironmentVariable('ENABLE_LOGGING', true);
    defineVueBuildOptions({ devTools: true });
    break;
  }
}

if (!args.build) {
  enableHotReloading();
}

services.forEach(service => {
  const servicePath = `content-scripts/${service.folder}`;
  config.entry[`${servicePath}/globals`] = `./${servicePath}/globals.ts`;
  config.entry[`${servicePath}/parent`] = `./${servicePath}/parent.ts`;
});

const compiler = webpack(config);
const close = () => {
  compiler.close(err => {
    if (!err) return;

    console.error('Failed to close compiler:', err);
  });
};

if (args.build) {
  compiler.run(close);
} else {
  compiler.watch({}, () => {
    // console.
  });
}
