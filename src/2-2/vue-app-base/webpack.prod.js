const path = require('path')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const common = require('./webpack.common')
module.exports = merge(common, {
    mode: 'production',
    devtool: '#nosources-source-map',
    optimization: {
        minimizer: [ // 自定义压缩插件会覆盖webpack内部的压缩插件
          new OptimizeCssAssetsWebpackPlugin(), // 压缩提取的css
        ]
      },
    plugins: [
        // 清除dist文件夹
        new CleanWebpackPlugin(),
        new UglifyJsPlugin({
            sourceMap: false,
            parallel: true
        }),
        // new ExtractTextPlugin({
        //     filename: path.posix.join('./', 'css/[name].[contenthash].css'),
        //     allChunks: true,
        //   }),
    ]
})