// 实现这个项目的构建任务
const del = require('del')
const browserSync = require('browser-sync')


const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create();

const { src, dest, series, parallel, watch } = require('gulp')

const data = {
    pkg: require('./package.json'),
    date: new Date()
}

const clean = () => {
    return del(['dist', 'temp'])
}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

const page = () => {
  return src('src/**.html', { base: 'src' })
    .pipe(plugins.swig(data))  
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    // .pipe(plugins.imagemin())
    .pipe(dest('dist'))  
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    // .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/**.html', page)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    notify: false,
    // files: 'dist/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  return src("temp/*.html", { base: "temp" })
    .pipe(plugins.useref({ searchPath: ["temp", "."] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest("dist"));
}

const lint = () => {
  return src('temp/**.js')
    .pipe(plugins.eslint())
    .pipe(dest('dist'))
}



var localDirectory  = 'dist',     //打包文件的名称
    workDirectory   = '/home/html/tmp',     //服务器地址
    commands = 'rm -f ' + workDirectory;    //删除文件命令

var gulpSSH = new plugins.ssh({
    ignoreErrors: false,
    sshConfig: {
        "host": "",	//服务器host
        "port": "",		//服务器端口
        "username": "",	//登陆服务器账号
        "password": ""	//登陆服务器密码
    }
});

const delRemoteFile = async () => {
  await gulpSSH.shell(commands)
}

const deploy1 = async () => {
  await src(localDirectory + '/**',{ buffer: false }).pipe(gulpSSH.dest(workDirectory + '/'))
}

const compile = parallel(style, page, script)

const build = series(
  clean, 
  parallel(
    series(compile, useref),
    image, 
    font,
    extra
  )) 

const start = series(compile, serve)

const deploy = series(parallel(build,delRemoteFile), deploy1)

module.exports = {
  clean,
  lint,
  // compile,
  // style,
  // script,
  // image,
  build,
  serve,
  start,
  deploy,
  // useref
}