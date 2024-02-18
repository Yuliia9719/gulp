const { src, dest, task, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const cssnano = require("cssnano");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const csscomb = require("gulp-csscomb");
const autoprefixer = require("autoprefixer");
const mqpacker = require("css-mqpacker");
const sortCSSmq = require("sort-css-media-queries");

const PATH = {
  scssRootFile: "./assets/scss/style.scss",
  scssAllFiles: "./assets/scss/**/*.scss",
  scssFolder: "./assets/scss/",
  cssFolder: "./assets/css",
  htmlForder: "./",
  htmlAllFiles: "./**/*.html",
  jsFolder: "./assets/js",
  jsAllFiles: "./assets/js/**/*.js"
};

const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ["last 5 versions", "> 1%"],
    cascade: true
  }),
  mqpacker({ sort: sortCSSmq })
];

function scss() {
  return src(PATH.scssRootFile)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(PLUGINS))

    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream());
}

function scssDev() {
  return (
    src(PATH.scssRootFile, { sourcemaps: true })
      .pipe(sass().on("error", sass.logError))
      // .pipe(postcss(PLUGINS))
      .pipe(dest(PATH.cssFolder, { sourcemaps: true }))
      .pipe(browserSync.stream())
  );
}

function scssMin() {
  const pluginForMify = [...PLUGINS, cssnano({ preset: "default" })];
  return src(PATH.scssRootFile)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(pluginForMify))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(PATH.cssFolder));
}

async function comb() {
  src(PATH.scssAllFiles).pipe(csscomb()).pipe(dest(PATH.scssFolder));
}

async function syncBrowser() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
}

async function sync() {
  browserSync.reload();
}
function watchFiles() {
  syncBrowser();
  watch(PATH.scssAllFiles, scss);
  watch(PATH.htmlAllFiles, sync);
  watch(PATH.jsAllFiles, sync);
}

task("dev", scssDev);
task("min", scssMin);
task("scss", scss);
task("comb", comb);
task("watch", watchFiles);
