const path = require('path')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const common = require('./webpack.common')
module.exports = merge(common, {
    mode: 'production',
    devtool: '#nosources-source-map',
    optimization: {
        minimizer: [ // 自定义压缩插件会覆盖webpack内部的压缩插件
          new OptimizeCssAssetsWebpackPlugin(), // 压缩提取的css
        ],
        splitChunks: {
            cacheGroups: {
                // 对引入的库代码（例如:lodash、jQuery等）进行代码的分割进行优化(这里没有用到)
                common: {
                    name: "app",
                    minChunks: 2,
                    chunks: 'async'
                }
            }
        }
    },
    plugins: [
        // 清除dist文件夹
        new CleanWebpackPlugin(),
        // 压缩JS代码
        new UglifyJsPlugin({
            test: /\.js$/,
            sourceMap: false,
            parallel: true
        }),
        new webpack.HashedModuleIdsPlugin(),
        // 打开gzip 需要服务器支持
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + ['js', 'css'].join('|') + ')$'
          ),
          threshold: 10240,
          minRatio: 0.8,
        }),
        // 复制public内的文件
        new CopyWebpackPlugin({
          patterns: [
            { from: './public', to: './' }
          ],
        }),
    ]
})