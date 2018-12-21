/*
 * False-colour image add-on to JS9
 *
 * Maintainer:
 * Marco C Lam
 *
 * Organisation:
 * (1) Liverpool Telescope, ARI, LJMU
 * (2) National Schools' Observatory, ARI, LJMU
 *
 * Contact:
 * C.Y.Lam@ljmu.ac.uk
 */

// Apply JS9 global settings
JS9.globalOpts.mouseActions[1] = "pan the image";
JS9.globalOpts.touchActions[1] = "pan the image";
JS9.globalOpts.mousetouchZoom = true;
JS9.globalOpts.clearImageMemory = "auto";
JS9.textColorOpts = {
  regions: "#C7D401",
  info: "#C7D401",
  inimage: "#000000"
};

// set WCS display to degrees
// (WCS diaplay is by default turned off)
JS9.imageOpts.wcsunits = "degrees";

// Deafult NSO choice of variables
var NSO = {};

NSO.blinkInterval = 500;
NSO.minBlinkInterval = 150;
NSO.maxBlinkInterval = 2000;
NSO.blinkMode = false;
NSO.exampleFiles = [
  "h_e_20170924_42_1_1_1.gz",
  "h_e_20170924_43_1_1_1.gz",
  "h_e_20170924_44_1_1_1.gz"
];
NSO.imgOpts = {
  scale: "log",
  scaleclipping: "zmax",
  zoom: "0.5"
};
NSO.threeColour = ['red', 'green', 'blue'];

// Update image bias from the brightness slider
function updateBrightness(e, c) {
  $(e).attr('value', c);
  newbias = 1. - c / 10000.;
  currentimage = JS9.getImage();
  currentimage.params.bias = newbias;
  currentimage.displayImage('all');
}

// Update image contrast from the contrast slider
function updateContrast(e, c) {
  $(e).attr('value', c);
  newcontrast = 10. - (10000. - c) / 1000.;
  currentimage = JS9.getImage();
  if (newcontrast < 0.) {
    currentimage.params.invert = true;
    newcontrast = newcontrast + 10.;
  } else {
    currentimage.params.invert = false;
  }
  currentimage.params.contrast = newcontrast;
  currentimage.displayImage('all');
}

// Update the image scalemin from the z-min slider
// Image scalemax is also updated if the new scalemin is larger than the scalemax
function updateZMin(zmin, zmax, c) {
  $(zmin).attr('value', c);
  var newZ = Math.pow(10., (c / 10000.));
  var currentImage = JS9.getImage();
  currentImage.params.scalemin = newZ;
  // make sure zMax is larger than zMin
  // and update slider
  if (currentImage.params.scalemax < newZ) {
    currentImage.params.scalemax = newZ;
    zmax.value = c;
  }
  currentImage.displayImage('all');
}

// Update the image scalemax from the z-max slider
// Image scalemin is also updated if the new scalemin is smaller than the scalemin
function updateZMax(zmin, zmax, c) {
  $(zmax).attr('value', c);
  var newZ = Math.pow(10., (c / 10000.));
  var currentImage = JS9.getImage();
  currentImage.params.scalemax = newZ;
  // make sure zMax is larger than zMin
  // and update slider
  if (currentImage.params.scalemin > newZ) {
    currentImage.params.scalemin = newZ;
    zmin.value = c;
  }
  currentImage.displayImage('all');
}

// Three-colour mode of updateZMin
function updateThreeColourZMin(zmin, zmax, c) {
  $(zmin).attr('value', c);
  var newZ = Math.pow(10., (c / 10000.));
  var colourmap;
  if (zmin.id == 'redZMin') {
    colourmap = 'red';
  } else if (zmin.id == 'greenZMin') {
    colourmap = 'green';
  } else if (zmin.id == 'blueZMin') {
    colourmap = 'blue';
  }
  var image_list = JS9.images;
  for (i = 0; i < image_list.length; i++) {
    if (image_list[i].params.colormap == colourmap) {
      image_list[i].params.scalemin = newZ;
      if (image_list[i].params.scalemax < newZ) {
        image_list[i].params.scalemax = newZ;
        zmax.value = c;
      }
      image_list[i].displayImage('all');
    }
  }
}

// Three-colour mode of updateZMax
function updateThreeColourZMax(zmin, zmax, c) {
  $(zmax).attr('value', c);
  var newZ = Math.pow(10., (c / 10000.));
  var colourmap;
  if (zmax.id == 'redZMax') {
    colourmap = 'red';
  } else if (zmax.id == 'greenZMax') {
    colourmap = 'green';
  } else if (zmax.id == 'blueZMax') {
    colourmap = 'blue';
  }
  var image_list = JS9.images;
  for (i = 0; i < image_list.length; i++) {
    if (image_list[i].params.colormap == colourmap) {
      image_list[i].params.scalemax = newZ;;
      if (image_list[i].params.scalemin > newZ) {
        image_list[i].params.scalemin = newZ;
        zmin.value = c;
      }
      image_list[i].displayImage('all');
    }
  }
}

// Three-colour mode of updateContrast
function updateThreeColourContrast(e, c) {
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

// Three-colour mode of updateBrightness
function updateThreeColourBrightness(e, c) {
  $(e).attr('value', c);
  var newbias = 1. - c / 10000.;
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

// Sync panning of images
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

// Sync zooming of images
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

// Displaying all loaded images in tiles
function tiledisplay(s) {
  // Number of images
  nImg = JS9.images.length;
  nSqrt = Math.floor(Math.sqrt(nImg));
  nRow = nSqrt;
  nCol = nSqrt;
  // Find the smallest n * n or n * (n-1) to display all images
  if (nImg > nRow * nCol) {
    nCol++;
    if (nImg > nRow * nCol) {
      nRow++;
    }
  }
  tWidth = 600 / nCol + 'px';
  tHeight = 600 / nRow + 'px';
  JS9.LookupDisplay(s).nextImage();
  $('#JS9')[0].style.width = tWidth;
  $('#JS9')[0].style.height = tHeight;
  $('#JS9')[0].style.display = 'inline-block';
  for (var i = 1; i < nImg; i++) {
    id = "divJS9_" + i;
    // make up the html with the unique id
    html = sprintf("<div class='" + s + "' id='%s' data-width='" + tWidth + "' data-height='" + tHeight + "'><\/div>", id, id);
    // append to <div class=JS9Displays>
    $(html).appendTo($(".JS9Displays"));
    // create the new JS9 display
    JS9.AddDivs(id);
    // move the first image to that display
    JS9.MoveToDisplay(id, {
      display: s
    });
    if ((i) % nCol == nCol - 1) {
      $("<br>").appendTo($(".JS9Displays"));
    }
    $('#' + id)[0].style.display = 'inline-block';
  }
}

// Gathering all images to the main display
// Also remove all display div elements
function gatherdisplay(s) {
  JS9.GatherDisplay(s, {
    display: id
  });
  nImg = JS9.images.length;
  for (var i = nImg; i > 0; i--) {
    id = "divJS9_" + i;
    // make up the html with the unique id
    $(".JS9Displays #" + id).remove();
    JS9.displays.splice(i, 1);
  }
  $('#JS9')[0].style.width = '600px';
  $('#JS9')[0].style.height = '600px';
  $('.JS9Displays').find('br').remove();
  childnodes = $(".JS9Displays")[0].childNodes;
  for (var j = 0; j < childnodes.length; j++) {
    if (childnodes[j].nodeName == "#text") {
      $(".JS9Displays")[0].childNodes[j].remove();
    }
  }
}

// A customised image saving function to output a full frame image,
// the default saveIMG function only save the part of the image being displayed
function mySaveIMG(ftype, mysize) {

  imSize = Math.max(JS9.getImage('JS9').params.image.xdim);

  JS9.LookupDisplay('bgDummy').resize(mysize, mysize);
  JS9.LookupDisplay('bgDummy').image.setZoom(mysize / imSize);
  setTimeout(function() {
    JS9.LookupDisplay('bgDummy').image.saveIMG("3ColourImage." + ftype, ftype)
  }, (Math.log(mysize) - 1.3) * 500);
}

// Blink function
// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
var blinkfunc = function() {
  var imlist = JS9.images;

  asyncForEach(imlist, async(im) => {
    if (blinkModeOn) {
      im.displayImage();
    }
    await waitFor(blinkinterval);
  }).then(function() {
    if (blinkModeOn) {
      blinkfunc();
    }
  })
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

// Save the "colour map" of the single-frame 3-colour image
// This is setup to save the "colour map" for only the display JS9
function saveOpts(file) {
  var i, obj, str, blob, im;
  if( !window.hasOwnProperty("saveAs") ){
    JS9.error("no saveAs function available to save session");
  }
  // filename for saving
  file = file || "js9.nsocmap";
  // make sure we have the right extension
  if( !file.match(/\.nsocmap$/) ){
    file += ".nsocmap";
  }
  // change the cursor to show the waiting status
  JS9.waiting(true, this.display);
  // empty object to be populated and saved
  obj = {};
  // save all the necessary parameters from *all* images in display JS9
  for (i=0; i<JS9.images.length; i++) {
    im = JS9.images[i];
    if (im.display.id == 'JS9') {
      obj[im.params.colormap] = {
        bias: im.params.bias,
        bounce: im.params.bounce,
        colormap: im.params.colormap,
        contrast: im.params.contrast,
        invert: im.params.invert,
        scale: im.params.scale,
        scaleclipping: im.params.scaleclipping,
        scalemax: im.params.scalemax,
        scalemin: im.params.scalemin
      }
    }
  }
  // save display parameters
  obj.display = {blendMode: JS9.LookupDisplay('JS9').blendMode};
  // make a blob from the stringified session object
  try{ str = JSON.stringify(obj, null, 4); }
  catch(e){ JS9.error("can't create json file for save session", e); }
  blob = new Blob([str], {type: "application/json"});
  // save it
  saveAs(blob, file);
  // done waiting
  JS9.waiting(false);
  // return file name
  return file;
};

// Load the "colour map" of the single-frame 3-colour image
function loadOpts(file) {
  var i, obj, str, blob, im;
  // file is read by the browser, never transferred back to the server,
  // hence no ajax of http methods are used
  var reader = new FileReader();
  reader.readAsText(file.files[0])
  // call back function to the reader otherwise the browser will read the file
  // before it is read
  reader.onloadend = function() {
    obj = JSON.parse(reader.result);
    console.log(obj);
    // change the cursor to show the waiting status
    JS9.waiting(true, this.display);

    // reconstitute display parameters
    JS9.LookupDisplay('JS9').blendMode = obj.display.blendMode;
    for (var i=0; i<JS9.images.length; i++) {
      im = JS9.images[i];
      colour = im.cmapObj.name;
      im.params.bias = obj[colour].bias;
      im.params.bounce = obj[colour].bounce;
      im.params.colormap = obj[colour].colormap;
      im.params.contrast = obj[colour].contrast;
      im.params.invert = obj[colour].invert;
      im.params.scale = obj[colour].scale;
      im.params.scaleclipping = obj[colour].scaleclipping;
      im.params.scalemax = obj[colour].scalemax;
      im.params.scalemin = obj[colour].scalemin;
      im.displayImage('all');
    }
    // done waiting
    JS9.waiting(false);
  }
}

// Turn on blend mode until n images are loaded
function blendAll(n) {
  // Change blend mode to true when all images are loaded
  var checkLoad = function() {
      if (JS9.images.length < n) {
        setTimeout(checkLoad, 100);
        //console.log('waiting');
        //console.log(JS9.images.length + ' loaded');
      } else {
        //console.log('ready to load');
        im = JS9.images;
        for (var i = 0; i < n; i++) {
          $(im[i].blendImage()).prop({
          "active": true,
          "mode": "screen",
          "opacity": 1.0
          });
          im[i].displayImage('all');
        }
      }
    }
  // apply blend mode
  setTimeout(checkLoad, 100);
}
