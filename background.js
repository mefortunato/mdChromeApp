var screenx = window.screen.availWidth
var screeny = window.screen.availHeight

chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('window.html', {
		'bounds': {
			'width': parseInt(screenx/2),
			'height': parseInt(screeny*.8)
		}
	});
});
