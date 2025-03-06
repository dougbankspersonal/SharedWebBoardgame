define([
  "dojo/dom",
  "dojo/dom-style",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "dojo/domReady!",
], function (dom, domStyle, genericMeasurements, htmlUtils) {
  function addDieFace(parent, opt_styleDescs) {
    var dieFace = htmlUtils.addDiv(parent, ["dieFace"], "dieFace");
    domStyle.set(dieFace, {
      height: genericMeasurements.dieHeight + "px",
      width: genericMeasurements.dieWidth + "px",
    });

    if (opt_styleDescs) {
      for (var styleDesc of opt_styleDescs) {
        var image = htmlUtils.addImage(
          dieFace,
          ["dieImage"],
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
    for (var i = 0; i < 3; i++) {
      addDieFace(pageOfItems);
    }
    for (var i = 0; i < 6; i++) {
      addNthFaceCallback(pageOfItems, i);
    }
  }
  return {
    createDieTemplate: createDieTemplate,
    addDieFace: addDieFace,
  };
});
