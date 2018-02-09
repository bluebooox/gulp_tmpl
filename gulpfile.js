var gulp = require("gulp");
var $    = require('gulp-load-plugins')();
var plumber = require('gulp-plumber');
var notifier = require('node-notifier');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pug = require('gulp-pug');
var cache = require('gulp-cached');
var browserSync = require('browser-sync');
var htmlv = require( 'gulp-html-validator' );
var notify = require('gulp-notify');
var autoprefixer = require("gulp-autoprefixer");
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var csso = require('gulp-csso');
var pug = require('gulp-pug');

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
  gulp.src('./src/sass/*.scss', !'./src/sass/_modules/*.scss')
    .pipe( $.plumber({
    errorHandler: errorHandler
    }))
    .pipe(cache())
    .pipe( sourcemaps.write('.'))
    .pipe(sass())
    .pipe(autoprefixer({
            browsers: ["last 2 versions", "ie >= 9", "Android >= 4","ios_saf >= 8"],
            cascade: false
    }))
    .pipe(gulp.dest('./src/css/'))
    .pipe(csso())
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

gulp.task('pug', function () {
  gulp.src(['./src/pug/*.pug','./src/pug/**/*.pug','!./src/pug/**/_*.pug'])
  .pipe( $.plumber({
  errorHandler: errorHandler
   }))
   .pipe(cache())
   .pipe(pug({
    pretty: true
   }))
    .pipe(gulp.dest('./dest'))
    .pipe(notify({
            title: 'pugをコンパイルしました。',
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

gulp.task('imagemin', function(){
    gulp.src('./dest/**/*.+(jpg|jpeg|png|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('./dest/'));
});



gulp.task('default', ['sass', 'pug', 'compress', 'imagemin']);


//watch
gulp.task('watch', function(){
browserSync.init({
   port: 8890,
     server: {
         baseDir: "./dest/"
     }
 });
    var w_sass = gulp.watch('./src/sass/*.scss', ['sass']);
    var w_pug = gulp.watch('./src/pug/**/*.pug', ['pug']);
    var w_uglify = gulp.watch('./src/js/*.js', ['compress']);
    var w_image = gulp.watch('./dest/**/*.+(jpg|jpeg|png|gif|svg)', ['imagemin']);

    w_sass.on('change', function(event){
        console.log('CSS File ' + event.path + ' was ' + event.type + ', running task sass...');
    });

    w_pug.on('change', function(event){
        console.log('pug File ' + event.path + ' was ' + event.type + ', running task pug...');
    });

    w_uglify.on('change', function(event){
        console.log('javascript File ' + event.path + ' was ' + event.type + ', running task jsmin...');
    });


});
