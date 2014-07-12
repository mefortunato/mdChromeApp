function drawSystem() {

// clear canvas
myContext.clearRect(0,0,myCanvas.width,myCanvas.height);

// set fill style to black 50% opacity
myContext.fillStyle='rgba(0,0,0,0.5)';

// draw all molecules; coordinates are scaled .: scale to dimension/20
for (var i=0;i<x.length;i++) {
  myContext.beginPath();
  myContext.arc(x[i]*dimension/systemSize,y[i]*dimension/systemSize,displayR,0,2*Math.PI);
  myContext.fill();
}

}

