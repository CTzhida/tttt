const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const packageConfig = require('./package.json')


function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  mode: 'none',
  entry: path.join(__dirname, './src/main.js'),
  output: {
    filename: '[name].[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    // 重新名快捷路径
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        // 使用vue-loader转换.vue文件
        test: /\.vue$/,
        use: {
          loader: 'vue-loader'
        }
      },
      {
        // 对JS文件进行转换
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        // 对.vue和JS文件进行格式化转换
        test: /\.(js|vue)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        // 指定检查的目录
        include: [path.resolve(__dirname, 'src')], 
        options: {
            // 指定错误报告的格式规范
            formatter: require('eslint-friendly-formatter') 
        }
      },
      {
        // 处理css文件
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader'
        ]
      },
      {
        // less 文件配置
        test: /\.less/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        // 图片配置
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 10,
            esModule: false
          }
        }
      },
      {
        // 字体图标配置
        test: /\.(eot|svg|ttf|woff2|woff|otf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 10
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css'
    }),
    // vue-loader 配套组件
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: packageConfig.name,
      // 模板html
      template: './public/index.html'
    }),
    new webpack.DefinePlugin({
      // 注入全局变量
      BASE_URL: '"./"'
    })
  ]
}
