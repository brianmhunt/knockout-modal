//
// Knockout-Modal
// MIT Licensed
//
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = {
  css: {
    src: 'styles/knockout-modal.less',
    dst: 'dist/',
    less_opts: {},
  },
  connect: {
    port: 4040,
    livereload: {
      port: 4041
    },
    root: [
      'spec/',
      'dist/',
      '.',
      'bower_components/',
    ]
  },
  watch: {
    js: ['index.js', 'spec/test.js'],
    html: 'spec/*.html',
    less: 'styles/*'
  }
};

gulp.task('less', function () {
  return gulp.src(config.css.src)
     .pipe(plugins.less(config.css.less_opts).on('error', console.log))
     .pipe(plugins.autoprefixer())
     .pipe(gulp.dest(config.css.dst));
})

gulp.task('connect', function () {
  plugins.connect.server(config.connect);
})

gulp.task('html', function () {
  gulp.src(config.watch.html)
    .pipe(plugins.connect.reload());
});

gulp.task('js', function () {
  gulp.src(config.watch.js)
    .pipe(plugins.connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(config.watch.css, ['less'])
  gulp.watch(config.watch.html, ['html'])
  gulp.watch(config.watch.js, ['js'])
})

gulp.task('live', ['watch', 'connect'])
gulp.task('default', ['live'])
