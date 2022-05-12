function snapAnchorInside(i,j) {
  var pos = {x: tensor_xanchors[i][j] + tensor_bbox[i][4], y: tensor_yanchors[i][j] + tensor_bbox[i][5]};
  var isInside = checkInTensor(pos, tensor_xcoords[i], tensor_ycoords[i], tensor_types[i]);
  if (!isInside) {
    if (tensor_types[i] == 0) {
      var xdim = (tensor_bbox[i][2] - tensor_bbox[i][0]) / 2;
      var ydim = (tensor_bbox[i][3] - tensor_bbox[i][1]) / 2;
     
      tensor_xanchors[i][j] = makeInRange(tensor_xanchors[i][j],-xdim,xdim);
      tensor_yanchors[i][j] = makeInRange(tensor_yanchors[i][j],-ydim,ydim);
    } else if (tensor_types[i] == 1) {
      var adim = (tensor_bbox[i][2] - tensor_bbox[i][0]) / 2;
      var bdim = (tensor_bbox[i][3] - tensor_bbox[i][1]) / 2;
      var x0 = tensor_xanchors[i][j];
      var y0 = tensor_yanchors[i][j];
      
      var tsteps = 100;
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
      tensor_xanchors[i][j] = adim*Math.cos(loctemp*2*Math.PI / tsteps);
      tensor_yanchors[i][j] = bdim*Math.sin(loctemp*2*Math.PI / tsteps);
    }
  }
}

