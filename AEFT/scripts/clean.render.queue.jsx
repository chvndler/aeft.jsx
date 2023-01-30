/**
 * @title Clean Render Queue
 * @version 1.0
 * @author Chandler Chappell <@chvndler>
 *
 * @description Clean out the Render Queue.
 *
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.

 */

(function () {
  var renderQueue = app.project.renderQueue;
  while (renderQueue.numItems > 0) {
    renderQueue.item(1).remove();
  }
})();
