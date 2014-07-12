var binWidth=0.1;
//var bins=systemSize/binWidth;
var rdf;
var rdf_plot;

/*rdf=new Array(bins);
rdf_plot=new Array(bins);
for (var n=0;n<bins;n++) {
  rdf[n]=0;
  rdf_plot[n]=[binWidth*n,0];
}*/

var numCalcs=0;
var gathering=false;

var numMol;
var x,y;
var systemSize;

function startRDF() {
  var rdfStart=document.getElementById('rdfStart');
  gathering=!gathering;
  if(gathering) {
    rdfStart.value='Stop RDF';
    reset_rdf();
    gatherData();
  }
  else {
   rdfStart.value='Start RDF';
  }
}

function gatherData() {
  for (var i=0;i<25;i++) {
    if (gathering) {
      window.setTimeout(calc_rdf,10);
    }    
  }
  make_rdf();
  if (gathering) {
    window.setTimeout(gatherData,10);
  }
}

function calc_rdf() {
  chrome.runtime.getBackgroundPage(function(w) {
    systemSize=w.systemSize;
    numMol=w.numMol;
    x=w.x;
    y=w.y;
  });
  for (var i=0;i<numMol;i++) {
    for (var j=i+1;j<numMol;j++) {
      dr=sepDist(x[i],y[i],x[j],y[j]);
      if (dr<systemSize) {
        rdf[Math.floor(dr/binWidth)]++;
      }
    }
  }
  numCalcs++;
  for (var i=0;i<bins;i++) {
    rdf_plot[i][1]=rdf[i]/numCalcs;
  }
}

function reset_rdf() {
  numCalcs=0;
  bins=systemSize/binWidth;
  rdf=new Array(bins);
  rdf_plot=new Array(bins);
  for (var n=0;n<bins;n++) {
    rdf[n]=0;
    rdf_plot[n]=[binWidth*n,0];
  }
}

function make_rdf() {
  g = new Dygraph(document.getElementById("graph"),
    rdf_plot, {
      labels: ['X','Y'],
      animatedZooms: true,
      title: 'Radial Distribution Function'
    }
  );
}

onload=function() {

  var rdfStart=document.getElementById('rdfStart');
  rdfStart.onclick=function() {startRDF();};

  chrome.runtime.getBackgroundPage(function(w) {
    systemSize=w.systemSize;
    numMol=w.numMol;
    x=w.x;
    y=w.y;
  });
}

// function to find separation distance given coords
function sepDist(x1,y1,x2,y2) {
  return Math.pow(Math.pow(x1-x2,2)+Math.pow(y1-y2,2),0.5);
}
