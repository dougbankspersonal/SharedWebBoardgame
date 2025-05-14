define(["sharedJavascript/dieUtils", "dojo/domReady!"], function (dieUtils) {
  function addDollarFace(parent, count) {
    var dollarString = "";
    for (var i = 0; i < count; i++) {
      dollarString += "$";
    }
    return dieUtils.addDieFace(parent, {
      text: dollarString,
      classes: ["pricing_die"],
    });
  }

  function addNthFace(parent, index) {
    if (index < 3) {
      return addDollarFace(parent, 1);
    }
    if (index < 5) {
      return addDollarFace(parent, 2);
    }
    return addDollarFace(parent, 3);
  }

  return {
    addNthFace: addNthFace,
  };
});
