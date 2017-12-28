var path = require('path');
var gulp = require('gulp');
var Launcher = require('webdriverio').Launcher;
var conf = require('./wdio.conf');

gulp.task('default', function(done) {
	var wdio = new Launcher(path.join(__dirname, 'wdio.conf.js'), conf.config);
	return wdio.run().then(function(code) {
		console.log(code);
	}, function(error) {
		console.error('Launcher failed to start the test', error.stacktrace);
		selenium.child.kill();
		process.exit(1);
	});
});