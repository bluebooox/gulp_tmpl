var gulp = require("gulp");
var $    = require('gulp-load-plugins')();
var plumber = require('gulp-plumber');
var notifier = require('node-notifier');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade');
var cache = require('gulp-cached');
var browserSync = require('browser-sync');
var htmlv = require( 'gulp-html-validator' );
var notify = require('gulp-notify');

var errorHandler = function(error) {
  var err = error;
  notifier.notify({
    message: err.message,
    title: err.plugin
  }, function() {
    console.log(err.message);
  });
};

gulp.task('sass', function () {
  gulp.src('./sass/*.scss', !'./sass/_modules/*.scss')
    .pipe( $.plumber({
    errorHandler: errorHandler
    }))
    .pipe(cache())
    .pipe(sass())
    .pipe(gulp.dest('./src/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dest'))
    .pipe(browserSync.stream())
    .pipe(notify({
            title: 'Sassをコンパイルしました。',
            message: new Date(),
            sound: 'Glass'
            // icon: 'logo.gif'
     }));

});

gulp.task('jade', function () {
  gulp.src(['./src/jade/*.jade','./src/jade/**/*.jade','!./src/jade/**/_*.jade'])
  .pipe( $.plumber({
  errorHandler: errorHandler
   }))
   .pipe(cache())
   .pipe(jade({
    pretty: true
   }))
    .pipe(gulp.dest('./dest'))
    .pipe(notify({
            title: 'Jadeをコンパイルしました。',
            message: new Date(),
            sound: 'Glass',
            // icon: 'logo.gif'
     }));
});

// html validation
gulp.task( 'valid', function () {
  gulp.src( './dest/**/*.html' )
//  .pipe( htmlv( { format: 'html'} ) )
  .pipe( htmlv() )
  .pipe(browserSync.stream())
  .pipe( gulp.dest( './dest/**/*.html') );
});


gulp.task('compress', function() {
  gulp.src(['./src/js/*.js'])
    .pipe( $.plumber({
    errorHandler: errorHandler
    }))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('./dest/common/js/'));
});


gulp.task('default', ['sass', 'jade', 'compress']);


//watch
gulp.task('watch', function(){
browserSync.init({
   port: 8890,
     server: {
         baseDir: "./dest/"
     }
 });
    var w_sass = gulp.watch('./src/sass/*.scss', ['sass']);
    var w_jade = gulp.watch('./src/jade/**/*.jade', ['jade']);
    var w_uglify = gulp.watch('./src/js/*.js', ['compress']);

    w_sass.on('change', function(event){
        console.log('CSS File ' + event.path + ' was ' + event.type + ', running task sass...');
    });

    w_jade.on('change', function(event){
        console.log('Jade File ' + event.path + ' was ' + event.type + ', running task jade...');
    });

    w_uglify.on('change', function(event){
        console.log('javascript File ' + event.path + ' was ' + event.type + ', running task jsmin...');
    });


});
