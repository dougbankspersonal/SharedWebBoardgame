// Utilities for Html manipulation using dojo.
define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/genericUtils",
  "sharedJavascript/systemConfigs",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/domReady!",
], function (
  debugLog,
  genericMeasurements,
  genericUtils,
  systemConfigs,
  domConstruct,
  domStyle
) {
  var pageNumber = 0;

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
      border: genericMeasurements.standardBorderWidth + "px solid black",
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
    debugLog.debugLog("Layout", "Doug: getPageWidth 001");
    var sc = systemConfigs.getSystemConfigs();
    if (sc.explicitPageWidth) {
      debugLog.debugLog(
        "Layout",
        "Doug: getPageWidth sc.explicitPageWidth = " + sc.explicitPageWidth
      );
      return sc.explicitPageWidth;
    }
    if (sc.pageless) {
      debugLog.debugLog("Layout", "Doug: getPageWidth null");
      return null;
    }
    if (sc.landscape) {
      debugLog.debugLog(
        "Layout",
        "Doug: getPageWidth genericMeasurements.printedPageLandscapeWidth = " +
          genericMeasurements.printedPageLandscapeWidth
      );
      return genericMeasurements.printedPageLandscapeWidth;
    }

    debugLog.debugLog(
      "Layout",
      "Doug: getPageWidth genericMeasurements.printedPagePortraitWidth = " +
        genericMeasurements.printedPagePortraitWidth
    );
    return genericMeasurements.printedPagePortraitWidth;
  }

  var getPageHeight = function () {
    var sc = systemConfigs.getSystemConfigs();
    if (sc.pageless) {
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
    var classArray = genericUtils.growOptStringArray(
      opt_classArray,
      "page_of_items"
    );
    var pageId = "pageOfItems_".concat(pageNumber.toString());
    pageNumber++;

    var pageOfItems = addDiv(parent, classArray, pageId);
    var width = getPageWidth();
    var height = getPageHeight();
    debugLog.debugLog("Refactor", "Doug: addPageOfItems: width = " + width);
    debugLog.debugLog("Refactor", "Doug: addPageOfItems: height = " + height);
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

    domStyle.set(pageOfItems, {
      padding: genericMeasurements.pageOfItemsPaddingPx + "px",
    });

    var childClassArray = ["page_of_items_contents"];

    var extraClass = sc.extraClassForPageOfItemsContents;
    if (extraClass) {
      childClassArray.push(extraClass);
    }

    var pageOfItemsContents = addDiv(
      pageOfItems,
      childClassArray,
      "pageOfItemsContents"
    );

    if (sc.gridGap !== null) {
      debugLog.debugLog(
        "Refactor",
        "Doug: addPageOfItems: sc.gridGap = " + sc.gridGap
      );
      domStyle.set(pageOfItemsContents, {
        gap: `${sc.gridGap}px`,
      });
    }

    return pageOfItemsContents;
  }

  function addCard(parent, opt_classArray, opt_id) {
    console.assert(parent, "parent is null");
    var classArray = genericUtils.growOptStringArray(opt_classArray, "card");
    var cardId;
    if (opt_id) {
      cardId = opt_id;
    } else {
      cardId = "card.".concat(cardNumber.toString());
      cardNumber++;
    }
    var node = addDiv(parent, classArray, cardId);
    if (systemConfigs.cardsNoMargin) {
      domStyle.set(node, {
        "margin-bottom": "0px",
        "margin-right": "0px",
      });
    }
    domStyle.set(node, {
      "border-width": `${genericMeasurements.cardBorderWidth}px`,
      "border-style": "solid",
    });
    return node;
  }

  const seededZeroToOneRandomFunction =
    genericUtils.createSeededGetZeroToOneRandomFunction(234232443);
  function addQuasiRandomTilt(node, minTilt, maxTilt) {
    var zeroToOneRandom = seededZeroToOneRandomFunction();
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
