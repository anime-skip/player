const path = require('path');

module.exports = {
  filenameHashing: false, 
  pages: {
    player: { entry: 'src/pages/player/main.ts' },
    options: { entry: 'src/pages/options/main.ts' },
    popup: { entry: 'src/pages/popup/main.ts' },
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    resolve: {
      alias: {
        '@Shared': path.resolve(__dirname, 'src/shared'),
      },
    },
  },

  // chainWebpack: config => {
  //   config.module
  //     .rule('ts')
  //     .use('ts-loader')
  //     .loader('ts-loader')
  //     .tap(options => ({
  //       ...options, configFile: "./tsconfig-player.json",
  //     }));

  //   config.module
  //     .rule('tsx')
  //     .use('ts-loader')
  //     .loader('ts-loader')
  //     .tap(options => ({
  //       ...options, configFile: "./tsconfig-player.json",
  //     }));
  // },
}
