(function () {
  let zoom = 0.5;
  const keyboardState = ScriptUI.environment.keyboardState;
  if (keyboardState.ctrlKey) {
    zoom = 1;
  } else if (keyboardState.shiftKey) {
    zoom = 0.25;
  }
  try {
    if (app.activeViewer && app.activeViewer.views && app.activeViewer.views.length > 0) {
      app.activeViewer.views[0].options.zoom = zoom;
    } else {
      $.writeln('No active viewer available or views not found.');
    }
  } catch (err) {
    $.writeln('An error occurred: ' + err.message);
  }
})();
