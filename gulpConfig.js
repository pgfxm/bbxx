var srcPath = 'src/';
var distPath = 'dist/';
var config = {
    srcPath: srcPath,
    distPath: distPath,
    templateVar:{
        pro:{//请求的域名前缀
            domainConf:{
                request : "https://wxshow.vipsinaapp.com",//https://xcx.weidian.com
            },
            environment:3
        },
        pre:{//请求的域名前缀
            domainConf:{
                request : "https://wxshow.vipsinaapp.com",//https://xcx.weidian.com
            },
            environment:2
        },
        test:{//请求的域名前缀
            domainConf:{
                request : "https://wxshow.vipsinaapp.com",//https://xcx.weidian.com
            },
            environment:1
        }
    },
    excludeFolder:['!'+srcPath+'pages/income/**/*.*','!'+srcPath+'pages/notice/**/*.*','!'+srcPath+'pages/member/**/*.*','!'+srcPath+'lib/wxCashierApp/**/*.*'],
    js:{
        src:[srcPath + '**/*.js','!' + srcPath + 'lib/**/app.js']
    },
    css:{
        src:[srcPath + '**/*.*ss','!'+srcPath+'style/**/*.*ss','!'+srcPath+'template/**/*.*ss','!'+srcPath+'lib/**/app.wxss','!'+srcPath+'lib/groupon/**/*.wxss']
    },
    image:{
        src:srcPath + 'images/**/*'
    },
    other:{
        src:[srcPath + '**/*.wxml',srcPath + '**/*.json',srcPath + 'lib/groupon/**/*.wxss','!'+srcPath+'lib/groupon/**/app.wxss','!' + srcPath + '**/bower.json','!' + srcPath + 'lib/**/app.json']
    }
}
config.js.src = config.js.src.concat(config.excludeFolder);
config.css.src = config.css.src.concat(config.excludeFolder);
config.other.src = config.other.src.concat(config.excludeFolder);
module.exports = config;