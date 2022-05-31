
function snapAllAnchors() {
  var numIndices = indices.length;
  var numSelected = currSelected.length;
  for (var i=1; i<numIndices; i++) {
    if (indices[i].connects[0]<0 && 
        indices[i].connects[2]<0) {
      // internal index: do nothing
    } else if (indices[i].connects[0]<0) {
      var i0 = indices[i].connects[2];
      var j0 = indices[i].connects[3];
      if (numSelected==0 || currSelected.indexOf(i0)>=0) {
        tensors[i0].xanchors[j0] = indices[i].end[0];
        tensors[i0].yanchors[j0] = indices[i].end[1];
        snapAnchorInside(i0,j0);
      }
    } else if (indices[i].connects[2]<0) {
      var i0 = indices[i].connects[0];
      var j0 = indices[i].connects[1];
      if (numSelected==0 || currSelected.indexOf(i0)>=0) {
        tensors[i0].xanchors[j0] = indices[i].end[0];
        tensors[i0].yanchors[j0] = indices[i].end[1];
      }
      snapAnchorInside(i0,j0);
    } else {
      var i0 = indices[i].connects[0];
      var j0 = indices[i].connects[1];
      var i1 = indices[i].connects[2];
      var j1 = indices[i].connects[3];
      if (numSelected==0 || currSelected.indexOf(i1)>=0) {
        tensors[i1].xanchors[j1] = tensors[i0].xanchors[j0] + tensors[i0].bbox[4] - tensors[i1].bbox[4]; 
        tensors[i1].yanchors[j1] = tensors[i0].yanchors[j0] + tensors[i0].bbox[5] - tensors[i1].bbox[5]; 
        snapAnchorInside(i1,j1);
      }
      if (numSelected==0 || currSelected.indexOf(i0)>=0) {
        tensors[i0].xanchors[j0] = tensors[i1].xanchors[j1] + tensors[i1].bbox[4] - tensors[i0].bbox[4]; 
        tensors[i0].yanchors[j0] = tensors[i1].yanchors[j1] + tensors[i1].bbox[5] - tensors[i0].bbox[5]; 
        snapAnchorInside(i0,j0);
      }
      if (numSelected==0 || currSelected.indexOf(i1)>=0) {
        tensors[i1].xanchors[j1] = tensors[i0].xanchors[j0] + tensors[i0].bbox[4] - tensors[i1].bbox[4]; 
        tensors[i1].yanchors[j1] = tensors[i0].yanchors[j0] + tensors[i0].bbox[5] - tensors[i1].bbox[5]; 
        snapAnchorInside(i1,j1);
      }
    }
  }
  drawTensors();
}

function createAnchor(ind) {
  var numAnchors = tensors[ind].xanchors.length;
  if (numAnchors < 14) {
    var rot = tensors[ind].rot;
    var slope = tensors[ind].slope;
    
    if (rot == 0 || rot == 2) {
      var anchorLocRadiusX = 0.4*(1-slope)*Math.abs(tensors[ind].bbox[2] - tensors[ind].bbox[0]);
      var anchorLocRadiusY = 0.4*Math.abs(tensors[ind].bbox[3] - tensors[ind].bbox[1]); 
    } else {
      var anchorLocRadiusX = 0.4*Math.abs(tensors[ind].bbox[2] - tensors[ind].bbox[0]);
      var anchorLocRadiusY = 0.4*(1-slope)*Math.abs(tensors[ind].bbox[3] - tensors[ind].bbox[1]); 
    }
    tensors[ind].xanchors.push(-anchorLocRadiusX * Math.cos((rot*Math.PI/2) + (numAnchors+1)*2*Math.PI / (7.3)));
    tensors[ind].yanchors.push(-anchorLocRadiusY * Math.sin((rot*Math.PI/2) + (numAnchors+1)*2*Math.PI / (7.3)));
    tensors[ind].connects.push(0);
  }
}

function deleteAnchor(ind) {
  var numIndices = tensors[ind].connects.length;
  var tempInd = Math.abs(tensors[ind].connects[numIndices-1]);
  
  // console.log('hello')
  // console.log(tempInd)
  
  if (tempInd !=0 ) {//occupied
    deleteIndex(tempInd);
  }
  tensors[ind].xanchors.pop();
  tensors[ind].yanchors.pop();
  tensors[ind].connects.pop();
}

function snapAnchorInside(i,j) {
  var pos = {x: tensors[i].xanchors[j] + tensors[i].bbox[4], 
             y: tensors[i].yanchors[j] + tensors[i].bbox[5]};
  
  var isInside = checkInTensor(pos, i);
  
  if (!isInside) {
    if (tensors[i].type == 0) {//rectangle
      var xdim = (tensors[i].bbox[2] - tensors[i].bbox[0]) / 2;
      var ydim = (tensors[i].bbox[3] - tensors[i].bbox[1]) / 2;
      tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-xdim,xdim);
      tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-ydim,ydim);
      
    } else if (tensors[i].type == 1) {//ellipse
      var adim = (tensors[i].bbox[2] - tensors[i].bbox[0]) / 2;
      var bdim = (tensors[i].bbox[3] - tensors[i].bbox[1]) / 2;
      var x0 = tensors[i].xanchors[j];
      var y0 = tensors[i].yanchors[j];
      
      var tsteps = 300;
      var dtemp = ((adim-x0)**2 + (y0)**2);
      var loctemp = 0;
      for (var p=1; p<tsteps; p++) {
        var thettemp = p*2*Math.PI / tsteps;
        var dtemp0 = ((adim*Math.cos(thettemp)-x0)**2 + (bdim*Math.sin(thettemp)-y0)**2);
        if (dtemp0 < dtemp) {
          dtemp = dtemp0;
          loctemp = p;
        }
      }
      tensors[i].xanchors[j] = adim*Math.cos(loctemp*2*Math.PI / tsteps);
      tensors[i].yanchors[j] = bdim*Math.sin(loctemp*2*Math.PI / tsteps);
      
    } else if (tensors[i].type == 2) {//dome
      var rot = tensors[i].rot
      var adim = (tensors[i].bbox[2] - tensors[i].bbox[0]) / 2;
      var bdim = (tensors[i].bbox[3] - tensors[i].bbox[1]) / 2;
      var x0 = tensors[i].xanchors[j];
      var y0 = tensors[i].yanchors[j];
      
      switch (rot) {
        case 0:
          if (y0<0) {
            var tsteps = 150;
            var dtemp = (x0**2 + y0**2);
            var loctemp = 0;
            for (var p=1; p<tsteps; p++) {
              var thettemp = p*Math.PI / tsteps;
              var dtemp0 = ((adim*Math.cos(thettemp)-x0)**2 + (bdim*Math.sin(thettemp)+y0)**2);
              if (dtemp0 < dtemp) {
                dtemp = dtemp0;
                loctemp = p;
              }
            }
            tensors[i].xanchors[j] = adim*Math.cos(loctemp*Math.PI / tsteps);
            tensors[i].yanchors[j] = -bdim*Math.sin(loctemp*Math.PI / tsteps);
          } else {
            tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-adim,adim);
            tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-bdim,bdim);
          }
          break;
          
        case 1:
          if (x0>0) {
            var tsteps = 150;
            var dtemp = (x0**2 + y0**2);
            var loctemp = 0;
            for (var p=1; p<tsteps; p++) {
              var thettemp = ((p*Math.PI) / tsteps) - Math.PI/2;
              var dtemp0 = ((adim*Math.cos(thettemp)-x0)**2 + (bdim*Math.sin(thettemp)+y0)**2);
              if (dtemp0 < dtemp) {
                dtemp = dtemp0;
                loctemp = p;
              }
            }
            tensors[i].xanchors[j] = adim*Math.cos((loctemp*Math.PI / tsteps) - Math.PI/2);
            tensors[i].yanchors[j] = -bdim*Math.sin((loctemp*Math.PI / tsteps) - Math.PI/2);
          } else {
            tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-adim,adim);
            tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-bdim,bdim);
          }
          break;
          
        case 2:
          if (y0>0) {
            var tsteps = 150;
            var dtemp = (x0**2 + y0**2);
            var loctemp = 0;
            for (var p=1; p<tsteps; p++) {
              var thettemp = ((p*Math.PI) / tsteps) - Math.PI;
              var dtemp0 = ((adim*Math.cos(thettemp)-x0)**2 + (bdim*Math.sin(thettemp)+y0)**2);
              if (dtemp0 < dtemp) {
                dtemp = dtemp0;
                loctemp = p;
              }
            }
            tensors[i].xanchors[j] = adim*Math.cos((loctemp*Math.PI / tsteps) - Math.PI);
            tensors[i].yanchors[j] = -bdim*Math.sin((loctemp*Math.PI / tsteps) - Math.PI);
          } else {
            tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-adim,adim);
            tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-bdim,bdim);
          }
          break;
          
        case 3:
          if (x0<0) {
            var tsteps = 150;
            var dtemp = (x0**2 + y0**2);
            var loctemp = 0;
            for (var p=1; p<tsteps; p++) {
              var thettemp = ((p*Math.PI) / tsteps) - (3*Math.PI/2);
              var dtemp0 = ((adim*Math.cos(thettemp)-x0)**2 + (bdim*Math.sin(thettemp)+y0)**2);
              if (dtemp0 < dtemp) {
                dtemp = dtemp0;
                loctemp = p;
              }
            }
            tensors[i].xanchors[j] = adim*Math.cos((loctemp*Math.PI / tsteps) - (3*Math.PI/2));
            tensors[i].yanchors[j] = -bdim*Math.sin((loctemp*Math.PI / tsteps) - (3*Math.PI/2));
          } else {
            tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-adim,adim);
            tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-bdim,bdim);
          }
          break;
      }
    } else if (tensors[i].type == 3) {//trap
      var rot = tensors[i].rot;
      var slope = tensors[i].slope;
      var xdim = (tensors[i].bbox[2] - tensors[i].bbox[0]) / 2;
      var ydim = (tensors[i].bbox[3] - tensors[i].bbox[1]) / 2;
      var xc = tensors[i].xanchors[j];
      var yc = tensors[i].yanchors[j];
      
      switch (rot) {
        case 0:
          if (yc<ydim) {
            if (xc < -xdim+slope*xdim) {
              var pos = findLinePoint({x:-xdim, y:ydim}, {x:-xdim+slope*xdim, y:-ydim}, {x:xc, y:yc});
              tensors[i].xanchors[j] = pos.x;
              tensors[i].yanchors[j] = pos.y;
            } else if (xc > xdim-slope*xdim) {
              var pos = findLinePoint({x:xdim, y:ydim}, {x:xdim-slope*xdim, y:-ydim}, {x:xc, y:yc});
              tensors[i].xanchors[j] = pos.x;
              tensors[i].yanchors[j] = pos.y;
            } else
              tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-ydim,ydim);
          } else {
            tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-xdim,xdim);
            tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-ydim,ydim);
          }
          break;
        case 1:
          if (xc>(-xdim)) {
            if (yc < (-ydim+slope*ydim)) {
              var pos = findLinePoint({x:-xdim, y:-ydim}, {x:xdim, y:-ydim+slope*ydim}, {x:xc, y:yc});
              tensors[i].xanchors[j] = pos.x;
              tensors[i].yanchors[j] = pos.y;
            } else if (yc > (ydim-slope*ydim)) {
              var pos = findLinePoint({x:-xdim, y:ydim}, {x:xdim, y:ydim-slope*ydim}, {x:xc, y:yc});
              tensors[i].xanchors[j] = pos.x;
              tensors[i].yanchors[j] = pos.y;
            } else
              tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-xdim,xdim);
          } else {
            tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-xdim,xdim);
            tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-ydim,ydim);
          }
          break;
        case 2:
          if (yc>(-ydim)) {
            if (xc < -xdim+slope*xdim) {
              var pos = findLinePoint({x:-xdim+slope*xdim, y:ydim}, {x:-xdim, y:-ydim}, {x:xc, y:yc});
              tensors[i].xanchors[j] = pos.x;
              tensors[i].yanchors[j] = pos.y;
            } else if (xc > xdim-slope*xdim) {
              var pos = findLinePoint({x:xdim, y:-ydim}, {x:xdim-slope*xdim, y:ydim}, {x:xc, y:yc});
              tensors[i].xanchors[j] = pos.x;
              tensors[i].yanchors[j] = pos.y;
            } else
              tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-ydim,ydim);
          } else {
            tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-xdim,xdim);
            tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-ydim,ydim);
          }
          break;
        case 3:
          if (xc<xdim) {
            if (yc < (-ydim+slope*ydim)) {
              var pos = findLinePoint({x:-xdim, y:-ydim+slope*ydim}, {x:xdim, y:-ydim}, {x:xc, y:yc});
              tensors[i].xanchors[j] = pos.x;
              tensors[i].yanchors[j] = pos.y;
            } else if (yc > (ydim-slope*ydim)) {
              var pos = findLinePoint({x:-xdim, y:ydim-slope*ydim}, {x:xdim, y:ydim}, {x:xc, y:yc});
              tensors[i].xanchors[j] = pos.x;
              tensors[i].yanchors[j] = pos.y;
            } else
              tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-xdim,xdim);
          } else {
            tensors[i].xanchors[j] = makeInRange(tensors[i].xanchors[j],-xdim,xdim);
            tensors[i].yanchors[j] = makeInRange(tensors[i].yanchors[j],-ydim,ydim);
          }
          break;
      }
    }
  }
}

function findLinePoint(p0,p1,pc) {
  var tol = 1e-12; //tolerance to avoid finite precision problems
  
  var v01 = {x: p1.x - p0.x, y: p1.y - p0.y};
  var v0c = {x: pc.x - p0.x, y: pc.y - p0.y};
  var v1c = {x: pc.x - p1.x, y: pc.y - p1.y};
  var n01 = v01.x**2 + v01.y**2;
  var n0c = v0c.x**2 + v0c.y**2;
  var n1c = v1c.x**2 + v1c.y**2;
  
  if (n01 < tol || n0c < tol) {
    return p0
  } else if (n1c < tol) {
    return p1    
  }
 
  if (v01.x*v0c.x + v01.y*v0c.y < 0) {
    return p0
  } else if (v01.x*v1c.x + v01.y*v1c.y > 0) {
    return p1
  } else {
    var dist = (v0c.x*v01.x + v0c.y*v01.y) / n01;
    return {x: p0.x+dist*v01.x, y: p0.y+dist*v01.y}
  }
} 
