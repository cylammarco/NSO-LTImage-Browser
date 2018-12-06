/*
 *
 * False-colour image add-on to JS9
 *
 * Maintainer:
 * Marco Lam
 *
 * Organisation:
 * (1) Liverpool Telescope, ARI, LJMU
 * (2) National Schools' Observatory, ARI, LJMU
 *
 * Contact:
 * c.y.lam@ljmu.ac.uk
 *
 */

function updateContrast(e, c) {
  $(e).attr('value', c);
  var newcontrast = 10. - (10000. - c) / 1000.;
  var colourmap;
  if (e.id == 'redContrast') {
    colourmap = 'red';
  }
  else if (e.id == 'greenContrast') {
    colourmap = 'green';
  }
  else if (e.id == 'blueContrast') {
    colourmap = 'blue';
  }
  var image_list = JS9.images;
  for (i = 0; i < image_list.length; i++) {
    if (image_list[i].params.colormap == colourmap) {
      if (newcontrast < 0.) {
        image_list[i].params.invert = true;
        newcontrast = newcontrast + 10.;
      } else {
        image_list[i].params.invert = false;
      }
      image_list[i].params.contrast = newcontrast;
      image_list[i].displayImage('all');
    }
  }
}

function updateBrightness(e, c) {
  $(e).attr('value', c);
  var newbias = 1. - c / 10000.;
  var imageid;
  if (e.id == 'redBrightness') {
    colourmap = 'red';
  }
  else if (e.id == 'greenBrightness') {
    colourmap = 'green';
  }
  else if (e.id == 'blueBrightness') {
    colourmap = 'blue';
  }
  var image_list = JS9.images;
  for (i = 0; i < image_list.length; i++) {
    if (image_list[i].params.colormap == colourmap) {
      image_list[i].params.bias = newbias;
      image_list[i].displayImage('all');
    }
  }
}

function pandisplay(s) {
  panpos = JS9.getImage(s).getPan(s);
  displays = JS9.displays;
  //console.log("Pan position: (" + panpos.x + ", " + panpos.y + ")");
  for (i = 0; i < displays.length; i++) {
    displayid = displays[i].id
    if (displayid != s) {
      JS9.getImage(displayid).setPan(panpos.x, panpos.y);
    }
  }
}

function zoomdisplay(s) {
  zoomlevel = JS9.getImage(s).getZoom(s);
  displays = JS9.displays;
  //console.log("Zoom: (" + zoomlevel + ")");
  for (i = 0; i < displays.length; i++) {
    displayid = displays[i].id
    if (displayid != s) {
      if (s == "JS9") {
        JS9.getImage(displayid).setZoom(zoomlevel * 0.5);
      }
      else if (displayid == "JS9") {
        JS9.getImage(displayid).setZoom(zoomlevel * 2.0);
      }
      else {
        JS9.getImage(displayid).setZoom(zoomlevel);
      }
    }
  }
}

