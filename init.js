// display stuff
var winWidth;
var winHeight;
var pixelDimension;
var displayR;
var myCanvas;
var myContext;

// md stuff
var numMol=60;
var cutoff=2;
var epsilon=1;
var sigma=1;
var systemSize=20;
var dt=0.02;
var mass=1;
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
displayR=parseInt(dimension/systemSize/2*sigma);

// make empty arrays for positions, velocities and accelerations
x=new Array(numMol);
y=new Array(numMol);
vx=new Array(numMol);
vy=new Array(numMol);
ax=new Array(numMol);
ay=new Array(numMol);

// make empty array for system energies
nrg=[];

// insert rest of molecules with random velocity
for (var i=0;i<numMol;i++) {
  x[i]=Math.random()*(systemSize-sigma)+sigma/2;
  y[i]=Math.random()*(systemSize-sigma)+sigma/2;
  vx[i]=Math.random()-0.5;
  vy[i]=Math.random()-0.5;
  ax[i]=0;
  ay[i]=0;
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

  var equilButton=document.getElementById('equilButton');
  equilButton.onclick=function() {mcSteps(1);};

  var addButton=document.getElementById('addButton');
  addButton.onclick=function() {addMol(0,0);};

  var remButton=document.getElementById('remButton');
  remButton.onclick=function() {remMol();};

  var startButton=document.getElementById('startButton');
  startButton.onclick=function() {startStop();};

  var heatButton=document.getElementById('heatButton');
  heatButton.onclick=function() {changeT(1.5);};

  var coolButton=document.getElementById('coolButton');
  coolButton.onclick=function() {changeT(0.5);};

  chrome.runtime.getBackgroundPage(function(w) {
    w.systemSize=systemSize;
    w.numMol=numMol;
    w.x=x;
    w.y=y;
  });

}
