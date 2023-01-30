/**
 * @title Interval.
 * @version 1.0
 * @author Chandler Chappell <chan@ady.world>
 *
 * @description Add an adjustment layer above the currently selected layer to break the 3D space of
 * After Effects. If no layers are selected the adjustment layer will be added at the top.
 *
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 *
 * @notice: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 *
 * Copyright 2014 Adobe Inc.
 * All Rights Reserved.
 **/

var comp;

var mainLayer, layerLength, assetsFolder;

function grainLevelChange(value) {
  for (i = 1; i < comp.numLayers; i++) {
    if (comp.layer(i).name == "03-GRAIN.mp4") {
      var effect = comp.layer(i);
      effect.property("ADBE Effect Parade").property(1).property("ADBE Brightness & Contrast 2-0002").setValue(value);
    }
  }
}

function blooomAmoutChange(value) {
  //OK//default 44
  for (i = 1; i < comp.numLayers; i++) {
    if (comp.layer(i).name == "RED & BLUR") {
      var effect = comp.layer(i);
      effect.property("ADBE Effect Parade").property(2).property("ADBE Gaussian Blur 2-0001").setValue(value);
    }
  }
}

function selectedLayer() {
  if (app.project.activeItem == null) {
    return "";
  } else {
    //After Validating, running Every functions.
    comp = app.project.activeItem;
    return comp.selectedLayers[0].name.toString();
  }
}

function test(txt) {
  alert(txt.toString());
}

function applyClick(dir) {
  if (app.project.activeItem == null) {
    alert("Please, select a composition.");
    return null;
  }
  comp = app.project.activeItem;

  if (comp.selectedLayers.length < 1) {
    alert("Please, select a layer in a composition.");
    return null;
  } else if (comp.selectedLayers.length > 1) {
    alert("Please, select only 1 layer in your composition.");
    return null;
  } else {
    //After Validating, running Every functions.

    var compileList = [];
    var indexList = [];

    //Set files Directory
    var a = dir;
    a += "/MOV_FILES";
    var str = a.substring(1);

    var thisFile = new File(str);

    var folder = new Folder(thisFile);
    var files = folder.getFiles();

    //set Comp/Layer
    comp.name = "ADY™ _ Composition";
    mainLayer = comp.selectedLayers[0];

    app.beginUndoGroup("ADY01");

    layerLength = mainLayer.outPoint;
    duplicateLayer();
    createFolder();
    //alert("createFolder"+" Done");
    importToComp();
    //alert("importToComp"+" Done");
    importFiles(files);

    app.endUndoGroup();

    return "ok";
  }
}

function submitClick(val) {
  app.beginUndoGroup("Precompile");
  precompileList(val);
  app.endUndoGroup();
}

function togglePerforation(isToggle) {
  for (i = 1; i < comp.numLayers; i++) {
    if (comp.layer(i).name == "08-SQUARE_OVERLAY.mp4") {
      if (isToggle == "true") {
        comp.layer(i).enabled = true;
      }
      if (isToggle == "false") {
        comp.layer(i).enabled = false;
      }
      return;
    }
  }
}

function toggleFilmBurns(isToggle) {
  for (i = 1; i < comp.numLayers; i++) {
    if (comp.layer(i).name == "06-FILM_BURNS.mov") {
      if (isToggle == "true") {
        comp.layer(i).enabled = true;
      }
      if (isToggle == "false") {
        comp.layer(i).enabled = false;
      }
      return;
    }
  }
}

function remove() {
  deleteFiles();
  deleteFiles();
}

function deleteFiles() {
  app.beginUndoGroup("Removing Layers");
  // precompileList (indexList);

  var list = [
    "01-SCRATCHES.mp4",
    "02-GAMMA.mp4",
    "03-GRAIN.mp4",
    "04-EDGES.mp4",
    "05-HORIZONTAL_BAR.mov",
    "06-FILM_BURNS.mov",
    "07-FRAME_OVERLAY.mp4",
    "08-SQUARE_OVERLAY.mp4",
    "09-DIRTY_EDGES.mov",
    "TRANSFORM",
    "RED & BLUR",
    "COLOR GLOW",
    "FLICKER",
  ];
  //remove from layers by altering
  var k, l, m;
  for (k = 0; k < list.length; k++) {
    for (l = 1; l < app.project.numItems + 1; l++) {
      if (list[k] == app.project.item(l).name) {
        app.project.item(l).remove();
      } else if (app.project.item(l).name == "ADY™-Assets") {
        app.project.item(l).remove();
      }
    }
  }

  for (m = 1; m < comp.numLayers; m++) {
    //alert(comp.layer(m).name);
    if (comp.layer(m).name == "Bot clip") {
      comp.layer(m).remove();
    } else if (comp.layer(m).name == "Top clip") {
      comp.layer(m).remove();
    }
  }

  app.endUndoGroup();
}

function duplicateLayer() {
  //DUPLICATE MAIN LAYER
  var height = (115 / 1080) * comp.height - comp.height;
  var height2 = (1020 / 1080) * comp.height;

  var pos = mainLayer.transform.position.value;
  var layerTop = mainLayer.duplicate();
  layerTop.name = "Top clip";
  layerTop.audioEnabled = false;
  layerTop.transform.position.setValue(pos + [0, height]);
  var topBlur = layerTop.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
  topBlur.name = "GAUSSIAN BLUR";
  topBlur.property("ADBE Gaussian Blur 2-0001").setValue(88);
  topBlur.property("ADBE Gaussian Blur 2-0002").setValue(3);

  var layerBot = mainLayer.duplicate();
  layerBot.name = "Bot clip";
  layerBot.transform.position.setValue(pos + [0, height2]);
  layerBot.audioEnabled = false;
  var botBlur = layerBot.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
  botBlur.name = "GAUSSIAN BLUR";
  botBlur.property("ADBE Gaussian Blur 2-0001").setValue(88);
  botBlur.property("ADBE Gaussian Blur 2-0002").setValue(3);
}

function importToComp() {
  //SET DEFAULT VALUES
  var compWidth = comp.width;
  var compHeight = comp.height;
  var col = [1, 1, 1];
  var px = 1;

  try {
    //                                EDIT HERE----------------
    var transformAV_properties = {
      name: "TRANSFORM",
      typeName: "Footage",
      label: 1,
      pixelAspect: 1,
      mainSource: { color: [1, 1, 1] },
    };
    var transformAV = findProjectItem(assetsFolder, false, transformAV_properties);
    if (transformAV === null) {
      var calqueDeffets1_tempSolid = comp.layers.addSolid(col, transformAV_properties.name, compWidth, compHeight, px);
      var transformAV = calqueDeffets1_tempSolid.source;
      transformAV.parentFolder = assetsFolder;
      calqueDeffets1_tempSolid.remove();
    }
    // CREATE AVLAYERS to add on the comp
    var flickerAV_properties = {
      name: "FLICKER",
      typeName: "Footage",
      label: 1,
      pixelAspect: 1,
      mainSource: { color: [1, 1, 1] },
    };
    var flickerAV = findProjectItem(assetsFolder, false, flickerAV_properties);
    if (flickerAV === null) {
      var calqueDeffets1_tempSolid = comp.layers.addSolid(col, flickerAV_properties.name, compWidth, compHeight, px);
      flickerAV = calqueDeffets1_tempSolid.source;
      flickerAV.parentFolder = assetsFolder;
      calqueDeffets1_tempSolid.remove();
    }

    var colorGlowAV_properties = {
      name: "COLOR GLOW",
      typeName: "Footage",
      label: 1,
      pixelAspect: 1,
      mainSource: { color: [1, 1, 1] },
    };
    var colorGlowAV = findProjectItem(assetsFolder, false, colorGlowAV_properties);
    if (colorGlowAV === null) {
      var tempSolid = comp.layers.addSolid(col, colorGlowAV_properties.name, compWidth, compHeight, px);
      colorGlowAV = tempSolid.source;
      colorGlowAV.parentFolder = assetsFolder;
      tempSolid.remove();
    }

    var redBlurAV_properties = {
      name: "RED & BLUR",
      typeName: "Footage",
      label: 1,
      pixelAspect: 1,
      mainSource: { color: [1, 1, 1] },
    };
    var redBlurAV = findProjectItem(app.project.rootFolder, false, redBlurAV_properties);
    if (redBlurAV === null) {
      var tempSolid = comp.layers.addSolid(col, redBlurAV_properties.name, compWidth, compHeight, px);
      redBlurAV = tempSolid.source;
      redBlurAV.parentFolder = assetsFolder;
      tempSolid.remove();
    }
    // CREATE AVLAYERS END

    // Working with comp "ADY01", varName "comp";

    //Add existing Solid Layer Vertical Flick effect   EDIT HERE----------------
    var transform = comp.layers.add(transformAV);
    transform.name = "TRANSFORM";

    transform.outPoint = layerLength;
    transform.adjustmentLayer = true;
    transform.selected = false;
    // Apply expressions to properties
    try {
      transform.property("ADBE Effect Parade").addProperty("ADBE Geometry2");
      transform.property("ADBE Effect Parade").property(1).property("Position").expression =
        "([position[0],wiggle(44,22)[1]])";
    } catch (err) {}

    // Add existing Solid Layer "Calque d'effets 5", varName "flickerAV";
    var flicker = comp.layers.add(flickerAV);
    flicker.name = "FLICKER";
    //flicker.label = 5;
    flicker.outPoint = layerLength;
    flicker.adjustmentLayer = true;
    flicker.property("ADBE Effect Parade").addProperty("ADBE Exposure2");
    flicker.property("ADBE Effect Parade").property(1).name = "Exposure";
    flicker.property("ADBE Effect Parade").property(1).property("ADBE Exposure2-0003").setValue(0);
    flicker.selected = false;
    // Apply expressions to properties
    try {
      flicker.property("ADBE Effect Parade").property(1).property("ADBE Exposure2-0003").expression = "wiggle(10,0.1)";
    } catch (err) {}

    // Add existing Solid Layer "Calque d'effets 3", varName "colorGlowAV";
    var colorGlow = comp.layers.add(colorGlowAV);
    colorGlow.name = "COLOR GLOW";
    //colorGlow.label = 5;
    colorGlow.outPoint = layerLength;
    colorGlow.adjustmentLayer = true;
    if (colorGlow.property("ADBE Effect Parade").canAddProperty("ADBE Lumetri")) {
      colorGlow.property("ADBE Effect Parade").addProperty("ADBE Lumetri");
    } else {
      return alert(
        'Cannot apply "LUMETRI" (ADBE Lumetri) effect to layer "' +
          colorGlow.name +
          "\" because you don't have this effect installed on your system."
      );
    }
    colorGlow.property("ADBE Effect Parade").property(1).name = "LUMETRI";
    colorGlow.property("ADBE Effect Parade").property(1).property("ADBE Lumetri-0063").setValue(100);
    colorGlow.property("ADBE Effect Parade").property(1).property("ADBE Lumetri-0012").setValue(-50);
    colorGlow.property("ADBE Effect Parade").property(1).property("ADBE Lumetri-0013").setValue(-36);
    colorGlow.property("ADBE Effect Parade").property(1).property("ADBE Lumetri-0015").setValue(22);
    colorGlow.property("ADBE Effect Parade").property(1).property("ADBE Lumetri-0065").setValue(100);
    colorGlow.property("ADBE Effect Parade").property(1).property("ADBE Lumetri-0066").setValue(100);
    colorGlow.property("ADBE Effect Parade").property(1).property("ADBE Lumetri-0097").setValue(1);
    colorGlow.property("ADBE Effect Parade").addProperty("ADBE Glo2");
    colorGlow.property("ADBE Effect Parade").property(2).name = "GLOW";
    colorGlow.property("ADBE Effect Parade").property(2).property("ADBE Glo2-0002").setValue(112.199996948242);
    colorGlow.property("ADBE Effect Parade").property(2).property("ADBE Glo2-0003").setValue(300);
    colorGlow.property("ADBE Effect Parade").property(2).property("ADBE Glo2-0004").setValue(0.10000000149012);
    colorGlow.selected = false;

    // Add existing Solid Layer "Calque d'effets 1", varName "redBlurAV";
    redBlur = comp.layers.add(redBlurAV);
    redBlur.name = "RED & BLUR";
    //redBlur.label = 5;
    redBlur.outPoint = layerLength;
    redBlur.adjustmentLayer = true;
    redBlur.blendingMode = BlendingMode.LIGHTEN;
    redBlur.property("ADBE Effect Parade").addProperty("ADBE Channel Blur");
    redBlur.property("ADBE Effect Parade").property(1).name = "CHANNEL BLUR";
    redBlur.property("ADBE Effect Parade").property(1).property("ADBE Channel Blur-0001").setValue(100);
    redBlur.property("ADBE Effect Parade").property(1).property("ADBE Channel Blur-0002").setValue(22);
    redBlur.property("ADBE Effect Parade").property(1).property("ADBE Channel Blur-0005").setValue(1);
    redBlur.property("ADBE Effect Parade").property(1).property("ADBE Channel Blur-0006").setValue(3);
    if (redBlur.property("ADBE Effect Parade").canAddProperty("ADBE Gaussian Blur 2")) {
      redBlur.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
    } else {
      return alert(
        'Cannot apply "GAUSSIAN BLUR" (ADBE Gaussian Blur 2) effect to layer "' +
          redBlur.name +
          "\" because you don't have this effect installed on your system."
      );
    }
    redBlur.property("ADBE Effect Parade").property(2).name = "GAUSSIAN BLUR";
    redBlur.property("ADBE Effect Parade").property(2).property("ADBE Gaussian Blur 2-0001").setValue(44);
    redBlur.property("ADBE Effect Parade").property(2).property("ADBE Gaussian Blur 2-0002").setValue(2);
    redBlur.property("ADBE Effect Parade").property(2).property("ADBE Gaussian Blur 2-0003").setValue(1);
    redBlur.selected = false;

    return {
      compItem: comp,
    };
  } catch (e) {
    alert(
      e.toString() +
        "\nScript File: " +
        File.decode(e.fileName).replace(/^.*[\|\/]/, "") +
        "\nFunction: " +
        arguments.callee.name +
        "\nError on Line: " +
        e.line.toString()
    );
  }
}

function importFiles(fileList) {
  fileList.sort();

  var w = comp.width;
  var h = comp.height;
  var vw, vh;
  var footageBlend = [
    BlendingMode.ADD, //SCRATCHES
    BlendingMode.LIGHTEN, //GAMMA
    BlendingMode.OVERLAY, //GRAIN
    BlendingMode.DIFFERENCE, //EDGES
    BlendingMode.CLASSIC_COLOR_BURN, //HORIZONTAL_BAR//
    BlendingMode.SCREEN, //FILM_BURNS//
    BlendingMode.HARD_LIGHT, //FRAME_OVERLAY
    BlendingMode.ADD, //SQUARE_OVERLAY
    BlendingMode.OVERLAY, //DIRTY_EDGES//
  ];

  for (var i = 0; i < fileList.length; i++) {
    // Verify if import is required
    var footageFile = getFileByName(fileList[i].name);

    if (footageFile == null) {
      var importFootage = app.project.importFile(new ImportOptions(fileList[i])); //Import to project
    }
    {
      // Rescale The clip to fit Composition
      vw = importFootage.width;
      vh = importFootage.height;
      xscale = (w / vw) * 100;
      yscale = (h / vh) * 100;
      var footage = comp.layers.add(importFootage); // Add footage to your composition
      footage.property("Scale").setValue([xscale, yscale]);
      footage.moveToBeginning();
      footage.blendingMode = footageBlend[i];
      //Set the duration
      var code = "loopOut('Cycle')";
      var outPoint = footage.outPoint;
      footage.timeRemapEnabled = true;
      footage.timeRemap.expression = code;
      var length = layerLength.toFixed(2);
      var duration = footage.source.duration.toFixed(2);
      footage.outPoint = length;
      footage.property("timeRemap").addKey(footage.inPoint);
      footage.property("timeRemap").addKey(duration);
      importFootage.parentFolder = assetsFolder;
      switch (importFootage.name) {
        case "02-GAMMA.mp4":
          footage.opacity.setValue(22);
          footage.property("ADBE Effect Parade").addProperty("ADBE Exposure2");
          break;
        case "03-GRAIN.mp4":
          footage.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2");
          break;
        case "05-HORIZONTAL_BAR.mov":
          footage.property("ADBE Effect Parade").addProperty("ADBE Exposure2");
          footage.property("ADBE Effect Parade").property(1).name = "Exposure";
          footage.property("ADBE Effect Parade").property(1).property("ADBE Exposure2-0003").setValue(1.6);

          footage.property("ADBE Effect Parade").addProperty("ADBE Glo2");
          footage.property("ADBE Effect Parade").property(2).name = "GLOW";
          footage.property("ADBE Effect Parade").property(2).property("ADBE Glo2-0002").setValue(81.6);
          footage.property("ADBE Effect Parade").property(2).property("ADBE Glo2-0003").setValue(0);
          footage.property("ADBE Effect Parade").property(2).property("ADBE Glo2-0004").setValue(0);
          footage.selected = false;

          break;
        case "06-FILM_BURNS.mov":
          footage.enabled = false;
          break;

        case "09-DIRTY_EDGES.mov":
          footage.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
          footage.property("ADBE Effect Parade").property(1).name = "GAUSSIAN BLUR";
          footage.property("ADBE Effect Parade").property(1).property("ADBE Gaussian Blur 2-0001").setValue(4);
          footage.selected = false;
          break;
      }
    }
  }
}

function precompileList(layerName) {
  var list = [
    "01-SCRATCHES.mp4",
    "02-GAMMA.mp4",
    "03-GRAIN.mp4",
    "04-EDGES.mp4",
    "05-HORIZONTAL_BAR.mov",
    "06-FILM_BURNS.mov",
    "07-FRAME_OVERLAY.mp4",
    "08-SQUARE_OVERLAY.mp4",
    "09-DIRTY_EDGES.mov",
    "TRANSFORM",
    "RED & BLUR",
    "COLOR GLOW",
    "FLICKER",
    "Bot clip",
    "Top clip",
  ];

  list.push(layerName);

  // Alterate trough all the layers to get the "Layer Index" & precompile.
  var newList = [];
  var i, j;

  for (i = 1; i < comp.numLayers + 1; i++) {
    //alert(comp.layer(i).name);
    for (j = 0; j < list.length; j++) {
      //alert(comp.layer(i).name);
      if (comp.layer(i).name == list[j]);
      {
        newList.push(i);
        break;
      }
    }
  }

  comp.layers.precompose(newList, "ADY01", true);
  /*
     var tempNullComp = app.project.items.addComp("tempNullComp", 100, 100, 1, 1, 24);
     var tempNullLayer = tempNullComp.layers.addNull();
     var nullFolder = tempNullLayer.source.parentFolder;
         tempNullLayer.source.remove();
         tempNullComp.remove();
     if (nullFolder.numItems === 0)
         nullFolder.remove();
    */
}

function createFolder() {
  var folder_properties = {
    name: "ADY™ Assets",
    typeName: "Folder",
    label: 2,
    comment: "",
  };
  assetsFolder = findProjectItem(app.project.rootFolder, false, folder_properties);
  if (assetsFolder === null) {
    assetsFolder = app.project.items.addFolder("ADY™-Assets");
  }
}

function getFileByName(fileName) {
  var myProject = app.project;
  for (var i = 1; i <= myProject.numItems; i++) {
    if (myProject.item(i) instanceof FolderItem && myProject.item(i).name == fileName) {
      result = folderName;

      return folderName;
    }
    return null;
  }
}

function findProjectItem(searchFolder, recursion, userData) {
  var folderItem;
  for (var i = 1, il = searchFolder.items.length; i <= il; i++) {
    folderItem = searchFolder.items[i];
    if (propertiesMatch(folderItem, userData)) return folderItem;
    else if (recursion === true && folderItem instanceof FolderItem && folderItem.numItems > 0) {
      var item = findProjectItem(folderItem, recursion, userData);
      if (item !== null) return item;
    }
  }
  return null;
}

function propertiesMatch(projectItem, userData) {
  if (typeof userData === "undefined") return true;

  for (var propertyName in userData) {
    if (!userData.hasOwnProperty(propertyName)) continue;

    if (typeof userData[propertyName] !== typeof projectItem[propertyName]) return false;

    if (isArray(userData[propertyName]) && isArray(projectItem[propertyName])) {
      if (userData[propertyName].toString() !== projectItem[propertyName].toString()) {
        return false;
      }
    } else if (typeof userData[propertyName] === "object" && typeof projectItem[propertyName] === "object") {
      if (!propertiesMatch(projectItem[propertyName], userData[propertyName])) {
        return false;
      }
    } else if (projectItem[propertyName] !== userData[propertyName]) {
      return false;
    }
  }
  return true;
}
function isArray(object) {
  return Object.prototype.toString.apply(object) === "[object Array]";
}
