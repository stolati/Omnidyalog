var gulp = require('gulp');
var typescript = require('typescript');
var ts = require('gulp-typescript');

var paths = {
    //'ts': 'app/assets/typescripts/**/*.ts',
    //'js_dest': 'app/assets/javascripts'

    'tp': 'app/**/*.html',
    'ts': 'app/**/*.ts',
    'ts_standalone': 'standalone/**/*.ts',
    'js_dest': '../public/javascripts',
    'tp_dest': '../public/javascripts'
};

gulp.task('ts_standalone', function(){
    var tsResult = gulp.src(paths.ts_standalone)
        .pipe(ts({
            noImplicitAny: true,
            typescript: typescript,
            removeComments: true,
            sortOutput: true,
            target: 'ES5'

        }));
    return tsResult.js.pipe(gulp.dest(paths.js_dest));
});


gulp.task('ts', function () {
    var tsResult = gulp.src(paths.ts)
        .pipe(ts({
            noImplicitAny: true,
            typescript: typescript,
            removeComments: true,
            sortOutput: true,
            target: 'ES5'

        }));
    return tsResult.js.pipe(gulp.dest(paths.js_dest));
});

gulp.task('tp', function(){
    var tpResult = gulp.src(paths.tp);
    return tpResult.pipe(gulp.dest(paths.tp_dest));
});

gulp.task('watch', function() {
    gulp.watch(paths.ts, ['ts']);
    gulp.watch(paths.tp, ['tp']);
    gulp.watch(paths.ts_standalone, ['ts_standalone']);
});

gulp.task('default', ['watch', 'ts', 'tp']);
