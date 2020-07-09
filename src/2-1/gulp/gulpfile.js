// 实现这个项目的构建任务
const del = require('del')

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

const { src, dest, series, parallel } = require('gulp')

const data = {
    pkg: require('./package.json'),
    date: new Date()
}

const clean = () => {
    return del['dist']
}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('dist'))   
}

const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}

const page = () => {
  return src('src/**.html', { base: 'src' })
    .pipe(plugins.swig(data))  
    .pipe(dest('dist'))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))  
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

const compile = parallel(style, page, script, image, font)

const build = series(clean, parallel(compile, extra)) 

module.exports = {
  compile,
  build
}