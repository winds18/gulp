var gulp = require('gulp'),  
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create();;

gulp.task('browser-sync',function(){
    var files = ['./*.html','pub/**/*'];
    browserSync.init(files,{
        server:{
            baseDir:"./",
        }
    });
});

gulp.task('style',function(){
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass({style:'expanded'}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('pub/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('pub/css'));
        //.pipe(notify({message:'Styles task complete'}));
});

gulp.task('script',function(){
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('pub/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('pub/js'));
        //.pipe(notify({message:'Scripts task complete'}));
});

gulp.task('image',function(){
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({optimizationLevel:3,progressive:true,interlaced:true})))
        .pipe(gulp.dest('pub/images'));
        //.pipe(notify({message:'Images task complete'}));
});

gulp.task('clean',function(){
    return gulp.src(['pub/js','pub/css','pub/images'],{read:false})
        .pipe(clean());
        //.pipe(notify({message:'Clean task complete'}));
});

gulp.task('default',['clean'],function(){
    gulp.start('style','script','image','watch','browser-sync');
});

gulp.task('watch',function(){
    gulp.watch('src/styles/**/*.scss',['style']);
    gulp.watch('src/scripts/**/*.js',['script']);
    gulp.watch('src/images/**/*',['image']);
});
