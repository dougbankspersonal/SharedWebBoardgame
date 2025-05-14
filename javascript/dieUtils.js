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
        imageWithStyling.img
      );
      domStyle.set(image, imageWithStyling.styling);
    }
    return dieFace;
  }

  var wrapperIdCount = 0;
  function createDieTemplate(parent, addNthFaceCallback) {
    var wrapperId = "dieWrapper" + wrapperIdCount;
    wrapperIdCount++;
    var wrapper = htmlUtils.addDiv(parent, ["wrapper"], wrapperId);

    for (var i = 0; i < 3; i++) {
      addDieFace(wrapper);
    }
    for (var i = 0; i < 6; i++) {
      addNthFaceCallback(wrapper, i);
    }
    return wrapper;
  }

  return {
    createDieTemplate: createDieTemplate,
    addDieFace: addDieFace,
  };
});
