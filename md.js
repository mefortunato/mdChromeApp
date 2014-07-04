var dr,dr2,dx,dx2,dy,dy2,fx,fy,fOverR,attract,repel,rSquaredInv;

function changeT(factor) {
  for (var i=0;i<numMol;i++) {
    vx[i]*=factor;
    vy[i]*=factor;
  }
}

function setForces() {

  for (var i=0;i<numMol;i++) {
    ax[i]=0;
    ay[i]=0;
  }

  for (var i=0;i<numMol;i++) {
    for (var j=i+1;j<numMol;j++) {
      dx=x[i]-x[j];
      dx2=dx*dx;
      dy=y[i]-y[j];
      dy2=dy*dy;
      rSquared = dx2 + dy2;
      if (rSquared<cutoff*cutoff) {
        rSquaredInv = 2.0 / rSquared;
        attract=rSquaredInv*rSquaredInv*rSquaredInv;
        repel=attract*attract;
        fOverR=24.0 * ((2.0 * repel) - attract) * rSquaredInv;
        fx=fOverR*dx;
        fy=fOverR*dy;
        ax[i]+=fx;
        ax[j]-=fx;
        ay[i]+=fy;
        ay[j]-=fy;
      }
    }
  }
}

function doStep() {
  var dt=0.01;
  var halfdt=0.5*dt;
  var halfdt2=halfdt*dt;
  for (var i=0;i<numMol;i++) {
    x[i]+=vx[i]*dt+ax[i]*halfdt2;
    y[i]+=vy[i]*dt+ay[i]*halfdt2;
  }
  setForces();
  for (var i=0;i<numMol;i++) {
    vx[i]+=ax[i]*halfdt;
    vy[i]+=ay[i]*halfdt;
    if (x[i]<=1) {
      vx[i]=vx[i]*-1;
      ax[i]=ax[i]*-1;
      x[i]=1;
    }
    if (x[i]>=19) {
      vx[i]=vx[i]*-1;
      ax[i]=ax[i]*-1;
      x[i]=19;
    }
    if (y[i]<=1) {
      vy[i]=vy[i]*-1;
      ay[i]=ay[i]*-1;
      y[i]=1;
    }
    if (y[i]>=19) {
      vy[i]=vy[i]*-1;
      ay[i]=ay[i]*-1;
      y[i]=19;
    }
  }
}

function simulate() {
  for (var i=0;i<25;i++) {
    doStep();
  }
  paintCanvas();
  if (running) {
    window.setTimeout(simulate,1);
  }
}

function startStop() {
  running = !running;
  if (running) {
    startButton.value='Pause';
    simulate(25);
  }
  else {
    startButton.value='Resume';
  }
}
