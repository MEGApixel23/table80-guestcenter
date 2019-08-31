'use strict'
var gulp = require('gulp');
const del = require('del');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var terser = require('gulp-terser');
var replace = require('gulp-replace');
var htmlreplace = require('gulp-html-replace');
const imagemin = require('gulp-imagemin');

var paths = {
    src: 'src/**/*',
    srcHTML: ['src/**/*.html', '!src/vendors/**/*.html', '!src/partials/*.html'],
    srcCSS: 'src/assets/css/**/*.css',
    srcJS: ['src/assets/js/**/*.js'],
    srcJson: ['src/assets/js/**/*.json'],
    srcImages: [
        'src/assets/images/**/*.png',
        'src/assets/images/**/*.jpg',
        'src/assets/images/**/*.jpeg',
        'src/assets/images/**/*.svg',
        'src/assets/images/**/*.ico'
    ],
    srcFonts: [
        'src/assets/fonts/**/*.eot',
        'src/assets/fonts/**/*.svg',
        'src/assets/fonts/**/*.ttf',
        'src/assets/fonts/**/*.woff',
        'src/assets/fonts/**/*.woff2'
    ],
    srcVendorFiles: [
        'src/assets/vendors/**/*.eot',
        'src/assets/vendors/**/*.svg',
        'src/assets/vendors/**/*.ttf',
        'src/assets/vendors/**/*.woff',
        'src/assets/vendors/**/*.woff2',
        'src/assets/vendors/**/*.png',
        'src/assets/vendors/**/*.jpg',
        'src/assets/vendors/**/*.jpeg',
        'src/assets/vendors/**/*.svg',
        'src/assets/vendors/**/*.json'
    ],
    srcVendorjs: 'src/assets/vendors/**/*.js',
    srcVendorsCSS: 'src/assets/vendors/**/*.css',


    dist: '../guestcenter/',
    distHTML: '../guestcenter/assets/',
    distCSS: '../guestcenter/assets/css/',
    distJS: '../guestcenter/assets/js/',
    distImages: '../guestcenter/assets/images/',
    distFonts: '../guestcenter/assets/fonts/',
    distVendors: '../guestcenter/assets/vendors/',
};


gulp.task('build', function () {
    del.sync([paths.dist + '**'], { force: true });
    runSequence('minifyHTML', 'minifyCSS', 'minifyJS', 'copyJsonFiles', 'copyImageFiles', 'copyFontsFiles', 'copyVendorFiles', 'copyVendorCSS', 'copyVendorJS', 'replaceScriptPath');
});



gulp.task('minifyHTML', function () {
    return gulp.src(paths.srcHTML)
        .pipe(htmlreplace({
            js: '../assets/js/script.js'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('replaceScriptPath', function () {
    gulp.src(paths.dist + '*/pages/*/*.html', {
            base: "./"
        })
        .pipe(replace('src="../assets/js/', 'src="../../../assets/js/'))
        .pipe(gulp.dest('.'));
});

gulp.task('minifyCSS', () => {
    return gulp.src(paths.srcCSS)
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(paths.distCSS));
});

gulp.task('minifyJS', function (cb) {
    return gulp.src(paths.srcJS)
        .pipe(concat('script.js'))
        .pipe(terser())
        .pipe(gulp.dest(paths.distJS));
});

gulp.task('copyJsonFiles', function (cb) {
    return gulp.src(paths.srcJson)
        .pipe(gulp.dest(paths.distJS));
});

gulp.task('copyImageFiles', function () {
    return gulp.src(paths.srcImages)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.distImages));
});

gulp.task('copyFontsFiles', function () {
    return gulp.src(paths.srcFonts)
        .pipe(gulp.dest(paths.distFonts));
});

gulp.task('copyVendorFiles', function () {
    return gulp.src(paths.srcVendorFiles)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.distVendors));
});

gulp.task('copyVendorCSS', function () {
    return gulp.src(paths.srcVendorsCSS)
        // .pipe(cleanCSS({
        //     compatibility: 'ie8'
        // }))
        .pipe(gulp.dest(paths.distVendors));
});

gulp.task('copyVendorJS', function () {
    return gulp.src(paths.srcVendorjs)
        .pipe(terser())
        .pipe(gulp.dest(paths.distVendors));
});