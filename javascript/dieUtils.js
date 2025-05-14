define([
  "dojo/dom",
  "dojo/dom-style",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/systemConfigs",
  "dojo/domReady!",
], function (
  dom,
  domStyle,
  debugLog,
  genericMeasurements,
  htmlUtils,
  systemConfigs
) {
  function addDieFace(parent, options) {
    var options = options ? options : {};
    var text = options.text;
    var classes = ["die_face"];
    if (options.classes) {
      classes = classes.concat(options.classes);
    }
    var dieFace = htmlUtils.addDiv(parent, classes, "dieFace", text);
    domStyle.set(dieFace, {
      height: genericMeasurements.dieHeight + "px",
      width: genericMeasurements.dieWidth + "px",
    });

    var imagesWithStyling = options.imagesWithStyling
      ? options.imagesWithStyling
      : [];
    for (var imageWithStyling of imagesWithStyling) {
      var image = htmlUtils.addImage(
        dieFace,
        ["die_image"],
        "dieImage",
        imageWithStyling.img
      );
      domStyle.set(image, imageWithStyling.styling);
    }
    return dieFace;
  }

  function createDieTemplate(addNthFaceCallback) {
    var bodyNode = dom.byId("body");

    var pageOfItems = htmlUtils.addPageOfItems(bodyNode);

    domStyle.set(pageOfItems, {
      display: "grid",
      "grid-template-columns": "repeat(3, auto)",
      "grid-auto-rows": "auto",
      gap: "0px",
    });

    for (var i = 0; i < 3; i++) {
      addDieFace(pageOfItems);
    }
    for (var i = 0; i < 6; i++) {
      addNthFaceCallback(pageOfItems, i);
    }

    var sc = systemConfigs.getSystemConfigs();

    if (sc.usePhysicalDieSize) {
      debugLog.debugLog("Dice", "Scaling");
      // Scale the whole thing.
      var scale =
        genericMeasurements.physicalDieWidthPx / genericMeasurements.dieWidth;
      domStyle.set(pageOfItems, {
        transform: "scale(" + scale + ")",
      });
    }
  }

  return {
    createDieTemplate: createDieTemplate,
    addDieFace: addDieFace,
  };
});
