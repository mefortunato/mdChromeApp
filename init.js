var winWidth;
var winHeight;
var numMol;
var dimension;
var molR;
var cutoff;
var x,y,vx,vy,ax,ay;
var myCanvas;
var myContext;
var running;

function init() {
winWidth=window.innerWidth;
winHeight=window.innerHeight;
running=false;
numMol=25;
dimension=parseInt(winWidth*.75/10)*10;
molR=parseInt(dimension/10/2);
cutoff=2;
x=new Array(numMol);
y=new Array(numMol);
vx=new Array(numMol);
vy=new Array(numMol);
ax=new Array(numMol);
ay=new Array(numMol);



var testX,testY;
var overlap;

x[0]=Math.random()*18+1;
y[0]=Math.random()*18+1;
vx[0]=Math.random();
vy[0]=Math.random();
ax[0]=0;
ay[0]=0;


for (var i=1;i<numMol;i++) {
  vx[i]=Math.random();
  vy[i]=Math.random();
  ax[i]=0;
  ay[i]=0;
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
setForces();

var canvasDiv=document.getElementById('canvasDiv');
canvasDiv.style.width=dimension;
canvasDiv.style.height=dimension;

myCanvas=document.getElementById('myCanvas');
myCanvas.style.width=dimension;
myCanvas.style.height=dimension;
myCanvas.width=dimension;
myCanvas.height=dimension;

myContext=myCanvas.getContext('2d');

paintCanvas();
}
onload = function() {
  init();

  var initButton=document.getElementById('initButton');
  initButton.onclick=function() {init();};

  var startButton=document.getElementById('startButton');
  startButton.onclick=function() {startStop();};

  var heatButton=document.getElementById('heatButton');
  heatButton.onclick=function() {changeT(3);};

  var coolButton=document.getElementById('coolButton');
  coolButton.onclick=function() {changeT(0.3);};
}
