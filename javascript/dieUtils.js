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
  function addDieFace(parent, opt_styleDescs) {
    var dieFace = htmlUtils.addDiv(parent, ["die_face"], "dieFace");
    domStyle.set(dieFace, {
      height: genericMeasurements.dieHeight + "px",
      width: genericMeasurements.dieWidth + "px",
    });

    if (opt_styleDescs) {
      for (var styleDesc of opt_styleDescs) {
        var image = htmlUtils.addImage(
          dieFace,
          ["die_image"],
          "dieImage",
          styleDesc.img
        );
        domStyle.set(image, styleDesc);
      }
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
      margin: "10px",
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
        "transform-origin": "top left",
      });
    }
  }

  return {
    createDieTemplate: createDieTemplate,
    addDieFace: addDieFace,
  };
});
