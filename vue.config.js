module.exports = {
  filenameHashing: false, 
  pages: {
    player: { entry: 'src/player/main.ts' },
    options: { entry: 'src/options/main.ts' },
    popup: { entry: 'src/popup/main.ts' },
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
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
