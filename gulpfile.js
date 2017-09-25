var gulp = require('gulp')
var gutil = require('gulp-util')
var uglify = require('gulp-uglify')
//var uglifyjs = require('uglify-js-harmony');
//var minifier = require('gulp-uglify/minifier');
//minifier({}, uglifyjs),
var watchPath = require('gulp-watch-path')
var combiner = require('stream-combiner2')
//var sourcemaps = require('gulp-sourcemaps')
var minifycss = require('gulp-clean-css')
//var autoprefixer = require('gulp-autoprefixer')
var sass = require('gulp-sass')
var automerge = require('gulp-automerge');
var rename = require('gulp-rename')
var imagemin = require('gulp-imagemin')
var htmlmin = require('gulp-html-minify')
var clean = require('gulp-clean');
var template = require('gulp-template');
var autoprefixer = require('gulp-autoprefixer');

var config = require('./gulpConfig');
var srcPath = config.srcPath;
var distPath = config.distPath;

var options = gutil.env;
var env = options.e || 'pro';//连接环境
var dev = options.dev || false;//连接环境
var tpls = {},
    tplKeys = Object.keys(config.templateVar[env]) || [];

tplKeys.map(function(key){
    tpls[key] = (typeof config.templateVar[env][key] == 'object')?JSON.stringify(config.templateVar[env][key]):config.templateVar[env][key];
})

var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}

gulp.task("clean", function(){
    return gulp.src(distPath+'/*')
        .pipe(clean());
})

gulp.task('template', function() {
    gulp.src(config.tplConf.src)
        .pipe(template({domainConf: JSON.stringify(config.templateVar[env].domainConf)}))
        .pipe(gulp.dest(distPath))
});

gulp.task('watchhtml', function () {
    gulp.watch(config.other.src, function (event) {
        var paths = watchPath(event, srcPath, distPath)
        /*
         paths
         { srcPath: 'src/js/log.js',
         srcDir: 'src/js/',
         distPath: 'dist/js/log.js',
         distDir: 'dist/js/',
         srcFilename: 'log.js',
         distFilename: 'log.js' }
         */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        gulp.src(paths.srcPath)
            .pipe(htmlmin())
            .pipe(gulp.dest(paths.distDir));
    })
})

gulp.task('htmlmin', function () {
    gulp.src(config.other.src,{base:srcPath})
        .pipe(htmlmin())
        .pipe(gulp.dest(distPath));
});

gulp.task('watchjs', function () {
    gulp.watch(config.js.src, function (event) {
        var paths = watchPath(event, srcPath, distPath)
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        var combined = dev?combiner.obj([
            gulp.src(paths.srcPath),
            //sourcemaps.init(),
            template(tpls),
            //sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]):combiner.obj([
            gulp.src(paths.srcPath),
            //sourcemaps.init(),
            template({
                domainConf: JSON.stringify(config.templateVar[env].domainConf),
                environment:config.templateVar[env].environment
            }),
            uglify(),
            //sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]);

        combined.on('error', handleError);
    })
})

gulp.task('uglifyjs', function () {



    var combined = dev?combiner.obj([
        gulp.src(config.js.src),
        //sourcemaps.init(),
        template(tpls),
        //sourcemaps.write('./'),
        gulp.dest(distPath)
    ]):combiner.obj([
        gulp.src(config.js.src),
        //sourcemaps.init(),
        template({
            domainConf: JSON.stringify(config.templateVar[env].domainConf),
            environment:config.templateVar[env].environment
        }),
        uglify(),
        //sourcemaps.write('./'),
        gulp.dest(distPath)
    ]);
    combined.on('error', handleError)
})


gulp.task('watchsass',function () {
    gulp.watch(config.css.src, function (event) {
        var paths = watchPath(event, srcPath, distPath)

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        gulp.src(paths.srcPath)
            .on('error', function (err) {
                console.error('Error!', err.message);
            })
            //.pipe(sourcemaps.init())
            .pipe(automerge({
                prefixApplyType: 'all',
                prefixText: '@import "{relativePrefix}style/base/_variables.scss"; @import "{relativePrefix}style/base/_mixin.scss"; @import "{relativePrefix}style/base/_animation.scss";',
                replaceExt: '.wxml',
                regexp:/<import [^>]*src=[\'\"][^\'\"]+?\/template\/([\w-]+)\/\w+\.\w+[\'\"]\s*\/>/g,
                appendTpl: '@import "{relativePrefix}template/{name}/index.scss";'
            }))
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0', 'iOS >= 8.0'],
                cascade: true,
                remove:true //是否去掉不必要的前缀 默认：true
            }))
            .pipe(rename({
                extname: ".wxss"
            }))
            //.pipe(minifycss({advanced:false}))
            //.pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('sasscss', function () {
    gulp.src(config.css.src)
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        //.pipe(sourcemaps.init())
        .pipe(automerge({
            prefixApplyType: 'all',
            prefixText: '@import "{relativePrefix}style/base/_variables.scss"; @import "{relativePrefix}style/base/_mixin.scss"; @import "{relativePrefix}style/base/_animation.scss";',
            replaceExt: '.wxml',
            regexp:/<import [^>]*src=[\'\"][^\'\"]+?\/template\/([\w-]+)\/\w+\.\w+[\'\"]\s*\/>/g,
            appendTpl: '@import "{relativePrefix}template/{name}/index.scss";'
        }))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0', 'iOS >= 8.0'],
            cascade: true,
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(rename({
            extname: ".wxss"
        }))
        //.pipe(minifycss({advanced:false}))
        //.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distPath))
})

gulp.task('watchimage', function () {
    gulp.watch(config.image.src, function (event) {
        var paths = watchPath(event, srcPath, distPath)

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('image', function () {
    gulp.src(config.image.src)
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(distPath + 'images'))
})

gulp.task('default', ['clean'], function(){
    gulp.start(
        // build
        'uglifyjs', 'sasscss', 'htmlmin',
        // watch
        'watchjs', 'watchsass', 'watchhtml'
    );
})

gulp.task('build', ['clean'], function(){
    gulp.start('uglifyjs', 'sasscss', 'htmlmin','image');
});
gulp.task('watch', ['watchjs', 'watchsass', 'watchhtml'])