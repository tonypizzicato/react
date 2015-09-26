var gulp         = require('gulp');
var notify       = require('gulp-notify');
var gutil        = require('gulp-util');
var concat       = require('gulp-concat');
var clean        = require('gulp-clean');
var copy         = require('gulp-copy');
var less         = require('gulp-less');
var cssmin       = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');
var buffer       = require('gulp-buffer');
var sourcemaps   = require('gulp-sourcemaps');
var replace      = require('gulp-replace');
var uglify       = require('gulp-uglify');
var seq          = require('gulp-sequence');
var watch        = require('gulp-watch-less');
var browserify   = require('browserify');
var babelify     = require('babelify');
var envify       = require('envify');
var watchify     = require('watchify');
var source       = require('vinyl-source-stream');
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');

var paths = {
    PUBLIC: 'public',
    TMP:    '.tmp',
    DIST:   'dist',
    SERVER: 'server',
    VENDOR: 'node_modules'
};

/**
 * DEVELOPMENT
 */

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
        paths.VENDOR + '/medium-editor/dist/css/themes/flat.css',
        paths.VENDOR + '/normalize.css/normalize.css'
    ])
        .pipe(concat('vendor.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade:  false
        }))
        .pipe(gulp.dest(paths.TMP + '/styles/vendor'));
});

/**
 * Copy fonts to dest task
 */
gulp.task('copy.fonts', function () {
    return gulp.src([
        paths.VENDOR + '/material-design-fonticons/fonts/mdfonticon/**',
        paths.VENDOR + '/material-design-fonticons/fonts/mdfonticon-navigation/**'
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


/**
 * PROD
 */

/**
 * Clean build folder
 */
gulp.task('clean:dist', function () {
    return gulp.src(paths.DIST, {read: false})
        .pipe(clean());
});

/**
 * Less compiler task
 */
gulp.task('less:dist', function () {
    return gulp.src(paths.PUBLIC + '/styles/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade:  false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(paths.DIST + '/styles'));
});

/**
 * Copy vendor styles to dest task
 */
gulp.task('copy.styles:dist', function () {
    return gulp.src([
        paths.VENDOR + '/material-design-fonticons/styles/mdfi.css',
        paths.VENDOR + '/material-design-fonticons/styles/mdfi_navigation.css',
        paths.VENDOR + '/dropzone/dist/dropzone.css',
        paths.VENDOR + '/dropzone/dist/basic.css',
        paths.VENDOR + '/medium-editor/dist/css/medium-editor.css',
        paths.VENDOR + '/medium-editor/dist/css/themes/flat.css',
        paths.VENDOR + '/normalize.css/normalize.css'
    ])
        .pipe(concat('vendor.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade:  false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(paths.DIST + '/styles/vendor'));
});

/**
 * Copy fonts to dest task
 */
gulp.task('copy.fonts:dist', function () {
    return gulp.src([
        paths.VENDOR + '/material-design-fonticons/fonts/mdfonticon/**'
    ])
        .pipe(gulp.dest(paths.DIST + '/styles/fonts/'));
});

/**
 * Copy images to dest task
 */
gulp.task('copy.images:dist', function () {
    return gulp.src([
        paths.PUBLIC + '/images/**'
    ])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use:         [pngquant()]
        }))
        .pipe(gulp.dest(paths.DIST + '/images/'));
});

/**
 * Copy fonts to dest task
 */
gulp.task('copy.favicon:dist', function () {
    return gulp.src(paths.PUBLIC + '/favicon.ico')
        .pipe(gulp.dest(paths.DIST));
});

/**
 * Copy fonts to dest task
 */
gulp.task('copy.views:dist', function () {
    return gulp.src(paths.SERVER + '/views/*')
        .pipe(replace("href=\"/styles/", "href=\"/admin/site/styles/"))
        .pipe(replace("src=\"/scripts/", "src=\"/admin/site/scripts/"))
        .pipe(gulp.dest(paths.DIST + '/views/'));
});

/**
 * Build js with browserify task with processing react and watching for changes
 */
gulp.task('js:dist', function () {
    var src = (paths.PUBLIC + '/scripts/app.jsx');

    var bundler = browserify({
        entries:      [src],
        transform:    [[babelify, {optional: ["es7.classProperties"]}], ['envify', {'global': true, '_': 'purge', NODE_ENV: 'production'}]],
        cache:        {},
        packageCache: {}
    });

    bundler.on('time', function (time) {
        gutil.log(gutil.colors.green('Browserify'), gutil.colors.blue('in ' + time / 1000 + 's'));
    });

    return bundler
        .bundle()
        .on('error', notify.onError({
            title:   "Compile Error",
            message: "<%= error.message %>"
        }))
        .pipe(source('scripts/build.js'))
        .pipe(buffer())
        .pipe(replace("'/images/", "'/admin/site/images/"))
        .pipe(uglify())
        .pipe(gulp.dest(paths.DIST + '/'));
});


gulp.task('build', seq('clean', ['copy.styles', 'copy.fonts', 'less', 'js'], 'watch'));

gulp.task('dist', seq('clean:dist', ['copy.favicon:dist', 'copy.views:dist', 'copy.styles:dist', 'copy.images:dist', 'copy.fonts:dist', 'less:dist', 'js:dist']));
