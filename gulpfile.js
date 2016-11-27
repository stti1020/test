/// <binding BeforeBuild='min' Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    compass = require("gulp-compass"),
    minifyCSS = require('gulp-minify-css'),

    //Error auf der Console ausgeben und beenden
    gulputil = require('gulp-util');

var paths = {
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "app/**/*.js";
paths.minJs = paths.webroot + "app/**/*.min.js";
paths.scss = paths.webroot + "styles/scss/style.scss";
paths.concatJsDest = paths.webroot + "js/scripts.min.js";
paths.cleanScripts = paths.webroot + "js/scripts.min.js";
paths.cleanStyles = paths.webroot + "styles/css/style.css";

//Löscht das zusammengefügte JavaScript File
gulp.task("clean:js", function (cb) {
    rimraf(paths.cleanScripts, cb);
});

//Löscht die Style.css 
gulp.task("clean:css", function (cb) {
    rimraf(paths.cleanStyles, cb);
});

//Fügt alle Controller, Services und Directive zu einem File zusammen und minifiziert anschließend das File
gulp.task("min:js", function () {
    return gulp.src([paths.js], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify().on('error', gulputil.log))
        .pipe(gulp.dest(".").on('error', gulputil.log));
});

//Minifiziert die inspiniaDirectives
gulp.task("min:inspiniaDirectives", function () {
    return gulp.src("./wwwroot/lib/lib_inspinia/inspinia-directives.js", { base: "." })
        .pipe(concat("./wwwroot/lib/lib_inspinia/inspinia-directives.min.js"))
        .pipe(uglify().on('error', gulputil.log))
        .pipe(gulp.dest(".").on('error', gulputil.log))
});

//Wandelt die Style.scss in Style.css um. 
//Style.css Datei wird hier nicht minifiziert. 
gulp.task('compass:dev', function () {
    gulp.src('wwwroot/styles/scss/**/*.scss')
      .pipe(compass({
          config_file: './config.rb',
          css: 'wwwroot/styles/css',
          sass: 'wwwroot/styles/scss'
      }).on('error', gulputil.log))
      .pipe(gulp.dest('wwwroot/styles/css').on('error', gulputil.log));
});

//Wandelt die Style.scss in Style.css um. 
//Style.css Datei wird mit pipe(minifyCSS()) minifiziert. 
gulp.task('compass:deploy', function () {
    gulp.src('wwwroot/styles/scss/**/*.scss')
      .pipe(compass({
          config_file: './config.rb',
          css: 'wwwroot/styles/css',
          sass: 'wwwroot/styles/scss'
      }).on('error', gulputil.log))
      .pipe(minifyCSS().on('error', gulputil.log))
      .pipe(gulp.dest('wwwroot/styles/css').on('error', gulputil.log));
});

//Beobachtet ob sich eine *.scss verändert und ruft bei Veränderung den Task compass:dev auf.
gulp.task('sass:watch', function () {
    gulp.watch('wwwroot/styles/scss/**/*.scss', ['clean:css', 'compass:dev']);
});

//Der selbst definierte Task min ruft den Task min:js und compass auf. 
gulp.task("min", ["min:js", "compass:deploy"]);

//Der selbst definierte Task clean ruft den Task clean:js und clean:css auf. 
gulp.task("clean", ["clean:js", "clean:css"]);


