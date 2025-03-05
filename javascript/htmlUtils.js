// Utilities for Html manipulation using dojo.
define([
  "sharedJavascript/debugLog",
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/query",
  "dojo/domReady!",
], function (debugLog, dom, domConstruct, domStyle, query) {
  function addDiv(parent, classArray, id, opt_innerHTML = "") {
    console.assert(parent, "parent is null");
    var classes = classArray.join(" ");
    var node = domConstruct.create(
      "div",
      {
        innerHTML: opt_innerHTML,
        className: classes,
        id: id,
      },
      parent
    );
    return node;
  }

  function addImage(parent, classArray, id, opt_image) {
    console.assert(classArray != null, "classArray is null");
    console.assert(parent, "parent is null");
    if (!opt_image) {
      classArray.unshift("pseudo_image");
    }
    var classes = classArray.join(" ");
    var props = {
      innerHTML: "",
      className: classes,
      id: id,
    };
    var node;
    if (opt_image) {
      props.src = opt_image;
      node = domConstruct.create("img", props, parent);
    } else {
      node = domConstruct.create("div", props, parent);
    }
    return node;
  }

  function addStandardBorder(node) {
    domStyle.set(node, {
      border: standardBorderWidth + "px solid black",
    });
  }

  // Function to convert hexadecimal color to RGB
  function hexToRgb(hex) {
    var r = parseInt(hex.substring(1, 3), 16);
    var g = parseInt(hex.substring(3, 5), 16);
    var b = parseInt(hex.substring(5, 7), 16);
    return [r, g, b];
  }

  // Function to convert RGB color to hexadecimal
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function blendHexColors(color1, color2) {
    // Parse hexadecimal color strings into arrays of RGB values
    var rgb1 = hexToRgb(color1);
    var rgb2 = hexToRgb(color2);

    // Calculate the blended RGB values
    var blendedRgb = [
      Math.round((rgb1[0] + rgb2[0]) / 2),
      Math.round((rgb1[1] + rgb2[1]) / 2),
      Math.round((rgb1[2] + rgb2[2]) / 2),
    ];

    // Convert blended RGB values to hexadecimal format
    var blendedHex = rgbToHex(blendedRgb[0], blendedRgb[1], blendedRgb[2]);

    return blendedHex;
  }

  function getPageWidth() {
    var sc = systemConfigs.getSystemConfigs();
    if (sc.demoBoard || sc.ttsCards || sc.ttsDie) {
      return null;
    }
    if (sc.landscape) {
      return printedPageLandscapeWidth;
    }

    return printedPagePortraitWidth;
  }

  var getPageHeight = function () {
    var sc = systemConfigs.getSystemConfigs();
    if (sc.demoBoard || sc.ttsCards || sc.ttsDie) {
      return null;
    }
    if (sc.landscape) {
      return genericMeasurements.printedPageLandscapeHeight;
    }

    return genericMeasurements.printedPagePortraitHeight;
  };

  function addPageOfItems(parent, opt_classArray) {
    var sc = systemConfigs.getSystemConfigs();
    console.assert(parent, "parent is null");
    var classArray = extendOptClassArray(opt_classArray, "page_of_items");
    var pageId = "pageOfItems_".concat(pageNumber.toString());
    pageNumber++;

    var pageOfItems = addDiv(parent, classArray, pageId);
    var width = getPageWidth();
    var height = getPageHeight();
    if (width !== null) {
      domStyle.set(pageOfItems, {
        width: width + "px",
      });
    }
    if (height !== null) {
      domStyle.set(pageOfItems, {
        height: height + "px",
      });
    }

    if (!sc.ttsCards && !sc.ttsDie && !sc.demoBoard) {
      domStyle.set(pageOfItems, {
        padding: genericMeasurements.pageOfItemsPaddingPx + "px",
      });
    }

    var childClassArray = ["page_of_items_contents"];
    if (sc.ttsCards) {
      childClassArray.push("tts_cards");
    } else if (sc.ttsDie) {
      childClassArray.push("tts_die");
    } else if (sc.demoBoard) {
      childClassArray.push("demo_board");
    } else {
      childClassArray.push("non_tts");
    }

    var pageOfItemsContents = addDiv(
      pageOfItems,
      childClassArray,
      "pageOfItemsContents"
    );

    return pageOfItemsContents;
  }

  function addCard(parent, opt_classArray, opt_id) {
    console.assert(parent, "parent is null");
    var classArray = genericUtils.extendWithStringOrArrayOfStrings(
      "card",
      opt_classArray
    );
    if (systemConfigs.demoBoard) {
      classArray.push("demoBoard");
    }
    var cardId;
    if (opt_id) {
      cardId = opt_id;
    } else {
      cardId = "card.".concat(cardNumber.toString());
      cardNumber++;
    }
    var node = addDiv(parent, classArray, cardId);
    if (systemConfigs.ttsCards) {
      domStyle.set(node, {
        "margin-bottom": "0px",
        "margin-right": "0px",
      });
    }
    domStyle.set(node, {
      border: `${cardBorderWidth}px solid #000`,
    });
    return node;
  }

  const tiltRandom = genericUtils.seededRandom(234232443);
  function addQuasiRandomTilt(node, minTilt, maxTilt) {
    var zeroToOneRandom = tiltRandom();
    var tilt = minTilt + zeroToOneRandom * (maxTilt - minTilt);
    domStyle.set(node, {
      transform: `rotate(${tilt}deg)`,
    });
  }

  return {
    addDiv: addDiv,
    addImage: addImage,
    addStandardBorder: addStandardBorder,
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    componentToHex: componentToHex,
    blendHexColors: blendHexColors,
    addPageOfItems: addPageOfItems,
    addCard: addCard,
    addQuasiRandomTilt: addQuasiRandomTilt,
  };
});
