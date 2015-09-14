var gulp         = require('gulp');
var notify       = require('gulp-notify');
var gutil        = require('gulp-util');
var clean        = require('gulp-clean');
var copy         = require('gulp-copy');
var less         = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var replace      = require('gulp-replace');
var seq          = require('gulp-sequence');
var watch        = require('gulp-watch-less');
var browserify   = require('browserify');
var babelify     = require('babelify');
var watchify     = require('watchify');
var source       = require('vinyl-source-stream');

var paths = {
    PUBLIC: 'public',
    TMP:    '.tmp',
    DIST:   'dist',
    SERVER: 'server',
    VENDOR: 'node_modules'
};

/**
 * Clean build folder
 */
gulp.task('clean', function () {
    return gulp.src(paths.TMP, {read: false})
        .pipe(clean());
});

/**
 * Less compiler task
 */
gulp.task('less', function () {
    return gulp.src(paths.PUBLIC + '/styles/main.less')
        //.pipe(watch(paths.PUBLIC + '/styles/main.less'))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade:  false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.TMP + '/styles'));
});

/**
 * Watching for style files changes
 */
gulp.task('watch', function () {
    gulp.watch(paths.PUBLIC + '/styles/*.less', ['less']);
});

/**
 * Copy vendor styles to dest task
 */
gulp.task('copy.styles', function () {
    return gulp.src([
        paths.VENDOR + '/material-design-fonticons/styles/mdfi.css',
        paths.VENDOR + '/material-design-fonticons/styles/mdfi_navigation.css',
        paths.VENDOR + '/dropzone/dist/dropzone.css',
        paths.VENDOR + '/dropzone/dist/basic.css',
        paths.VENDOR + '/medium-editor/dist/css/medium-editor.css',
        paths.VENDOR + '/medium-editor/dist/css/themes/flat.css'
    ])
        .pipe(gulp.dest(paths.TMP + '/styles/vendor'));
});

/**
 * Copy fonts to dest task
 */
gulp.task('copy.fonts', function () {
    return gulp.src([
        paths.VENDOR + '/material-design-fonticons/fonts/mdfonticon/**'
    ])
        .pipe(gulp.dest(paths.TMP + '/styles/fonts/'));
});

/**
 * Build js with browserify task with processing react and watching for changes
 */
gulp.task('js', function () {
    var src = (paths.PUBLIC + '/scripts/app.jsx');

    var bundler = browserify({
        entries:      [src],
        transform:    [[babelify, {optional: ["es7.classProperties"]}]],
        debug:        true,
        cache:        {},
        packageCache: {},
        fullPaths:    true
    });

    bundler = watchify(bundler);


    bundler.on('time', function (time) {
        gutil.log(gutil.colors.green('Browserify'), gutil.colors.blue('in ' + time / 1000 + 's'));
    });

    function rebundle() {
        return bundler
            .bundle()
            .on('error', notify.onError({
                title:   "Compile Error",
                message: "<%= error.message %>"
            }))
            .pipe(source('scripts/build.js'))
            .pipe(gulp.dest(paths.TMP + '/'));
    }

    bundler.on('update', function () {
        rebundle();
        gutil.log(gutil.colors.green('Browserify'), gutil.colors.yellow('updating'));
    });

    return rebundle();
});

gulp.task('build', seq('clean', ['copy.styles', 'copy.fonts', 'less', 'js'], 'watch'));
