(function wireframePlayer(thisObj) {
  var PLAYER_KEY = '__wireframePlayer__';

  // Stop an older instance before rebuilding the panel.
  if ($.global[PLAYER_KEY] && $.global[PLAYER_KEY].taskID !== null) {
    try {
      app.cancelTask($.global[PLAYER_KEY].taskID);
    } catch (error) {}
  }

  var player = {
    running: false,
    taskID: null,
    frameStep: 1,
    loop: true,
    delay: 33,
  };

  $.global[PLAYER_KEY] = player;

  player.getActiveComp = function () {
    var item = app.project.activeItem;

    if (item && item instanceof CompItem) {
      return item;
    }

    return null;
  };

  player.tick = function () {
    if (!player.running) {
      player.taskID = null;
      return;
    }

    var comp = player.getActiveComp();

    if (!comp) {
      player.stop();
      return;
    }

    var frameDuration = comp.frameDuration;
    var workStart = comp.workAreaStart;
    var workEnd = workStart + comp.workAreaDuration;
    var nextTime = comp.time + frameDuration * player.frameStep;

    // Allow for floating-point timing differences.
    if (nextTime >= workEnd - frameDuration * 0.25) {
      if (player.loop) {
        nextTime = workStart;
      } else {
        comp.time = Math.max(workStart, workEnd - frameDuration);

        app.refresh();
        player.stop();
        return;
      }
    }

    comp.time = nextTime;
    app.refresh();

    if (player.running) {
      player.taskID = app.scheduleTask('$.global["' + PLAYER_KEY + '"].tick()', player.delay, false);
    }
  };

  player.start = function () {
    var comp = player.getActiveComp();

    if (!comp || player.running) {
      return;
    }

    player.delay = Math.max(15, Math.round(comp.frameDuration * player.frameStep * 1000));

    player.running = true;
    player.tick();
  };

  player.stop = function () {
    player.running = false;

    if (player.taskID !== null) {
      try {
        app.cancelTask(player.taskID);
      } catch (error) {}

      player.taskID = null;
    }
  };

  player.reset = function () {
    player.stop();

    var comp = player.getActiveComp();

    if (comp) {
      comp.time = comp.workAreaStart;
      app.refresh();
    }
  };

  var panel =
    thisObj instanceof Panel
      ? thisObj
      : new Window('palette', 'Wireframe Player', undefined, {
          resizeable: true,
        });

  panel.orientation = 'column';
  panel.alignChildren = ['fill', 'top'];
  panel.spacing = 8;
  panel.margins = 12;

  var settingsGroup = panel.add('group');
  settingsGroup.orientation = 'row';
  settingsGroup.alignChildren = ['left', 'center'];

  settingsGroup.add('statictext', undefined, 'Frame step:');

  var frameStepInput = settingsGroup.add('edittext', undefined, '1');

  frameStepInput.characters = 4;

  var loopCheckbox = panel.add('checkbox', undefined, 'Loop work area');

  loopCheckbox.value = true;

  var controls = panel.add('group');
  controls.orientation = 'row';
  controls.alignChildren = ['fill', 'center'];

  var playButton = controls.add('button', undefined, 'Play');

  var stopButton = controls.add('button', undefined, 'Stop');

  var resetButton = controls.add('button', undefined, 'Reset');

  playButton.onClick = function () {
    var comp = player.getActiveComp();

    if (!comp) {
      alert('Open or select a composition first.');
      return;
    }

    var frameStep = parseInt(frameStepInput.text, 10);

    if (isNaN(frameStep) || frameStep < 1) {
      frameStep = 1;
      frameStepInput.text = '1';
    }

    player.frameStep = frameStep;
    player.loop = loopCheckbox.value;
    player.start();
  };

  stopButton.onClick = function () {
    player.stop();
  };

  resetButton.onClick = function () {
    player.reset();
  };

  panel.onClose = function () {
    player.stop();
  };

  panel.onResizing = panel.onResize = function () {
    this.layout.resize();
  };

  panel.layout.layout(true);
  panel.layout.resize();

  if (panel instanceof Window) {
    panel.center();
    panel.show();
  }
})(this);
