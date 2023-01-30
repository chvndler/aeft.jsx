//@include 'json2.js'

// alert(JSON.stringify(a))

function test_host(obj) {
  alert(obj.value);
  // var res = JSON.parse(obj)
  // alert(res.money)
  return "hola from extendscript ";
}

function testObj(obj) {
  alert(obj.value);
  // var res = JSON.parse(obj)
  // alert(res.money)
  return JSON.stringify(obj);
}

// ****** SYNC AHNDLER ******

function getSyncData(data) {
  var key = data.activeLayerKey;
  var mvIndex = data.mvIndex;
  var swapIndex = data.swapIndex;
  var removeIndex = data.removeIndex;
  var moshLayersObj = {
    checkedKey: "",
    checkedMVIndex: -1,
    checkedSwapIndex: -1,
    checkedRemoveIndex: -1,
    activeItemComp: false,
  };

  var mainComp = app.project.activeItem;
  var activeItemComp = checkActiveItem();

  // alert(moshLayersObj.checkedMVIndex)
  // Check if active Item is comp
  if (activeItemComp) {
    // Check if Layers
    if (mainComp.numLayers != 0) {
      // Check if existing indexes are right
      var foundMVLayer = checkIndexForLayer(key, mvIndex, "Mosh-MV-");
      var foundSwapLayer = checkIndexForLayer(key, swapIndex, "Mosh-Swap-");
      var foundRemoveLayer = checkIndexForLayer(
        key,
        removeIndex,
        "Mosh-Remove-"
      );
      // If they are all right
      if (
        foundMVLayer[1] != -1 &&
        foundSwapLayer[1] != -1 &&
        foundRemoveLayer[1] != -1
      ) {
        moshLayersObj.checkedKey = foundMVLayer[0];
        moshLayersObj.checkedMVIndex = foundMVLayer[1];
        moshLayersObj.checkedSwapIndex = foundSwapLayer[1];
        moshLayersObj.checkedRemoveIndex = foundRemoveLayer[1];
      } else {
        // Existing indexs not correct, loop and find them
        moshLayersObj = loopAndFindLayers();
      }
    }
    moshLayersObj.activeItemComp = activeItemComp;
  }

  return JSON.stringify(moshLayersObj);
}

function getActiveLayerData() {
  var key = -1;
  var index = -1;
  var mainComp = app.project.activeItem;
  var selectedLayer = mainComp.selectedLayers[0];
  if (selectedLayer && selectedLayer.name.slice(0, 5) == "Mosh-") {
    var name = selectedLayer.name;
    key = name.slice(name.length - 5);
    index = selectedLayer.index;
  }

  return [key, index];
}

function checkIndexForLayer(key, index, type) {
  var checkedKey = key;
  var checkedIndex = index;

  var mainComp = app.project.activeItem;
  // Check if index even exists
  if (index < mainComp.numLayers && index != -1) {
    // First Check if existing layer index is right
    var name = mainComp.layer(index).name;
    if (
      name.length > type.length + 2 &&
      name.slice(name.length - 5) == key &&
      name.slice(0, type.length) == type
    ) {
      // Existing index is correct
    } else {
      // Existing index false, find it
      checkedKey = "";
      checkedIndex = -1;
    }
  } else {
    // Existing index too big or none existent thus false, find it
    checkedKey = "";
    checkedIndex = -1;
  }

  return [checkedKey, checkedIndex];
}

function loopAndFindLayers() {
  var mainComp = app.project.activeItem;
  var moshLayersObj = {
    checkedKey: "",
    checkedMVIndex: -1,
    checkedSwapIndex: -1,
    checkedRemoveIndex: -1,
    activeItemComp: false,
  };

  // Loop through layers
  for (var i = 1; i <= mainComp.numLayers; i++) {
    var name = mainComp.layer(i).name;
    if (name.length > 6 && name.slice(0, 5) == "Mosh-") {
      var layerKey = name.slice(-5);
      var layerType = name.slice(0, -5);
      // Mosh Layer found, identify which and set index
      switch (layerType) {
        case "Mosh-MV-":
          moshLayersObj.checkedMVIndex = i;
          break;
        case "Mosh-Swap-":
          moshLayersObj.checkedSwapIndex = i;
          break;
        case "Mosh-Remove-":
          moshLayersObj.checkedRemoveIndex = i;
          break;
      }
      moshLayersObj.checkedKey = layerKey;
    }
  }

  return moshLayersObj;
}

function getCompName() {
  var name;
  var mainComp = app.project.activeItem;
  if (mainComp instanceof CompItem) {
    name = mainComp.name;
  } else {
    name = "null";
  }
  return name;
}

function makeNewMoshLayer(data) {
  var string = data.string;
  var key = data.layerKey;
  var mainComp = app.project.activeItem;
  var name = string + key;
  var newMoshLayer = mainComp.layers.addSolid([0, 0, 0], name, 50, 50, 1);
  newMoshLayer.adjustmentLayer = true;
  if (string == "Mosh-Swap-") newMoshLayer.label = 13;
  if (string == "Mosh-Remove-") newMoshLayer.label = 13;
  if (string == "Mosh-MV-") newMoshLayer.label = 13;
}

function deleteLayer(data) {
  var index = data.index;
  var mainComp = app.project.activeItem;
  mainComp.layer(index).remove();
}

function getLayerData(data) {
  var key = data[0];
  var index = data[1];

  var mainComp = app.project.activeItem;
  var moshLayer = mainComp.layer(index);
  var markerProperty = moshLayer.property("Marker");
  var layerDataArray = [];

  var totalMarkers = markerProperty.numKeys;
  if (markerProperty.numKeys != 0) {
    for (var i = 1; i <= totalMarkers; i++) {
      var markerParams = markerProperty.keyValue(i).getParameters();
      markerParams = JSON.parse(markerParams.jsonData);
      layerDataArray.push(markerParams);
    }
  } else {
    layerDataArray.push(-1);
  }
  return JSON.stringify({
    layerDataArray: layerDataArray,
  });
}

function checkActiveItem() {
  var isComp = false;
  var mainComp = app.project.activeItem;
  if (mainComp instanceof CompItem) {
    isComp = true;
  }
  return isComp;
}

function openDialog(data) {
  var name = data.name;
  var initPath = data.initPath;
  var returnPath;
  if (initPath) {
    var initFile = new File(initPath);
    var file = initFile.openDlg("Choose " + name + " executable:");
    if (file) {
      returnPath = file.fsName;
    }
  } else {
    var file = File.openDialog("Choose " + name + " executable:");
    if (file) {
      returnPath = file.fsName;
    }
  }
  return JSON.stringify({
    returnPath: returnPath,
  });
}

// ****** MARKER AHNDLER ******

function placeMarker(objData) {
  // alert('made it here')
  const module = objData.module;
  const activeLayerIndex = objData.activeLayerIndex;
  const timeAdj = objData.timeAdj ? objData.timeAdj : 0;

  var mainComp = app.project.activeItem;
  var activeLayer = mainComp.layer(activeLayerIndex);
  var time = app.project.activeItem.time + timeAdj;
  var frameDuration = getFrameDuration();

  // Check if a marker already exists at time
  while (checkIfMarkerExists(time, activeLayerIndex)) {
    if (mainComp.duration >= time + frameDuration) {
      time += frameDuration;
    } else if (0 <= time - frameDuration) {
      time -= frameDuration;
    }
  }

  // Create Marker
  var makeNewMarker = new MarkerValue(module.preset.label);
  makeNewMarker.duration = module.duration;
  makeNewMarker.label = module.colorIndex;
  makeNewMarker.setParameters({
    jsonData: JSON.stringify(module),
  });

  activeLayer.property("Marker").setValueAtTime(time, makeNewMarker);

  return "Success place marker";
}

function getFrameDuration() {
  var mainComp = app.project.activeItem;
  return mainComp.frameDuration;
}

function checkIfMarkerExists(time, activeLayerIndex) {
  var mainComp = app.project.activeItem;
  var activeLayer = mainComp.layer(activeLayerIndex);
  var markerProperty = activeLayer.property("Marker");
  var totalMarkers = markerProperty.numKeys;

  var markerExistsAtTime = false;

  for (var i = 1; i <= totalMarkers; i++) {
    var markerTime = markerProperty.keyTime(i);
    if (markerTime > time) break;
    if (markerTime == time) {
      markerExistsAtTime = true;
      break;
    }
  }
  return markerExistsAtTime;
}

function deleteMarker(objData) {
  var deletedKey = objData.deletedName;
  var activeLayerIndex = objData.activeLayerIndex;
  var mainComp = app.project.activeItem;
  var activeLayer = mainComp.layer(activeLayerIndex);

  var markerProperty = activeLayer.property("Marker");

  var totalMarkers = markerProperty.numKeys;
  var foundMarkerIndex;
  for (var i = 1; i <= totalMarkers; i++) {
    var markerParamsJson = markerProperty.keyValue(i).getParameters();
    var markerParams = JSON.parse(markerParamsJson.jsonData);
    if (markerParams.key == deletedKey) {
      foundMarkerIndex = i;
      break;
    }
  }
  markerProperty.removeKey(foundMarkerIndex);
  return "Deleted Marker";
}

function updateMarker(objData) {
  const modules = objData.modules;
  const activeLayerIndex = objData.activeLayerIndex;

  var mainComp = app.project.activeItem;
  var activeLayer = mainComp.layer(activeLayerIndex);
  var markerProperty = activeLayer.property("Marker");

  var totalMarkers = markerProperty.numKeys;
  // Loop through all markers
  for (var i = 1; i <= totalMarkers; i++) {
    var markerParamsJson = markerProperty.keyValue(i).getParameters();
    var markerParams = JSON.parse(markerParamsJson.jsonData);
    var updateMarker = activeLayer.property("Marker").keyValue(i);
    // Loop through modules to see if they fit the marker
    for (var j = 0; j < modules.length; j++) {
      if (markerParams.key == modules[j].key) {
        updateMarker.setParameters({
          jsonData: JSON.stringify(modules[j]),
        });
        updateMarker.comment = modules[j].preset.label;
        activeLayer.property("Marker").setValueAtKey(i, updateMarker);
        break;
      }
    }
  }

  return "success";
}

function getIndexFromKey(key, activeLayerIndex) {
  var mainComp = app.project.activeItem;
  var activeLayer = mainComp.layer(activeLayerIndex);
  var markerProperty = activeLayer.property("Marker");
  var foundMarkerIndex;
  var totalMarkers = markerProperty.numKeys;

  for (var i = 1; i <= totalMarkers; i++) {
    var markerParamsJson = markerProperty.keyValue(i).getParameters();
    var markerParams = JSON.parse(markerParamsJson.jsonData);
    if (markerParams.key == key) {
      foundMarkerIndex = i;
      break;
    }
  }
  return foundMarkerIndex;
}

function getMarkerTime(data) {
  const key = data.key;
  const activeLayerIndex = data.activeLayerIndex;
  var markerIndex = getIndexFromKey(key, activeLayerIndex);

  var mainComp = app.project.activeItem;
  var activeLayer = mainComp.layer(activeLayerIndex);
  var markerProperty = activeLayer.property("Marker");

  var markerIn = markerProperty.keyTime(markerIndex);
  var markerOut = markerProperty.keyValue(markerIndex).duration + markerIn;
  return JSON.stringify([markerIn, markerOut]); //{markerIn : markerIn, markerOut: markerOut}
}

function getRFMarkerTime(data) {
  const activeLayerIndex = data.activeLayerIndex;
  var mainComp = app.project.activeItem;
  var activeLayer = mainComp.layer(activeLayerIndex);
  var markerProperty = activeLayer.property("Marker");

  var timesArray = [];

  for (var i = 1; i <= markerProperty.numKeys; i++) {
    var markerIn = markerProperty.keyTime(i);
    timesArray.push(markerIn);
  }
  return JSON.stringify(timesArray); //{markerIn : markerIn, markerOut: markerOut}
}

function getSwapMarkersTimes(data) {
  const activeLayerIndex = data.activeLayerIndex;
  const key = data.key;
  var mainComp = app.project.activeItem;
  var activeLayer = mainComp.layer(activeLayerIndex);
  var markerProperty = activeLayer.property("Marker");
  var markersTimes = {
    rIn: 0,
    rOut: 0,
    dIn: 0,
    dOut: 0,
  };

  var totalMarkers = markerProperty.numKeys;
  for (var i = 1; i <= totalMarkers; i++) {
    var markerParamsJson = markerProperty.keyValue(i).getParameters();
    var markerParams = JSON.parse(markerParamsJson.jsonData);
    if (markerParams.preset.label == "Donor") {
      var markerIn = markerProperty.keyTime(i);
      var markerOut = markerProperty.keyValue(i).duration + markerIn;
      markersTimes.dIn = markerIn;
      markersTimes.dOut = markerOut;
    } else if (markerParams.preset.label == "Receiver") {
      var markerIn = markerProperty.keyTime(i);
      var markerOut = markerProperty.keyValue(i).duration + markerIn;
      markersTimes.rIn = markerIn;
      markersTimes.rOut = markerOut;
    }
  }

  return JSON.stringify(markersTimes);
}

// ****** MOSH HANDLER ******

function addToRenderer(cepCall) {
  var mainComp = app.project.activeItem;
  var renderQueue = app.project.renderQueue;
  var rq_item = renderQueue.items.add(mainComp);
  rq_item.render = true;

  // Return string if CEP call
  if (cepCall) return "success";
  else return rq_item;
}

function addToRenderGetTemplates() {
  var mainComp = app.project.activeItem;
  var renderQueue = app.project.renderQueue;
  var validTemplates = [];

  // Add to render Queue
  var rq_item = addToRenderer(false);
  // get templates
  var outputModule = rq_item.outputModule(1);
  validTemplates = getValidTemplates(rq_item);
  return JSON.stringify({
    validTemplates: validTemplates,
  });
}

function setTemplateAndTrigger(data) {
  var mainComp = app.project.activeItem;
  var renderQueue = app.project.renderQueue;

  var template = data.template.value;
  var fileLocation = data.location;

  var rqLength = renderQueue.items.length;
  // alert(rqLength);
  var rq_item = renderQueue.items[rqLength];
  var outputModule = rq_item.outputModule(1);

  outputModule.file = File(fileLocation);
  outputModule.applyTemplate(template);

  renderQueue.render();

  return "Success";
}

function checkIfTemplateExists(template, outputTemplates) {
  var exists = false;
  for (var i = 0; i < outputTemplates.length; i++) {
    if (outputTemplates[i] == template) {
      exists = true;
      break;
    }
  }
  return exists;
}

function getValidTemplates(rq_item) {
  const VALID_FORMATS = ["AVI", "QuickTime"];
  var validTemplates = [];
  var templates = rq_item.outputModule(1).templates;
  for (var i = 0; i < templates.length; i++) {
    rq_item.outputModule(1).applyTemplate(templates[i]);
    var isValidFormat = false;
    var extension =
      rq_item.outputModule(1).getSettings().Format.toLowerCase() == "avi"
        ? ".avi"
        : ".mov";
    for (var j = 0; j < VALID_FORMATS.length; j++) {
      if (
        VALID_FORMATS[j].toLowerCase() ===
        rq_item.outputModule(1).getSettings().Format.toLowerCase()
      ) {
        isValidFormat = true;
        break;
      }
    }
    if (isValidFormat) {
      validTemplates.push({
        template: templates[i],
        ext: extension,
      });
    }
  }
  return validTemplates;
}

function getProjectPath() {
  app.project.save();
  var projectPath;
  if (app.project.file !== null) {
    projectPath = app.project.file.fsName;
  } else {
    alert("Please save your project file first.");
  }
  return JSON.stringify(projectPath);
}

function openInViewer() {
  var mainComp = app.project.activeItem;
  mainComp.openInViewer();
  var text = "success";
  return text;
}

function importBakedFile(obj) {
  var file = obj.file;
  var time = obj.time;
  var mainComp = app.project.activeItem;
  var bakedFile = app.project.importFile(new ImportOptions(file));
  // Add to comp
  mainComp.layers.add(bakedFile);
  mainComp.layer(1).startTime = time;
  // Set parent folder
  const folderName = "Datamosh2";
  const folder = getFolderByName(folderName);
  bakedFile.parentFolder = folder;
  return "Success importing baked Mosh";
}

function getCompFramerate() {
  var mainComp = app.project.activeItem;
  return 1 / mainComp.frameDuration;
}

function getCompData() {
  var mainComp = app.project.activeItem;
  var data = {
    size: [],
    frameRate: 30,
    workAreaIn: 0,
    duration: 1,
    workAreaOut: 1,
  };
  data.size = [mainComp.width, mainComp.height];
  data.frameRate = 1 / mainComp.frameDuration;
  data.workAreaIn = mainComp.workAreaStart;
  data.duration = mainComp.workAreaDuration;
  data.workAreaOut = mainComp.workAreaStart + mainComp.workAreaDuration;
  return JSON.stringify(data);
}

function setWorkArea(data) {
  var timeIn = data.timeIn;
  var timeOut = data.timeOut;

  var mainComp = app.project.activeItem;
  mainComp.workAreaStart = timeIn;
  mainComp.workAreaDuration = timeOut - timeIn;

  return "success";
}

function getFolderByName(folderName) {
  var myProject = app.project;
  for (var i = 1; i <= myProject.numItems; i++) {
    if (
      myProject.item(i) instanceof FolderItem &&
      myProject.item(i).name == folderName
    ) {
      return myProject.item(i);
    }
  }
  myFolder = myProject.items.addFolder(folderName);
  return myFolder;
}

// ****** SETTINGS ******
const sectionName = "Datamosh2";

function saveSettings(data) {
  var settingName = data.settingName;
  // var value = data.value;
  var value = JSON.stringify(data.value);
  app.settings.saveSetting(sectionName, settingName, value);
  app.preferences.saveToDisk();
  return "Success";
}

function getSettings(data) {
  var settingName = data.settingName;
  var setting = app.settings.getSetting(sectionName, settingName);
  return setting;
}

function haveSettings(data) {
  var settingName = data.settingName;
  var exists = app.settings.haveSetting(sectionName, settingName);
  return JSON.stringify({
    exists: exists,
  });
}
