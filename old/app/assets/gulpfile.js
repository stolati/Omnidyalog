var gulp = require('gulp');
var shell = require('gulp-shell');
var del = require('del');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var typescript = require('typescript');
var ts = require('gulp-typescript');


var paths = {
    ts_files:'ng2/**/*.ts',
    ts_out:'ng2-js',
    js_out:'ng2/**/*.js'
};


gulp.task('clean', function(cb){
    del([ paths.js_out ], cb);
});

gulp.task('compile', function(){
    var tsResult = gulp.src(paths.ts_files)
        .pipe(ts({
            noImplicitAny: true,
            typescript: typescript,
            removeComments: true,
            sortOutput: true,
            module: 'amd',
            target: 'ES5',
            experimentalDecorators: true,
            sourceMap: true
        }));
    return tsResult.js.pipe(gulp.dest(paths.ts_out));
});


gulp.task('watch', function(cb){
    gulp.watch(paths.ts_files, ['compile']);
});



gulp.task('update', shell.task([
    'npm update',
    //'bower install',
    //'bower update',
    'tsd install', //It won't create the file otherwise
    'tsd update'
]));


gulp.task('default', function(cb) {
    runSequence(
        'update',
        'clean',
        'compile',
        'watch',
        cb);
});
