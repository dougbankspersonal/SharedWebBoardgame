define(["sharedJavascript/dieUtils", "dojo/domReady!"], function (dieUtils) {
  var huntImage = "../images/Dice/hunt.png";
  var scamperImage = "../images/Dice/scamper.png";
  var stopImage = "../images/Dice/stop.png";
  var rollImage = "../images/Dice/roll.png";

  var scale = 0.9;

  function addStopFace(parent) {
    return dieUtils.addDieFace(parent, [
      {
        img: stopImage,
        "max-width": `100%`,
      },
    ]);
  }

  function addScamperFace(parent) {
    return dieUtils.addDieFace(parent, [
      {
        img: scamperImage,
        transform: `scale(${scale})`,
        "max-width": `${scale * 100}%`,
      },
    ]);
  }

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
