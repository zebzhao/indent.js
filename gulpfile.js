var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var umd = require('gulp-umd');

gulp.task('build', ['build-minify', 'build-debug', 'build-docs']);

gulp.task('build-minify', function (cb) {
    return gulp.src(['src/**/*.js'])
        .pipe(concat('indent.min.js'))
        .pipe(umd({
            exports: function(file) {
                return 'indent';
            },
            namespace: function(file) {
                return 'indent';
            }
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./lib'))
});

gulp.task('build-docs', function (cb) {
  return gulp.src(['src/**/*.js'])
    .pipe(gulp.dest('./docs/js'))
});

gulp.task('build-debug', function (cb) {
    return gulp.src(['src/**/*.js'])
        .pipe(concat('indent.js'))
        .pipe(umd({
            exports: function(file) {
                return 'indent';
            },
            namespace: function(file) {
                return 'indent';
            }
        }))
        .pipe(gulp.dest('./lib'));
});