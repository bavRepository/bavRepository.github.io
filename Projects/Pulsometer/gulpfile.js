const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "src"
        }
    });
    gulp.watch("src/*.html").on("change", browserSync.reload);
    gulp.watch("src/js/script.js").on("change", browserSync.reload);
});
gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("src/style"))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
		.pipe(autoprefixer())
        .pipe(gulp.dest("src/style"))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(browserSync.stream());
});

// watch for html changes
gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel("styles"));
});

// run all tasks 
gulp.task('default', gulp.parallel('watch','server', 'styles'));

