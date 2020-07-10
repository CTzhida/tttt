const sass = require('sass');
const loadGruntTasks = require('load-grunt-tasks');
// const mozjpeg = require('imagemin-mozjpeg');
const browserSync = require('browser-sync').create();

module.exports = (grunt) => {
  grunt.initConfig({
    clean: { // 需要清楚的路径
      release: ['dist','temp'],
    },
    sass: {  
      options: {
        implementation: sass,
        sourceMap: true
      },
      main: {
        files: { // 目标路径和源文件路径
          'temp/assets/styles/main.css': 'src/assets/styles/main.scss',
        },
      },
    },
    babel: {
      options: { //使用哪个版本的babel
        presets: ['@babel/preset-env'],
      },
      main: {
        files: {
          'temp/assets/scripts/main.js': 'src/assets/scripts/main.js',
        },
      },
    },
    swigtemplates: {
      options: {
        defaultContext: { // 需要插入的模板数据
          menus: [
            {
              name: 'Home',
              icon: 'aperture',
              link: 'index.html',
            },
            {
              name: 'Features',
              link: 'features.html',
            },
            {
              name: 'About',
              link: 'about.html',
            },
            {
              name: 'Contact',
              link: '#',
              children: [
                {
                  name: 'Twitter',
                  link: 'https://twitter.com/w_zce',
                },
              ],
            },
          ],
          pkg: require('./package.json'),
          date: new Date(),
        },
      },
      production: {
        dest: 'temp',
        src: ['src/**/**.html'],
      },
    },
    // imagemin: {
    //   dynamic: {
    //     files: [
    //       {
    //         expand: true,
    //         cwd: 'src/assets/',
    //         src: ['{fonts,images}/*'],
    //         dest: 'dist/',
    //       },
    //     ],
    //   },
    // },
    copy: {
      main: {
        files: [
          { expand: true, src: ['public/*'], dest: 'dist/' },
          // 因imagemin安装不了，暂时直接复制处理
          { expand: true, src: ['src/assets/images/*'], dest: 'dist' },
          { expand: true, src: ['src/assets/fonts/*'], dest: 'dist' },
        ],
      },
    },
    watch: {
      // 检测文件变化，files为目标文件的通配符，tasks为变化之后需要进行的任务
      sass:{
        files: 'src/assets/styles/*.scss',
        tasks: ['sass']
      },
      script:{
        files: 'src/assets/scripts/*.js',
        tasks: ['babel']
      },
      page:{
        files:'src/*.html',
        tasks: ['swigtemplates']
      },
      imagefontmin:{
        files:['src/assets/images/**','src/assets/fonts/**'],
        tasks:['imagefontmin']
      },
      extra:{
        files:'public/**',
        task:['copy']
      }
    },
    browserSync: {
      options: {
        notify: false,
        server: {
          baseDir: ['dist', 'src', 'public'],
          routes: {
            '/node_modules': 'node_modules'
          }
        }
      },
      dev: { // 开发环境检测文件变化
        bsFiles: {
          src: ['dist/**']
        },
        options: {
          watchTask: true
        }
      },
      start: {  // 模拟环境，因生产环境已打包所以不再检测变化
        bsFiles: {
          src: 'dist'
        },
        options: {
          watchTask: false
        }
      }
    },
    useref: {
      html: 'dist/**/*.html',
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,  // 清楚注释
          collapseWhitespace: true,  // 清楚空格
        },
        files: [
          {
            expand: true,            // 使用当前目录
            cwd: 'temp',             // 中间文件
            src: '**/*.html',        // 源文件通配符
            dest: 'dist',            // 目标目录
          },
        ],
      },
    },
    uglify: {
      my_target: {
        files: {
          'dist/assets/scripts/main.min.js': 'temp/assets/scripts/*.js',
        },
      },
    },
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: 'temp/assets/styles',
            src: ['*.css', '!*.min.css'],
            dest: 'dist/assets/styles',
            ext: '.min.css',
          },
        ],
      },
    },
  });

  loadGruntTasks(grunt);  // 注册所有任务
  grunt.loadNpmTasks('grunt-browser-sync');

  //  组合需要抛出的任务（指令）

  grunt.registerTask('compile', [
    'clean',
    'sass',
    'babel',
    'swigtemplates'
  ])

  grunt.registerTask('serve', [
    'compile',
    'browserSync:dev',
    'watch'
  ])

  grunt.registerTask('userefPack', [
    'useref', 
    'uglify', 
    'cssmin',
    'htmlmin'
  ])

  grunt.registerTask('build',[
    'clean',
    'compile',
    // 'imagemin',
    'userefPack',
    'copy'
  ])

  grunt.registerTask('start', [
    'clean',
    'compile',
    'browserSync:start'
  ])
};