import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
const $ = gulpLoadPlugins({
  debug:false,
  pattern:['gulp-*','gulp.*','browser-*'],
  rename:{
    'browser-sync':'browserSync',
    'gulp-minify-css':'minifycss',
    'gulp-minify-html':'minifyhtml'
  }
});

gulp.task('browser-sync',() => {
  var files = ['pub/*.html','pub/**/*'];
  $.browserSync.create().init(files,{
    server:{
      baseDir:"pub",
    }
  });
});

gulp.task('style',() => {
  return gulp.src('src/styles/**/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({style:'expanded'}))
    .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('pub/css'))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.minifycss())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('pub/css'));
});

gulp.task('script',() => {
  return gulp.src('src/scripts/**/*.js')
    .pipe($.order([
      'src/scripts/lib/*.js',
      'src/scripts/*.js'
    ]))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'))
    .pipe($.concat('main.js'))
    .pipe(gulp.dest('pub/js'))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.uglify())
    //.pipe($.obfuscate())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('pub/js'));
});

gulp.task('image',() => {
  return gulp.src('src/images/**/*')
    .pipe($.cache($.imagemin({optimizationLevel:3,progressive:true,interlaced:true})))
    .pipe(gulp.dest('pub/images'));
});

gulp.task('html',() => {
  return gulp.src('src/*.html')
    .pipe($.minifyhtml())
    .pipe(gulp.dest('pub'));
});

gulp.task('clean',() => {
  return gulp.src(['pub/js','pub/css','pub/images'],{read:false}).pipe($.clean());
});

gulp.task('default',['clean'],() => {
  gulp.start('html','style','script','image','watch','browser-sync');
});

gulp.task('watch',() => {
  gulp.watch('src/styles/**/*.scss',['style']);
  gulp.watch('src/scripts/**/*.js',['script']);
  gulp.watch('src/images/**/*',['image']);
  gulp.watch('src/*.html',['html']);
});
