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
    less: ['styles/*', 'spec/test.css']
  }
};

// from https://github.com/ikari-pl/gulp-tag-version
function inc(importance) {
  console.log(" ----  >>>  Don't forget: $ git push --tag");
  return gulp.src(['./package.json', './bower.json'])
    .pipe(plugins.bump({type: importance}))
    .pipe(gulp.dest('./'))
    .pipe(plugins.git.commit('bumps package version'))
    .pipe(plugins.filter('bower.json'))
    .pipe(plugins.tagVersion())
}

gulp.task('patch', function() { return inc('patch'); })
gulp.task('feature', function() { return inc('minor'); })
gulp.task('release', function() { return inc('major'); })


gulp.task('less', function () {
  return gulp.src(config.css.src)
     .pipe(plugins.less(config.css.less_opts).on('error', console.log))
     .pipe(plugins.autoprefixer())
     .pipe(gulp.dest(config.css.dst))
     .pipe(plugins.connect.reload());
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

gulp.task('watch', ['less', 'html', 'js'], function () {
  gulp.watch(config.watch.less, ['less'])
  gulp.watch(config.watch.html, ['html'])
  gulp.watch(config.watch.js, ['js'])
})

gulp.task('live', ['watch', 'connect'])
gulp.task('default', ['live'])
