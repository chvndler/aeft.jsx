/**
 * @title Center Composition
 * @version 1.0.0
 * @author Chandler Chappell <@chvndler>
 *
 * @description Center the composition in the Composition Panel. Hold the ALT key or SHIFT key for
 * other zoom levels.
 *
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 */

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
