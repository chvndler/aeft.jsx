(function () {
  var zoom = 0.5;
  if (ScriptUI.environment.keyboardState.altKey === true) {
    zoom = 1;
  }
  if (ScriptUI.environment.keyboardState.shiftKey === true) {
    zoom = 0.25;
  }
  app.activeViewer.views[0].options.zoom = zoom;
})();
