// md stuff
var numMol=25;
var x,y;
var running;

// gOfR stuff
var gOfR;

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    id: 'main_window',
    bounds: {
      width: parseInt(window.screen.availWidth/2),
      height: parseInt(window.screen.availHeight*.8)
    }
  },
  function(mainWin) {
    mainWin.setBounds({
      top: 100,
      left: 100
    });
  });
  chrome.app.window.create('window_rdf.html', {
    id: 'rdf_window',
    bounds: {
      width: 500,
      height: 500
    }
  },
  function(rdfWin) {
    rdfWin.setBounds({
      top: 100,
      left: 110+parseInt(window.screen.availWidth/2)
    });
  });
});
