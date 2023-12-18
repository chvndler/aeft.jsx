{
  // Filename → Create_Grids.jsx
  // Menu Name → Create Grids
  // @version 1.0.0
  //
  // @description
  // This script generates a customizable grid overlay within the active composition.
  //
  // It allows the user to define the size, color, and opacity of the grid.
  // The grid is created as an adjustment layer, making it non-destructive
  // to the original composition. This script is useful for aligning elements
  // within the composition and ensuring consistent spacing and structure.
  //
  // Ideal for motion graphics designers and visual effects artists
  // who require precise alignment and visual guides in their compositions.
  //
  //
  // @copyright 2023
  // @license MIT

  function AlignmentGrids(thisObj) {
    var scriptName = 'Alignment Grids';

    // Variables for user inputs
    var gridSize = [100, 100];
    var gridColor = [1, 1, 1]; // White color
    var gridOpacity = 50;

    function onGridSizeChanged() {
      gridSize = this.text.split(',').map(Number);
    }

    function onGridColorChanged() {
      gridColor = this.text.split(',').map(Number);
    }

    function onGridOpacityChanged() {
      gridOpacity = parseFloat(this.text);
    }

    function createGrids() {
      var activeComp = app.project.activeItem;
      if (!activeComp || !(activeComp instanceof CompItem)) {
        alert('No active composition selected.', scriptName);
        return;
      }

      app.beginUndoGroup(scriptName);

      var adjustmentLayer = activeComp.layers.addSolid(
        [0, 0, 0],
        'Adjustment Layer',
        activeComp.width,
        activeComp.height,
        activeComp.pixelAspect,
        activeComp.duration,
      );
      adjustmentLayer.adjustmentLayer = true;

      var gridEffect = adjustmentLayer.property('Effects').addProperty('Grid');
      gridEffect.property('Grid Size').setValue(gridSize);
      gridEffect.property('Color').setValue(gridColor);
      gridEffect.property('Opacity').setValue(gridOpacity);

      adjustmentLayer.blendingMode = BlendingMode.MULTIPLY;

      app.endUndoGroup();
    }

    function BuildAndShowUI(thisObj) {
      var my_palette =
        thisObj instanceof Panel
          ? thisObj
          : new Window('palette', scriptName, undefined, { resizeable: true });
      if (my_palette != null) {
        var res =
          "group { \
                    orientation: 'column', alignment: ['fill', 'top'], \
                    gridSizeGroup: Group { \
                        orientation: 'row', \
                        staticText: StaticText { text: 'Grid Size:' }, \
                        editText: EditText { text: '100,100', characters: 10 } \
                    }, \
                    gridColorGroup: Group { \
                        orientation: 'row', \
                        staticText: StaticText { text: 'Grid Color:' }, \
                        editText: EditText { text: '1,1,1', characters: 10 } \
                    }, \
                    gridOpacityGroup: Group { \
                        orientation: 'row', \
                        staticText: StaticText { text: 'Grid Opacity:' }, \
                        editText: EditText { text: '50', characters: 10 } \
                    }, \
                    createButton: Button { text: 'Create Grids', alignment: ['center', 'center'] } \
                }";

        my_palette.grp = my_palette.add(res);

        my_palette.grp.gridSizeGroup.editText.onChange = onGridSizeChanged;
        my_palette.grp.gridColorGroup.editText.onChange = onGridColorChanged;
        my_palette.grp.gridOpacityGroup.editText.onChange = onGridOpacityChanged;
        my_palette.grp.createButton.onClick = createGrids;
      }

      return my_palette;
    }

    var my_palette = BuildAndShowUI(thisObj);
    if (my_palette != null) {
      if (my_palette instanceof Window) {
        my_palette.center();
        my_palette.show();
      } else {
        my_palette.layout.layout(true);
      }
    } else {
      alert('Could not open the user interface.', scriptName);
    }
  }

  AlignmentGrids(this);
}
