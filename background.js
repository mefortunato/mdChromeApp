var x = window.screen.availWidth
var y = window.screen.availHeight

chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('window.html', {
		'bounds': {
			'width': parseInt(x/2),
			'height': parseInt(y*.8)
		}
	});
});
