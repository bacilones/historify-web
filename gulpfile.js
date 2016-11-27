'use strict';

const gulp           = require('gulp');
const mainBowerFiles = require('main-bower-files');
const inject         = require('gulp-inject');
const rename         = require('gulp-rename');
const exists         = require('path-exists').sync;
const _              = require('lodash');
const del            = require('del');
const babel          = require('gulp-babel');
const nodemon        = require('gulp-nodemon');
const browserSync    = require('browser-sync');
const uglify         = require('gulp-uglify');
const ngannotate     = require('gulp-ng-annotate');
const minify         = require('gulp-minify-css');
const prefix         = require('gulp-autoprefixer');
const htmlmin        = require('gulp-htmlmin');


// Deploy Tasks
//const tasks = require('./tasks/deploy/task');

// Origin and destination paths
const path = {
    source: {

        all : 'src/**/*',
        web : 'src/web/**/*',
        api : 'src/api/**/*',

        index   : 'src/web/index.html',
        views   : 'src/web/app/**/*.html',
        favicon : 'src/web/favicon.*',

        // Angularjs App
        app           : 'src/web/app/app.js',
        appCore       : 'src/web/app/core/core.module.js',
        appModule     : ['src/web/app/**/*.module.js', '!src/web/core/core.module.js'],
        appFactory    : 'src/web/app/**/*.factory.js',
        appConfig     : 'src/web/app/**/*.config.js',
        appController : 'src/web/app/**/*.controller.js',
        appDirective  : 'src/web/app/**/*.directive.js',
        appFilter     : 'src/web/app/**/*.filter.js',

        // Resources
        coreCss    : 'src/web/app/core/core.css',
        css        : ['src/web/app/**/*.css','!src/web/app/core/core.css'],
        resources  : 'src/web/resources/**/*',
        landing    : 'src/web/landing/**/*',
        pago       : 'src/web/pago/**/*',
        bower      : 'bower_components/**/*',
        bowerFonts : 'bower_components/**/*.{ttf,woff,woff2,eof,svg,otf}'
    },
    deploy : {
        root      : 'deploy',
        app       : 'deploy/app',
        appCore   : 'deploy/app/core',
        css       : 'deploy/css',
        vendor    : 'deploy/vendor',
        fonts     : 'deploy/fonts',
        resources : 'deploy/resources',
        landing   : 'deploy/landing',
        pago      : 'deploy/pago'
    },
    develop : {
        root      : 'develop',
        app       : 'develop/app',
        appCore   : 'develop/app/core',
        css       : 'develop/css',
        vendor    : 'develop/vendor',
        fonts     : 'develop/fonts',
        resources : 'develop/resources',
        landing   : 'develop/landing',
        pago      : 'develop/pago'
    }
};


// Delete deploy generated directory
gulp.task('clean', gulp.series(() => {
    return del(['deploy']);
}));


// Delete develop generated directory
gulp.task('clean-dev', gulp.series(() => {
    return del(['develop']);
}))


/*
* Copy Prod
* Copy all front end files transpiled , annotated and minified to deploy folder.
* Minify all vendors files
* Inject all scripts into index.html
*/

gulp.task('copy-prod', gulp.series('clean', () => {
    let out = {
        views: gulp.src(path.source.views)
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(path.deploy.root)),

        favicon: gulp.src(path.source.favicon)
            .pipe(gulp.dest(path.deploy.root)),

        app: gulp.src(path.source.app)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(uglify())
            .pipe(gulp.dest(path.deploy.app)),

        appCore: gulp.src(path.source.appCore)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(uglify())
            .pipe(gulp.dest(path.deploy.appCore)),

        appModule: gulp.src(path.source.appModule)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(uglify())
            .pipe(gulp.dest(path.deploy.app)),

        appFactory: gulp.src(path.source.appFactory)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(uglify())
            .pipe(gulp.dest(path.deploy.app)),

        appConfig: gulp.src(path.source.appConfig)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(uglify())
            .pipe(gulp.dest(path.deploy.app)),

        appController: gulp.src(path.source.appController)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(uglify())
            .pipe(gulp.dest(path.deploy.app)),

        appDirective: gulp.src(path.source.appDirective)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(uglify())
            .pipe(gulp.dest(path.deploy.app)),

        appFilter: gulp.src(path.source.appFilter)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(uglify())
            .pipe(gulp.dest(path.deploy.app)),

        coreCss: gulp.src(path.source.coreCss)
            .pipe(minify())
            .pipe(prefix())
            .pipe(gulp.dest(path.deploy.css)),

        css: gulp.src(path.source.css)
            .pipe(minify())
            .pipe(prefix())
            .pipe(gulp.dest(path.deploy.css)),

        resources: gulp.src(path.source.resources)
            .pipe(gulp.dest(path.deploy.resources)),

        landing: gulp.src(path.source.landing)
            .pipe(gulp.dest(path.deploy.landing)),

        pago: gulp.src(path.source.pago)
            .pipe(gulp.dest(path.deploy.pago)),

        vendor: gulp.src(adjustVendorFiles())
            .pipe(gulp.dest(path.deploy.vendor)),

        fonts: gulp.src(path.source.bowerFonts)
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(path.deploy.fonts))
    };

    function adjustVendorFiles() {
        //vendors min
        var vendorFiles = _.map(mainBowerFiles(),
            function (path) {
                var nuevoPath = path.replace(/.([^.]+)$/g, '.min.$1');
                return exists(nuevoPath) ? nuevoPath : path;
            });

        vendorFiles.forEach(function (path, index, arr) {
            var jsMap = path + '.map';
            if (exists(jsMap)) {
                arr.push(jsMap);
            }
        });

        return vendorFiles;
    }
    // inject references into index.html, then copy.
    return gulp.src(path.source.index)
        .pipe(gulp.dest(path.deploy.root))
        .pipe(inject(out.app, {relative: true, name: 'app'}))
        .pipe(inject(out.appCore, {relative: true, name: 'core'}))
        .pipe(inject(out.appModule, {relative: true, name: 'module'}))
        .pipe(inject(out.appFactory, {relative: true, name: 'factory'}))
        .pipe(inject(out.appConfig, {relative: true, name: 'config'}))
        .pipe(inject(out.appController, {relative: true, name: 'controller'}))
        .pipe(inject(out.appDirective, {relative: true, name: 'directive'}))
        .pipe(inject(out.appFilter, {relative: true, name: 'filter'}))
        .pipe(inject(out.coreCss, {relative: true, name: 'corecssinject'}))
        .pipe(inject(out.css, {relative: true, name: 'cssinject'}))
        .pipe(inject(out.vendor, {relative: true, name: 'vendor'}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.deploy.root));
}));


/**
* Copy dev
* Copy all front end files without transpilation and annotated to develop folder.
* Minify all vendors files
* Inject all scripts into index.html
*/

gulp.task('copy-dev', gulp.series('clean-dev', function () {
    let out = {
        views: gulp.src(path.source.views)
            .pipe(gulp.dest(path.develop.root)),

        favicon: gulp.src(path.source.favicon)
            .pipe(gulp.dest(path.develop.root)),

        app: gulp.src(path.source.app)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(gulp.dest(path.develop.app)),

        appCore: gulp.src(path.source.appCore)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(gulp.dest(path.develop.appCore)),

        appModule: gulp.src(path.source.appModule)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(gulp.dest(path.develop.app)),

        appFactory: gulp.src(path.source.appFactory)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(gulp.dest(path.develop.app)),

        appConfig: gulp.src(path.source.appConfig)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(gulp.dest(path.develop.app)),

        appController: gulp.src(path.source.appController)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(gulp.dest(path.develop.app)),

        appDirective: gulp.src(path.source.appDirective)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(gulp.dest(path.develop.app)),

        appFilter: gulp.src(path.source.appFilter)
            .pipe(babel({presets: ['es2015']}))
            .pipe(ngannotate())
            .pipe(gulp.dest(path.develop.app)),

        coreCss: gulp.src(path.source.coreCss)
            .pipe(prefix())
            .pipe(gulp.dest(path.develop.css)),

        css: gulp.src(path.source.css)
            .pipe(prefix())
            .pipe(gulp.dest(path.develop.css)),

        resources: gulp.src(path.source.resources)
            .pipe(gulp.dest(path.develop.resources)),

        landing: gulp.src(path.source.landing)
            .pipe(gulp.dest(path.develop.landing)),

        pago: gulp.src(path.source.pago)
            .pipe(gulp.dest(path.develop.pago)),

        vendor: gulp.src(adjustVendorFiles())
            .pipe(gulp.dest(path.develop.vendor)),

        fonts: gulp.src(path.source.bowerFonts)
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(path.develop.fonts))
    };

    function adjustVendorFiles() {
        //vendors min
        var vendorFiles = _.map(mainBowerFiles(),
            function (path) {
                var nuevoPath = path.replace(/.([^.]+)$/g, '.min.$1');
                return exists(nuevoPath) ? nuevoPath : path;
            });

        vendorFiles.forEach(function (path, index, arr) {
            var jsMap = path + '.map';
            if (exists(jsMap)) {
                arr.push(jsMap);
            }
        });

        return vendorFiles;
    }

    // inject references into index.html, then copy.
    return gulp.src(path.source.index)
        .pipe(gulp.dest(path.develop.root))
        .pipe(inject(out.app, {relative: true, name: 'app'}))
        .pipe(inject(out.appCore, {relative: true, name: 'core'}))
        .pipe(inject(out.appModule, {relative: true, name: 'module'}))
        .pipe(inject(out.appFactory, {relative: true, name: 'factory'}))
        .pipe(inject(out.appConfig, {relative: true, name: 'config'}))
        .pipe(inject(out.appController, {relative: true, name: 'controller'}))
        .pipe(inject(out.appDirective, {relative: true, name: 'directive'}))
        .pipe(inject(out.appFilter, {relative: true, name: 'filter'}))
        .pipe(inject(out.coreCss, {relative: true, name: 'corecssinject'}))
        .pipe(inject(out.css, {relative: true, name: 'cssinject'}))
        .pipe(inject(out.vendor, {relative: true, name: 'vendor'}))
        .pipe(gulp.dest(path.develop.root));
}));


/**
 * pre-deploy
 * Validations before deploy
 */

//gulp.task('pre-deploy', tasks.preDeploy);


/**
 * deploy-process
 * Atomatization of Becual deployment process
 */

//gulp.task('deploy-process', tasks.deploy)


/**
 * deploy
 * Validate,  copy files minified to deploy folder then, run deploy-process task
 */

//gulp.task('deploy', gulp.series('pre-deploy', 'copy-prod', 'deploy-process'));


/**
 * Watch for changes to rewrite files on development
 */

gulp.task('watch', gulp.series(function () {
    return gulp.watch(
        path.source.web,
        gulp.series('copy-dev', 'reload-browsers')
    );
}));


gulp.task('reload-browsers', function () {
    browserSync.reload();
    return Promise.resolve();
});


gulp.task('serve', gulp.series('copy-dev', function() {

    browserSync.init(null, {
        proxy       : 'http://localhost:1414',
        open        : false
    });


    return gulp.task('watch')();
}));



gulp.task('default', gulp.series('copy-dev'));