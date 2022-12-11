const gulp = require('gulp');//gulp本体

//scss
const sass = require('gulp-dart-sass');//Dart Sass はSass公式が推奨 @use構文などが使える
const plumber = require("gulp-plumber"); // エラーが発生しても強制終了させない
const notify = require("gulp-notify"); // エラー発生時のアラート出力
const browserSync = require("browser-sync"); //ブラウザリロード


// 入出力するフォルダを指定
const srcBase = '../htdocs/dist';
const assetsBase = '../htdocs';
const distBase = '../htdocs/dist';


const srcPath = {
  'scss': assetsBase + '/src/scss/**/*.scss',
  'html': srcBase + '/**/*.html'
};

const distPath = {
  'css': distBase + '/common/css/',
  'html': distBase + '/'
};

/**
 * sass
 *
 */
const cssSass = () => {
  return gulp.src(srcPath.scss, {
    sourcemaps: true
  })
    .pipe(
      //エラーが出ても処理を止めない
      plumber({
        errorHandler: notify.onError('Error:<%= error.message %>')
      }))
    .pipe(sass({ outputStyle: 'expanded' })) //指定できるキー expanded compressed
    .pipe(gulp.dest(distPath.css, { sourcemaps: './' })) //コンパイル先
    .pipe(browserSync.stream())
    .pipe(notify({
      message: 'Sassをコンパイルしました！',
      onLast: true
    }))
}


/**
 * html
 */
const html = () => {
  return gulp.src(srcPath.html)
    .pipe(gulp.dest(distPath.html))
}

/**
 * ローカルサーバー立ち上げ
 */
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
}

const browserSyncOption = {
  server: distBase
}

/**
 * リロード
 */
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
}

/**
 *
 * ファイル監視 ファイルの変更を検知したら、browserSyncReloadでreloadメソッドを呼び出す
 * series 順番に実行
 * watch('監視するファイル',処理)
 */
const watchFiles = () => {
  gulp.watch(srcPath.scss, gulp.series(cssSass))
  gulp.watch(srcPath.html, gulp.series(html, browserSyncReload))
}

/**
 * seriesは「順番」に実行
 * parallelは並列で実行
 */
exports.default = gulp.series(
  gulp.parallel(html, cssSass),
  gulp.parallel(watchFiles, browserSyncFunc)
);

// 画像を自動圧縮 //

"use strict";

//----------------------------------------------------------------------
//  モジュール読み込み
//----------------------------------------------------------------------
const { src, dest, series, parallel, watch } = require("gulp");

const imageMin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const changed = require("gulp-changed"); 
//----------------------------------------------------------------------
//  関数定義
//----------------------------------------------------------------------
function imagemin(done) {
  src("../htdocs/src/images/**")
    .pipe(changed("../htdocs/dist/images/"))
    .pipe(
      imageMin([
        pngquant({
          quality: [0.6, 0.7],
          speed: 1,
        }),
        mozjpeg({ quality: 65 }),
        imageMin.svgo(),
        imageMin.optipng(),
        imageMin.gifsicle({ optimizationLevel: 3 }),
      ])
    )
    .pipe(dest("../htdocs/dist/images/"));

  done();
}

//----------------------------------------------------------------------
//  タスク定義
//----------------------------------------------------------------------
exports.imagemin = imagemin;

/************************************************************************/
/*  END OF FILE                                                         */
/************************************************************************/