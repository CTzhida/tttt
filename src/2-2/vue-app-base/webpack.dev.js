const { merge } = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    // 开发环境使用source-map
    devtool: 'source-map',
    // webpack-dev-server 配置
    devServer: {
        hot: true,
        host: 'localhost',
        port: 9527,
        open: true,
        contentBase: './public'
    },
    plugins: [
        // 打开热更新插件
        new webpack.HotModuleReplacementPlugin()
    ]
})