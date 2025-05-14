define(["sharedJavascript/dieUtils", "dojo/domReady!"], function (dieUtils) {
  var huntImage = "../images/Dice/hunt.png";
  var scamperImage = "../images/Dice/scamper.png";
  var stopImage = "../images/Dice/stop.png";
  var rollImage = "../images/Dice/roll.png";

  var genericImageScale = 0.9;
  var dieScale = 0.7;

  function addStopFace(parent) {
    return dieUtils.addDieFace(parent, {
      imagesWithStyling = [
        {
          img: stopImage,
          styling: {
            "max-width": `100%`,
          }
        },
    ]);
  }

  function addScamperFace(parent) {
    return dieUtils.addDieFace(parent, {
      imagesWithStyling = [
        {
          img: scamperImage,
          styling: {
            transform: `scale(${genericImageScale})`,
            "max-width": `${genericImageScale * 100}%`,
          },
        },
      ],
    });
  }

  function addHuntFace(parent) {
    return dieUtils.addDieFace(parent, {
      imagesWithStyling = [
        {
          img: huntImage,
          styling: {
            transform: `scale(${genericImageScale})`,
            "max-width": `${genericImageScale * 100}%`,
          },
        }
      ],
    });
  }

  function addHuntAndRollFace(parent) {
    var imageOffset = 15;
    return dieUtils.addDieFace(parent, {
      imagesWithStyling = [
        {
          img: rollImage,
          styling: {
            transform: `scale(${dieScale}) translateY(${-imageOffset}%)`,
            "max-width": `${dieScale * 100,}%`,
            "z-index": 1,
            position: "absolute",
          }
        },
        {
          img: huntImage,
          styling: {
              transform: `scale(${genericImageScale}) translateY(${imageOffset}%)`,
            "max-width": `${genericImageScale * 100}%`,
            "z-index": 2,
            position: "absolute",
          },
        },
      ],
    },
  }

  function addNthFace(parent, index) {
    if (index < 3) {
      return addStopFace(parent);
    }
    if (index < 4) {
      return addScamperFace(parent);
    }
    if (index < 5) {
      return addHuntFace(parent);
    }
    return addHuntAndRollFace(parent);
  }

  return {
    addNthFace: addNthFace,
  };
});
