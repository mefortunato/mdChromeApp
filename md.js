// vars for md calculations
var dr,dr2,dx,dx2,dy,dy2,fx,fy,fOverR,attract,repel,rSquaredInv;

// function to find separation distance given coords
function sepDist(x1,y1,x2,y2) {
  return Math.pow(Math.pow(x1-x2,2)+Math.pow(y1-y2,2),0.5);
}

// function to scale velocities (aka temp) by factor
function changeT(factor) {
  for (var i=0;i<numMol;i++) {
    vx[i]*=factor;
    vy[i]*=factor;
  }
}

function u_lj_pair(mol1,mol2) {
  dr=sepDist(x[mol1],y[mol1],x[mol2],y[mol2]);
  if (dr<cutoff) {
    rSquared=dr*dr;
    rSquaredInv = sigma*sigma / rSquared;
    attract=rSquaredInv*rSquaredInv*rSquaredInv;
    repel=attract*attract;
    return 4*epsilon*(repel-attract);
  }
  else {
    return 0;
  }
}

function u_lj_sys() {
  var energy=0;
  for (var i=0;i<numMol;i++) {
    for (var j=i+1;j<numMol;j++) {
      energy+=u_lj_pair(i,j);
    }
  }
  return energy;
}

// function to calculate and set forces assuming mass=1
function setForces() {

  // forces are calculated new each time function is called
  for (var i=0;i<numMol;i++) {
    ax[i]=0;
    ay[i]=0;
  }

  // for all pairs of molecules
  for (var i=0;i<numMol;i++) {
    for (var j=i+1;j<numMol;j++) {
      // get separation distances of importance
      dx=x[i]-x[j];
      dx2=dx*dx;
      dy=y[i]-y[j];
      dy2=dy*dy;
      rSquared = dx2 + dy2;
      
      // if pairs of molecules are within cutoff find forces
      if (sepDist(x[i],y[i],x[j],y[j])<cutoff) {
        // store all ugly inverse values
        rSquaredInv = sigma*sigma / rSquared;
        attract=rSquaredInv*rSquaredInv*rSquaredInv;
        repel=attract*attract;

        // store force/dist to multiply by dx or dy to get force components
        fOverR=epsilon*24.0 * ((2.0 * repel) - attract) * rSquaredInv;
        fx=fOverR*dx;
        fy=fOverR*dy;

        // b/c mass=1 accelerations are forces; force on i is calculated, force on j is negative force on i
        ax[i]+=fx/mass;
        ax[j]-=fx/mass;
        ay[i]+=fy/mass;
        ay[j]-=fy/mass;
      }
    }
  }
}

// function to run one md step
function doStep() {

  // calculate new forces
  setForces();

  // store helpful variations of dt
  var halfdt=0.5*dt;
  var halfdt2=halfdt*dt;

  // verlet algorithm get new positions
  for (var i=0;i<numMol;i++) {
    x[i]+=vx[i]*dt+ax[i]*halfdt2;
    y[i]+=vy[i]*dt+ay[i]*halfdt2;
  }

  // verlet agorithm get new velocities
  // if a particle is outside system move it back to boundary and invert veloctieis and accelerations
  // inherhit assumption particle doesn't leave by much
  // could fix by displacing back into system proportional to exit displacement
  for (var i=0;i<numMol;i++) {
    vx[i]+=ax[i]*halfdt;
    vy[i]+=ay[i]*halfdt;
    if (x[i]<=sigma/2) {
      vx[i]=vx[i]*-1;
      ax[i]=ax[i]*-1;
      x[i]=sigma/2;
    }
    if (x[i]>=systemSize-sigma/2) {
      vx[i]=vx[i]*-1;
      ax[i]=ax[i]*-1;
      x[i]=systemSize-sigma/2;
    }
    if (y[i]<=sigma/2) {
      vy[i]=vy[i]*-1;
      ay[i]=ay[i]*-1;
      y[i]=sigma/2;
    }
    if (y[i]>=systemSize-sigma/2) {
      vy[i]=vy[i]*-1;
      ay[i]=ay[i]*-1;
      y[i]=systemSize-sigma/2;
    }
  }
}

// function to repeatedly do a couple steps
function simulate() {

  // do 25 steps then redraw system
  for (var i=0;i<25;i++) {
    doStep();
  }
  chrome.runtime.getBackgroundPage(function(w) {
    w.x=x;
    w.y=y;
  });
  drawSystem();

  // while running call function again
  if (running) {
    window.setTimeout(simulate,1);
  }
}
// function to start or stop simulation
function startStop() {
  // change status
  running = !running;

  // if we're now 'running' button should say pause
  if (running) {
    startButton.value='Pause';
    simulate();
  }
  // if we're no longer 'running' button should say resume
  else {
    startButton.value='Resume';
  }
}
