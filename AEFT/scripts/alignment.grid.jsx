/**
 * @title Alignement Grids
 * @version 1.0.0
 * @author Chandler Chappell <@chvndler>
 *
 * @description Creates a new composition with an adjustment layer that has a grid effect applied.
 *
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 */
(function () {
  // Create a new composition
  var comp = app.project.items.addComp("Alignment Grids", 1920, 1080, 1, 10, 30);

  // Create a new adjustment layer
  var adjustmentLayer = comp.layers.addSolid(
    [0, 0, 0],
    "Adjustment Layer",
    comp.width,
    comp.height,
    comp.pixelAspect,
    comp.duration
  );
  adjustmentLayer.adjustmentLayer = true;

  // Add the grid effect to the adjustment layer
  var gridEffect = adjustmentLayer.Effects.addProperty("Grid");
  gridEffect.property("Grid Size").setValue([100, 100]);

  // Set the grid color to white
  gridEffect.property("Color").setValue([1, 1, 1]);

  // Set the opacity of the grids
  gridEffect.property("Opacity").setValue(50);

  // Set the blending mode of the adjustment layer to "Multiply"
  adjustmentLayer.blendingMode = BlendingMode.MULTIPLY;
})();
