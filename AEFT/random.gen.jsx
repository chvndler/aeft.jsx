// Random Look Generator
var randomEffect;
var numTimesToRandomise = Math.floor(Math.random() * 5 + 1);
var comp = app.project.activeItem;
var layer = comp.selectedLayers[0];
var typeString;

app.beginUndoGroup("Random Look Generator");
for(var i = 1; i <= numTimesToRandomise; i++) {
    randomEffect = layer.Effects.addProperty(app.effects[Math.floor(Math.random() * app.effects.length)].matchName);
    for(var e = 1; e <= randomEffect.numProperties; e++) {
        if(randomEffect.property(e).propertyValueType) {
        typeString = randomEffect.property(e).propertyValueType;
       if(typeString.toString().indexOf("12") == -1 && typeString.toString().indexOf("19") == -1) {
        if(randomEffect.property(e).value.toString().split(",").length == 1) {
        // 1D
        if(randomEffect.property(e).hasMin && randomEffect.property(e).hasMax) {
        randomEffect.property(e).setValue(Math.random() * (randomEffect.property(e).maxValue - randomEffect.property(e).minValue) + randomEffect.property(e).minValue);
        }

        }

        }
        }
        }
    }

app.endUndoGroup();
