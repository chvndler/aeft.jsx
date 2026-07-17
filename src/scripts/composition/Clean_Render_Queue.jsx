/**
 * Clear Entire Render Queue (with confirmation)
 * --------------------------------------------
 * Safely removes all items from the After Effects Render Queue.
 * Includes:
 * - User confirmation before destructive action
 * - Undo support
 * - Reverse-order removal for efficiency
 * - Scoped execution (no globals)
 */

(function clearRenderQueue() {
  var rq = app.project.renderQueue;

  // Exit early if there is no project or the render queue is empty
  if (!rq || rq.numItems === 0) {
    alert('Render Queue is already empty.');
    return;
  }

  // Confirm destructive action
  var shouldClear = confirm('This will permanently remove ALL items from the Render Queue.\n\nContinue?');
  if (!shouldClear) return;

  // Group actions into a single undo step
  app.beginUndoGroup('Clear Render Queue');

  // Remove items from the end to avoid reindexing issues
  for (var i = rq.numItems; i >= 1; i--) {
    rq.item(i).remove();
  }

  app.endUndoGroup();
})();

// (function () {
//  var renderQueue = app.project.renderQueue;
//  while (renderQueue.numItems > 0) {
//    renderQueue.item(1).remove();
//  }
//})();
