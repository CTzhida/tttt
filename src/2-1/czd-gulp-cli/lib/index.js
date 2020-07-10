// 实现这个项目的构建任务
const del = require('del')
const browserSync = require('browser-sync')


const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create();

const { src, dest, series, parallel, watch } = require('gulp')

const cwd = process.cwd()
let config = {
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/image/**',
      fonts: 'assets/fonts/**',
    }
  }
}

try {
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({}, config, loadConfig)
} catch (e) { 

}

const clean = () => {
    return del([config.build.dist, config.build.temp])
}

const style = () => {
  return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest(config.build.dist))
    .pipe(bs.reload({ stream: true }))
}

const script = () => {
  return src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }))
}

const page = () => {
  return src(config.build.paths.pages, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.swig({
       data: config.data
    }))  
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }))
}

const image = () => {
  return src(config.build.paths.images, { base: config.build.src, cwd: config.build.src })
    // .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))  
}

const font = () => {
  return src(config.build.paths.fonts, { base: config.build.src, cwd: config.build.src })
    // .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const extra = () => {
  return src('**', { base: config.build.src, cwd: config.build.public })
    .pipe(dest(config.build.dist))
}

const serve = () => {
  watch(config.build.paths.styles, { cwd: config.build.src }, style)
  watch(config.build.paths.scripts, { cwd: config.build.src }, script)
  watch(config.build.paths.pages, { cwd: config.build.src }, page)
  watch([
    config.build.paths.images,
    config.build.paths.fonts
  ], { cwd: config.build.src }, bs.reload)

  watch('**', { cwd: config.build.public }, bs.reload)

  bs.init({
    notify: false,
    // files: 'dist/**',
    server: {
      baseDir: [config.build.temp, config.build.src, config.build.public],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  return src(config.build.paths.pages, { base: config.build.temp, cwd: config.build.src })
    .pipe(plugins.useref({ searchPath: [ config.build.temp, "."] }))
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
    .pipe(dest(config.build.dist));
}

const lint = () => {
  return src(config.build.temp + '/**.js', { cwd:config.build.src })
    .pipe(plugins.eslint())
    .pipe(dest(config.build.dist))
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