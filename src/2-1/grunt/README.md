#### 使用模块

> "@babel/core": "^7.10.4",                    // babel转换ES6语法
    "@babel/preset-env": "^7.10.4",
    "browser-sync": "^2.26.7",
    "grunt": "^1.2.0",
    "grunt-contrib-clean": "^2.0.0",           // 清理文件夹
    "grunt-contrib-cssmin": "^3.0.0",          // 压缩css
    "grunt-parallel": "^0.5.1",
    "grunt-swigtemplates": "^0.1.2",           // 替换html模板
    "grunt-babel": "^8.0.0",
    "grunt-browser-sync": "^2.2.0",            // serve服务器
    "grunt-concurrent": "^3.0.0",
    "grunt-contrib-copy": "^1.0.0",            // 复制不需要改动的文件
    "grunt-contrib-htmlmin": "^3.1.0",         // 压缩html
    "grunt-contrib-imagemin": "^4.0.0",        // 压缩图片，因下载不下来 没做这个处理，直接进行了复制
    "grunt-contrib-uglify": "^4.0.1",          // 压缩文件  
    "grunt-contrib-watch": "^1.1.0",           // 检测变化
    "grunt-css": "^0.5.4",                      
    "grunt-sass": "^3.1.0",                    // 处理scss文件
    "grunt-useref": "^0.0.16",                 // 合并第三方文件
    "imagemin-mozjpeg": "^9.0.0",              // 压缩图片，因下载不下来 没做这个处理，直接进行了复制
    "load-grunt-tasks": "^5.1.0",              // 自动主持任务
    "node-sass": "^4.14.1",                        
    "sass": "^1.26.9"

    主要是一些工具包的配置选项，不在这里一一贴出，请翻阅代码中的注释，不便之处敬请谅解。