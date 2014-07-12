function addMol(xT,yT) {
  if (xT==0) {
    x.push(Math.random()*(systemSize-sigma)+sigma/2);
  }
  else {
    x.push(xT);
  }
  if (yT==0) {
    y.push(Math.random()*(systemSize-sigma)+sigma/2);
  }
  else {
    y.push(yT);
  }
  vx.push(Math.random()-0.5);
  vy.push(Math.random()-0.5);
  ax.push(0);
  ay.push(0);
  numMol++;
  setForces();
  drawSystem();
}

function remMol() {
  x.pop();
  y.pop();
  vx.pop();
  vy.pop();
  ax.pop();
  ay.pop();
  numMol--;
  setForces();
  drawSystem();
}

function mcStep() {
  var tempX;
  var tempY;
  var tempE;
  for (var i=0;i<numMol;i++) {
    tempE=u_lj_sys();
    tempX=x[i];
    tempY=y[i];
    x[i]=Math.random()*(systemSize-sigma)+sigma/2;
    y[i]=Math.random()*(systemSize-sigma)+sigma/2;
    dE=u_lj_sys()-tempE;
    if (dE>0 && Math.exp(-dE/epsilon)<Math.random()) {
      x[i]=tempX;
      y[i]=tempY;
    }
  }
}

function mcSteps(numSteps) {
  for (var i=0;i<numSteps;i++) {
    mcStep();
  }
  drawSystem();
}
