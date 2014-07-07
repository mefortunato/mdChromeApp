// display stuff
var winWidth;
var winHeight;
var dimension;
var molR;
var myCanvas;
var myContext;

// md stuff
var numMol=60;
var cutoff=2;
var epsilon=1;
var sigma=1;
var dt=0.02;
var temp;
var x,y,vx,vy,ax,ay;
var running;
var nrg;

// initialization function - called when window opens and initializeButton onclick
function init() {

// find pixel dimensions of window
winWidth=window.innerWidth;
winHeight=window.innerHeight;

// if initializing, stop running
running=false;

// set dimension to 75% of window width(pixels); round to divisible by 10
dimension=parseInt(winWidth*.75/10)*10;

// set display radius for drawing molecule so 10 fit across screen without overlap
molR=parseInt(dimension/10/2);

// make empty arrays for positions, velocities and accelerations
x=new Array(numMol);
y=new Array(numMol);
vx=new Array(numMol);
vy=new Array(numMol);
ax=new Array(numMol);
ay=new Array(numMol);

// make empty array for system energies
nrg=[];

// temporary variables for particle insertion and overlap
var testX,testY;
var overlap;

// insert first molecule with random v with scaled coordinates
x[0]=Math.random()*18+1;
y[0]=Math.random()*18+1;
vx[0]=Math.random()-0.5;
vy[0]=Math.random()-0.5;
ax[0]=0;
ay[0]=0;

// insert rest of molecules with random velocity
for (var i=1;i<numMol;i++) {
  vx[i]=Math.random()-0.5;
  vy[i]=Math.random()-0.5;
  ax[i]=0;
  ay[i]=0;

  // generate random position until there is no overlap with any molecules
  // UPDATE TO MC STEPS
  do {
    overlap=false;
    testX=Math.random()*18+1;
    testY=Math.random()*18+1;
    for (var j=0;j<i;j++) {
      if(sepDist(x[j],y[j],testX,testY)<2) {
        overlap=true;
      }
    }
  }
  while(overlap==true);
  x[i]=testX;
  y[i]=testY;
}

// call function to set pairwise forces acting on all molecules
setForces();

// set dimension of canvas Div element
var canvasDiv=document.getElementById('canvasDiv');
canvasDiv.style.width=dimension;
canvasDiv.style.height=dimension;

// set dimensions (style and actual size) of canvas for system visualization
myCanvas=document.getElementById('myCanvas');
myCanvas.style.width=dimension;
myCanvas.style.height=dimension;
myCanvas.width=dimension;
myCanvas.height=dimension;

// get 2d canvas context
myContext=myCanvas.getContext('2d');

// call function to draw system
drawSystem();

// when this function is called, simulation stops, .: start button resets
var startButton=document.getElementById('startButton');
startButton.value='Start';

}

// when page loads (i.e.-html elements all made) call init() and set onclick functions
onload = function() {
  init();

  var initButton=document.getElementById('initButton');
  initButton.onclick=function() {init();};

  var startButton=document.getElementById('startButton');
  startButton.onclick=function() {startStop();};

  var heatButton=document.getElementById('heatButton');
  heatButton.onclick=function() {changeT(1.5);};

  var coolButton=document.getElementById('coolButton');
  coolButton.onclick=function() {changeT(0.5);};

  chrome.runtime.getBackgroundPage(function(w) {
    w.numMol=numMol;
    w.x=x;
    w.y=y;
  });

}
