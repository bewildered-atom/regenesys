const { src, dest, watch, series } = require('gulp');
let ts = require('gulp-typescript');
let tsProject = ts.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var merge = require('merge-stream');

let compile = ['!**/*.d.ts', './src/**/*.ts', './config/**/*.ts', './test/**/*.ts'];

function clean() {
    return del([
        'src/**/*.d.ts',
        'dist/',
        'src/**/*.js',
        'src/**/*.js.map',
        'config/**/*.d.ts',
        'config/**/*.js',
        'config/**/*.js.map',
        'test/**/*.d.ts',
    ]);
}

function tsc() {
    let tsResult = src(compile, { base: '.' })
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .once('error', function () {
            this.once('finish', function () {
                process.exit(1);
            });
        });
    src(['./config/*', './*.js', './*.json', 'src/**/**/**/*.json', 'src/**/**/**/*.key', 'src/**/**/**/**/*.cer'], {
        base: '.'
    }).pipe(dest('./dist'));
    return merge([
        tsResult.dts.pipe(dest('dist')),
        tsResult.js.pipe(sourcemaps.write('.')).pipe(dest('dist')),
        tsResult.pipe(sourcemaps.write('dist'))
    ]);
}

exports.watch = () => {
    // Or a composed task
    watch([...compile, 'app.js'], series(tsc));
};

exports.tsc = tsc;
exports.clean = clean;
