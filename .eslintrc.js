module.exports = {
    root: true,
    parserOptions: {
      parser: 'babel-eslint',
    },
    env: {
      browser: true,
      webextensions: true,
    },
    extends: [
      'standard',
      'eslint:recommended',
      '@vue/typescript',
      '@vue/typescript/recommended',
      '@vue/prettier',
      '@vue/prettier/@typescript-eslint'
    ],
    // required to lint *.vue files
    plugins: ['vue', '@typescript-eslint', 'prettier'],
    // add your custom rules here
    rules: {
      // allow async-await
      'generator-star-spacing': 'off',
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  };
  