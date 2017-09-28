var gulp = require('gulp');
var jqConfig = require("jQuery");
var bsConfig = require("bootstrap");

gulp.task('gulp-bootstrap', function(){
	console.log('test');
	/*
  return gulp.src("./config.json")
    .pipe(bsConfig.js({
    	compress: true,
        name: 'bootstrapGulp.js'
    }))
    .pipe(gulp.dest("./assets"));
    // It will create `bootstrap.js` in directory `assets`. 
    */
});
/*
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
});
*/