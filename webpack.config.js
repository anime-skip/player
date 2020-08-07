const webpack = require('webpack');
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const { VueLoaderPlugin } = require('vue-loader');
const { version } = require('./package.json');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const path = require('path');

const example = path.resolve(__dirname, 'example', 'index.html');

require('dotenv').config({ path: '.env.firefox' });

const config = {
  mode: process.env.NODE_ENV,
  context: __dirname + '/src',
  entry: {
    'background/index': './background/index.ts',
    'popup/index': './popup/index.ts',
    'options/index': './options/index.ts',

    'player/index': './player/index.ts',
    'content-scripts/example/index': './content-scripts/example/index.ts',
    'content-scripts/vrv/index': './content-scripts/vrv/index.ts',
    'content-scripts/all': './content-scripts/all.ts',
    'content-scripts/keyboard-blocker': './content-scripts/keyboard-blocker.ts',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              data: `
                @import "@/common/_variables.scss";
                @import "@/common/_mixins.scss";
              `,
            },
          },
        ],
      },
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax'],
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
    new webpack.DefinePlugin({
      global: 'window',
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyPlugin([
      { from: 'assets', to: 'assets', ignore: ['icon.xcf'] },
      { from: 'popup/index.html', to: 'popup/index.html', transform: transformHtml },
      { from: 'options/index.html', to: 'options/index.html', transform: transformHtml },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform: content => {
          const jsonContent = JSON.parse(content);
          jsonContent.version = version;

          if (config.mode === 'development') {
            jsonContent['content_security_policy'] =
              "script-src 'self' 'unsafe-eval'; object-src 'self'";
          }

          return JSON.stringify(jsonContent, null, 2);
        },
      },
    ]),
  ],
  devServer: {
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: false,
      errorDetails: false,
      warnings: false,
      publicPath: false,
    },
  },
};

if (config.mode === 'production') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
  ]);
} else {
  const customProfile = process.env.BROWSER_PROFILE_PATH
    ? `--firefox-profile=${process.env.BROWSER_PROFILE_PATH}`
    : '';
  config.plugins.push(
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: [
          `yarn web-ext --config=.web-ext.config.js run --url ${example} --url about:debugging#/runtime/this-firefox --url about:addons ${customProfile}`,
          'echo -e \x1b[1m\x1b[95mOpening Firefox...\x1b[0m',
        ],
        blocking: false,
        parallel: true,
      },
    })
  );
}

if (process.env.HMR === 'true') {
  config.plugins = (config.plugins || []).concat([
    new ExtensionReloader({
      manifest: __dirname + '/src/manifest.json',
    }),
  ]);
}

function transformHtml(content) {
  return ejs.render(content.toString().replace('.ts', '.js'), {
    ...process.env,
  });
}

module.exports = config;
