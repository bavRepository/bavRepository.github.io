const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "src"
        }
    });
    gulp.watch("src/*.html").on("change", browserSync.reload);
    gulp.watch("src/js/*.js").on("change", browserSync.reload);
});

gulp.task('styles', function () {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("src/style"))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer())
        .pipe(gulp.dest("src/style"))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(browserSync.stream());
});

// watch for html changes
gulp.task('watch', function () {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel("styles"));
    // gulp.watch("src/*.html").on("change", gulp.parallel('html'));
    // gulp.watch("src/js/*.js").on("change", gulp.parallel('scripts'));
});

// gulp.task('html', function () {
//     gulp.src("src/*.html")
//         .pipe(htmlmin({ collapseWhitespace: true }))
//         .pipe(gulp.dest('dist/'));
// });

// gulp.task('scripts', function () {
//     gulp.src("src/js/**/*")
//         .pipe(gulp.dest('dist/js'));
// });


// gulp.task('fonts', function () {
//     gulp.src("src/fonts/**/*")
//         .pipe(gulp.dest('dist/fonts'));
// });

// gulp.task('icons', function () {
//     gulp.src("src/assets/icons/**/*")
//         .pipe(gulp.dest('dist/assets/icons'));
// });

// gulp.task('images', function () {
//     gulp.src("src/assets/img/**/*")
//         .pipe(imagemin())
//         .pipe(gulp.dest('dist/assets/img'));
// });

gulp.task('default', gulp.parallel('watch', 'server', 'styles'));
//, 'html', 'scripts', 'fonts', 'icons', 'images'


