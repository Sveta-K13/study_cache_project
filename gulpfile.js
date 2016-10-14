var gulp           = require('gulp');
var babel          = require('gulp-babel');
var browserify     = require('gulp-browserify');
var babelify       = require("babelify");
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', () => {
    return gulp.src('src/**/*.js')
          .pipe(sourcemaps.init())
          .pipe(browserify({transform: [babelify], presets: ['es2015'] }))
        // .pipe(babel({
        //     presets: ['es2015']
        // }))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('app/'));
});

gulp.task('watch:js',  function () {
    gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('default', ['watch:js']);
