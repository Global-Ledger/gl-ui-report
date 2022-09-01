// for WebStorm
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['babel-loader', 'vue-svg-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': `${path.resolve(__dirname)}/src`,
      '~': `${path.resolve(__dirname)}/src`,
    },
  },
};
