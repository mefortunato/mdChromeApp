function paintCanvas() {

myContext.clearRect(0,0,myCanvas.width,myCanvas.height);

myContext.fillStyle='rgba(0,0,0,0.5)';

for (var i=0;i<numMol;i++) {
  myContext.beginPath();
  myContext.arc(x[i]*dimension/20,y[i]*dimension/20,molR,0,2*Math.PI);
  myContext.fill();
}

}

