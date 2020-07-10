const sass = require('sass');
const loadGruntTasks = require('load-grunt-tasks');
// const mozjpeg = require('imagemin-mozjpeg');
const browserSync = require('browser-sync').create();

module.exports = (grunt) => {
  grunt.initConfig({
    clean: {
      release: ['dist','temp'],
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      main: {
        files: {
          'temp/assets/styles/main.css': 'src/assets/styles/main.scss',
        },
      },
    },
    babel: {
      options: {
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
        defaultContext: {
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
      // options: {
      //   separator: ': ',
      //   punctuation: ' !!!',
      // },
      // files: {
      //   'dist/assets': ['src/assets/fonts/*', 'src/assets/images/*'],
      // },
  
      main: {
        files: [
          { expand: true, src: ['public/*'], dest: 'dist/' },
          { expand: true, src: ['src/assets/images/*'], dest: 'dist' },
          { expand: true, src: ['src/assets/fonts/*'], dest: 'dist' },
        ],
      },
    },
    watch: {
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
      dev: {
        bsFiles: {
          src: ['dist/**']
        },
        options: {
          watchTask: true
        }
      },
      start: {
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
          removeComments: true,
          collapseWhitespace: true,
        },
        files: [
          {
            expand: true,
            cwd: 'temp',
            src: '**/*.html',
            dest: 'dist',
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

  loadGruntTasks(grunt);
  grunt.loadNpmTasks('grunt-browser-sync');

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