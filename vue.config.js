/* eslint-disable */
const path = require('path')

module.exports = {
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  chainWebpack: (config) => {
    config.resolve
      .alias
      .set('~', `${ path.resolve(__dirname) }/src`)
      .set('@', `${ path.resolve(__dirname) }/src`)

    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]',
      });
  },
}

