var gulp = require('gulp');

gulp.task('scripts', function() {
  var uglify = require('gulp-uglify');
  var rename = require('gulp-rename');
  return gulp
    .src('src/**/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += "-min";
    }))
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('demo', function() {
  return gulp
    .src('src/**/*.{html,css}')
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('clean', function() {
  var clean = require('gulp-clean');
  return gulp
    .src(['dist'], { read: false })
    .pipe(clean());
});

gulp.task('default', function(callback) {
  var runSequence = require('run-sequence');
  runSequence('clean', ['scripts', 'demo'], callback);
});

gulp.task('watch', ['default'], function() {
  gulp.watch(['src/**/*.js'], ['scripts']);
  gulp.watch(['src/**/*.{html,css}'], ['demo']);
});

gulp.task('publish', ['default'], function () {
  var ghPages = require('gulp-gh-pages');
  return gulp
    .src('dist/**/*')
    .pipe(ghPages());
});
