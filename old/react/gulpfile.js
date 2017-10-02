var path = require('path');

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var express = require("express");

function build_task(main_source_path, output_path){
    var dest_file_name = path.basename(output_path);
    var dest_file_path = path.dirname(output_path);

    return browserify({entries: main_source_path, extensions: ['.jsx', '.js'], debug: true})
        .transform(babelify.configure({stage: 0}))
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source(dest_file_name))
        .pipe(gulp.dest(dest_file_path));
}


gulp.task('build', function () {
    return build_task('./modules/App.jsx', './app-bundle.js');
});


gulp.task('dist', function () {
    return build_task('./modules/App.jsx', '../public/app-bundle.js');
});

gulp.task('server', function(){
    var host = "127.0.0.1";
    var port = 1337;

    var app = express();
    app.use('/', express.static('.', {maxAge: 1}));
    app.listen(port, host);
});


gulp.task('watch', ['build'], function () {
    gulp.watch('modules/**', ['build']);
});

gulp.task('default', ['watch']);
gulp.task('dev', ['server', 'watch']);
