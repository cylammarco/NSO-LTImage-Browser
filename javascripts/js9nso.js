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
  } else if (e.id == 'greenContrast') {
    colourmap = 'green';
  } else if (e.id == 'blueContrast') {
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
  } else if (e.id == 'greenBrightness') {
    colourmap = 'green';
  } else if (e.id == 'blueBrightness') {
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
        JS9.getImage(displayid).setZoom(zoomlevel);
      }
    }
  }
}

function tiledisplay(s) {
  // Number of images
  nImg = JS9.images.length;
  nSqrt = Math.floor(Math.sqrt(nImg));
  nRow = nSqrt;
  nCol = nSqrt;
  if (nImg > nRow * nCol) {
    nCol++;
    if (nImg > nRow * nCol) {
      nRow++;
    }
  }
  tWidth = 600/nCol + 'px';
  tHeight = 600/nRow + 'px';
  JS9.LookupDisplay(s).nextImage();
  $('#JS9')[0].style.width = tWidth;
  $('#JS9')[0].style.height = tHeight;
  $('#JS9')[0].style.display = 'inline-block';
  for (var i=1; i<nImg; i++) {
    id = "divJS9_" + i;
    // make up the html with the unique id
    html = sprintf("<div class='" + s + "' id='%s' data-width='" + tWidth + "' data-height='" + tHeight + "'><\/div>", id, id);
    // append to <div class=JS9Displays>
    $(html).appendTo($(".JS9Displays"));
    // create the new JS9 display
    JS9.AddDivs(id);
    // move the first image to that display
    JS9.MoveToDisplay(id, {display: s});
    if ((i) % nCol == nCol-1) {
      $("<br>").appendTo($(".JS9Displays"));
    }
    $('#' + id)[0].style.display = 'inline-block';
  }
}

function gatherdisplay(s) {
  JS9.GatherDisplay(s, {display: id});
  nImg = JS9.images.length;
  for (var i=nImg; i>0; i--) {
    id = "divJS9_" + i;
    // make up the html with the unique id
    $(".JS9Displays #" + id).remove();
    JS9.displays.splice(i,1);
  }
  $('#JS9')[0].style.width = '600px';
  $('#JS9')[0].style.height = '600px';
  $('.JS9Displays').find('br').remove();
  childnodes = $(".JS9Displays")[0].childNodes;
  for (var j=0; j<childnodes.length; j++) {
    if (childnodes[j].nodeName == "#text"){
      $(".JS9Displays")[0].childNodes[j].remove();
    }
  }
}





