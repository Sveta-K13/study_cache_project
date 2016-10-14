var gulp           = require('gulp');
var babel          = require('gulp-babel');

gulp.task('scripts', () => {
    return gulp.src('src/memory.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('app/'));
});

gulp.task('watch:js',  function () {
    gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('default', ['watch:js']);
