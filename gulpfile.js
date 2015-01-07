var gulp = require('gulp');

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('scripts', function() {
  var uglify = require('gulp-uglify');
  gulp
    .src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('clean', function() {
  var clean = require('gulp-clean');
  return gulp
    .src(['dist'], { read: false })
    .pipe(clean());
});

gulp.task('default', ['clean'], function() {
  gulp.start('scripts');

});

gulp.task('watch', ['default'], function() {
  gulp.watch(['src/**/*.js'], ['scripts']);
});
