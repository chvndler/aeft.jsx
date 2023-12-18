(function () {
  var renderQueue = app.project.renderQueue;
  while (renderQueue.numItems > 0) {
    renderQueue.item(1).remove();
  }
})();
