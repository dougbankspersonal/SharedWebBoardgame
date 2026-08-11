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

  //--------------------------------------------
  //
  // BEGIN: Obsolete.
  //
  //--------------------------------------------

  function OBSOLETE_addDieFace(parent, options) {
    var options = options ? options : {};
    var text = options.text;
    var classes = ["die_face"];
    if (options.classes) {
      classes = classes.concat(options.classes);
    }
    var dieFace = htmlUtils.addDiv(parent, classes, "dieFace", text);
    domStyle.set(dieFace, {
      height: genericMeasurements.dieHeightPx + "px",
      width: genericMeasurements.dieWidthPx + "px",
    });

    var imagesWithStyling = options.imagesWithStyling
      ? options.imagesWithStyling
      : [];
    for (var imageWithStyling of imagesWithStyling) {
      var image = htmlUtils.addImage(
        dieFace,
        ["die_image"],
        "dieImage",
        imageWithStyling.img,
      );
      domStyle.set(image, imageWithStyling.styling);
    }
    return dieFace;
  }

  var wrapperIdCount = 0;
  function OBSOLETE_createDieTemplate(
    parent,
    wrapperClasses,
    dieType,
    addNthFaceCallback,
  ) {
    var wrapperId = "dieWrapper" + wrapperIdCount;
    wrapperIdCount++;
    wrapperClasses.push(dieType);
    wrapperClasses.push("die_wrapper");
    var wrapper = htmlUtils.addDiv(parent, wrapperClasses, wrapperId);

    if (dieType == DieType_D6) {
      // Three rows of 3 each, first ignored.
      for (var i = 0; i < 3; i++) {
        OBSOLETE_addDieFace(wrapper);
      }
      for (var i = 0; i < 6; i++) {
        addNthFaceCallback(wrapper, i);
      }
    }
    if (dieType == DieType_D8) {
      // Four rows of 4 each.
      for (var i = 0; i < 8; i++) {
        addNthFaceCallback(wrapper, i);
      }
    }

    return wrapper;
  }
  //--------------------------------------------
  //
  // END: Obsolete.
  //
  //--------------------------------------------

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
      if (faceConfig.imageClasses) {
        var imageNode = htmlUtils.addImage(
          faceNode,
          ["image"].concat(faceConfig.imageClasses),
          "dieImage-" + index.toString(),
        );
      }
      if (faceConfig.text) {
        var textClasses = ["text"].concat(faceConfig.textClasses || []);
        var textNode = htmlUtils.addDiv(
          faceNode,
          textClasses,
          "die-text-" + index.toString(),
          faceConfig.text,
        );
      }
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

  function addDiceNode(parent, diceConfigs) {
    var diceNode = htmlUtils.addDiv(parent, ["dice"], "dice");
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
