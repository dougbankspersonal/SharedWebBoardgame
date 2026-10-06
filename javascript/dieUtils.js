define([
  "dojo/dom-style",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "dojo/domReady!",
], function (domStyle, debugLogModule, genericMeasurements, htmlUtils) {
  var debugLog = debugLogModule.debugLog;

  const DieType_D6 = "d6";
  const DieType_D8 = "d8";

  const DieTypes = {
    d6: DieType_D6,
    d8: DieType_D8,
  };

  function addDieFace(parent, faceConfigs, index) {
    var faceConfig = faceConfigs[index];
    var faceNode = htmlUtils.addDiv(
      parent,
      ["face"].concat(faceConfig.classes),
      "dieFace-" + index.toString(),
    );

    if (faceConfig.callback) {
      faceConfig.callback(faceNode, faceConfig, index);
    } else {
      htmlUtils.applyBasicConfig(faceNode, faceConfig);
    }

    return faceNode;
  }

  // dieConfig should have:
  // classes: add these classes to the die container.
  // faces: array of face configs, each with:
  //   classes: add these classes to the face container.
  //   callback (optional): if present, hit callback.  Pass in face widget to fill in, face index, and face config.
  //   imageClasses: add image with these classes.
  //   text, textClasses: add text with these classes.
  function addDieNode(parent, dieConfig) {
    var dieNode = htmlUtils.addDiv(
      parent,
      ["die"].concat(dieConfig.classes),
      "die",
    );

    debugLog("addDieNode", "dieConfig = " + JSON.stringify(dieConfig));

    for (var i = 0; i < dieConfig.faces.length; i++) {
      addDieFace(dieNode, dieConfig.faces, i);
    }
    return dieNode;
  }

  function addDiceNode(parent, diceConfigs, opt_classes) {
    var classes = opt_classes ? opt_classes : [];
    classes = classes.concat(["dice"]);
    var diceNode = htmlUtils.addDiv(parent, classes, "dice");

    debugLog("addDiceNode", "diceConfigs = " + JSON.stringify(diceConfigs));

    for (var i = 0; i < diceConfigs.length; i++) {
      addDieNode(diceNode, diceConfigs[i]);
    }
    return diceNode;
  }

  return {
    DieTypes: DieTypes,

    // New.
    addDieNode: addDieNode,
    addDiceNode: addDiceNode,

    // Obsolete: do not use.
    createDieTemplate: OBSOLETE_createDieTemplate,
    addDieFace: OBSOLETE_addDieFace,
  };
});
