(function wireframeTimelineDriver(thisObj) {
  var SCRIPT_ID = 'wireframeTimelineDriver';

  if (!$.global[SCRIPT_ID]) {
    $.global[SCRIPT_ID] = {
      running: false,
      taskID: null,
      frameStep: 1,
      loop: true,
    };
  }

  var state = $.global[SCRIPT_ID];

  $.global.wireframeTimelineTick = function () {
    var comp = app.project.activeItem;

    if (!state.running || !(comp instanceof CompItem)) {
      state.running = false;
      return;
    }

    var nextTime = comp.time + comp.frameDuration * state.frameStep;
    var endTime = comp.workAreaStart + comp.workAreaDuration;

    if (nextTime >= endTime) {
      if (state.loop) {
        nextTime = comp.workAreaStart;
      } else {
        comp.time = endTime - comp.frameDuration;
        state.running = false;
        return;
      }
    }

    comp.time = nextTime;
    app.refresh();

    if (state.running) {
      var delay = Math.max(1, Math.round(comp.frameDuration * 1000 * state.frameStep));

      state.taskID = app.scheduleTask('wireframeTimelineTick()', delay, false);
    }
  };

  function startPlayback() {
    var comp = app.project.activeItem;

    if (!(comp instanceof CompItem)) {
      alert('Open or select a composition first.');
      return;
    }

    if (state.running) {
      return;
    }

    state.frameStep = parseInt(frameStepInput.text, 10) || 1;
    state.frameStep = Math.max(1, state.frameStep);
    state.loop = loopCheckbox.value;
    state.running = true;

    $.global.wireframeTimelineTick();
  }

  function stopPlayback() {
    state.running = false;

    if (state.taskID !== null) {
      app.cancelTask(state.taskID);
      state.taskID = null;
    }
  }

  function resetPlayback() {
    stopPlayback();

    var comp = app.project.activeItem;

    if (comp instanceof CompItem) {
      comp.time = comp.workAreaStart;
      app.refresh();
    }
  }

  var panel =
    thisObj instanceof Panel ? thisObj : new Window('palette', 'Wireframe Player', undefined, { resizeable: true });

  panel.orientation = 'column';
  panel.alignChildren = ['fill', 'top'];
  panel.spacing = 8;
  panel.margins = 12;

  var settingsGroup = panel.add('group');
  settingsGroup.add('statictext', undefined, 'Frame step:');

  var frameStepInput = settingsGroup.add('edittext', undefined, '1');
  frameStepInput.characters = 4;

  var loopCheckbox = settingsGroup.add('checkbox', undefined, 'Loop work area');
  loopCheckbox.value = true;

  var controls = panel.add('group');

  var playButton = controls.add('button', undefined, 'Play');
  var stopButton = controls.add('button', undefined, 'Stop');
  var resetButton = controls.add('button', undefined, 'Reset');

  playButton.onClick = startPlayback;
  stopButton.onClick = stopPlayback;
  resetButton.onClick = resetPlayback;

  panel.onClose = stopPlayback;

  panel.layout.layout(true);
  panel.layout.resize();

  panel.onResizing = panel.onResize = function () {
    this.layout.resize();
  };

  if (panel instanceof Window) {
    panel.center();
    panel.show();
  }
})(this);
