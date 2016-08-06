var gulp          = require('gulp')
    , coffee      = require('gulp-coffee')
    , stylus      = require('gulp-stylus')
    , imagemin    = require('gulp-imagemin')
    , jade        = require('gulp-jade')
    , prefix      = require('gulp-autoprefixer')
    , concat      = require('gulp-concat')
    , deploy      = require('gulp-gh-pages')
    , order       = require('gulp-order')
    , copy        = require('recursive-copy')
    , dirs        = {
                      'source': {
                          examples:     './developer/examples'
                          , example:     './developer/examples/**'
                          , coffee:     './developer/coffee/**/*.coffee'
                          , js:         './developer/js/**/*.js'
                          , fonts:      './developer/fonts/**'
                          , images:     './developer/images/**'
                          , stylus:     './developer/styl/**/*'
                          , jade:       './developer/*.jade'
                        }
                      , 'build': {
                          examples:   './build/examples'
                          , css:      './build/css/'
                          , images:   './build/images/'
                          , js:       './build/js/'
                          , fonts:    './build/fonts/'
                          , html:     './build/'
                        }
                      };


gulp.task('stylus', function () {
  return gulp.src(dirs.source.stylus)
    .pipe(stylus())
    .pipe(prefix())
    .pipe(order(["reset.css", "fonts.css", "default.css", "slidster.css", "slides.css"]))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(dirs.build.css));
});

gulp.task('jade', function () {
  return gulp.src(dirs.source.jade)
    .pipe(jade())
    .pipe(gulp.dest(dirs.build.html));
});

gulp.task('fonts', function () {
  return gulp.src(dirs.source.fonts)
    .pipe(gulp.dest(dirs.build.fonts));
});


gulp.task('js', function () {
  return gulp.src(dirs.source.js)
    .pipe(gulp.dest(dirs.build.js));
});

gulp.task('coffee', function () {
  return gulp.src(dirs.source.coffee)
    .pipe(coffee())
    .pipe(gulp.dest(dirs.build.js));
});

gulp.task('examples', function () {
  copy(dirs.source.examples, dirs.build.examples);
});

gulp.task('images', function () {
  return gulp.src(dirs.source.images)
    // .pipe(imagemin())
    .pipe(gulp.dest(dirs.build.images));
});

gulp.task('watch', function () {
  gulp.watch(dirs.source.example,    ['examples']);
  gulp.watch(dirs.source.coffee,    ['coffee']);
  gulp.watch(dirs.source.js,        ['js']);
  gulp.watch(dirs.source.images,    ['images']);
  gulp.watch(dirs.source.jade,      ['jade']);
  gulp.watch(dirs.source.stylus,    ['stylus']);
});

gulp.task('deploy', function () {
  console.log('deploying');
  return gulp.src('build/**')
          .pipe(deploy({
            cacheDir:   'gh-cache',
            remoteUrl:  'git@github.com:SilentImp/youDontKnowCSS.git'
          }).on('error', function(){
            console.log('error', arguments);
          }));
});


gulp.task('default', ['stylus','jade', 'js', 'fonts', 'coffee', 'images', 'watch']);
