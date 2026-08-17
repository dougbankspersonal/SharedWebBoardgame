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
  debugLogModule,
  genericMeasurements,
  genericUtils,
  systemConfigs,
  domConstruct,
  domStyle,
) {
  var debugLog = debugLogModule.debugLog;

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
      parent,
    );
    return node;
  }

  function addImage(parent, classArray, id, opt_image) {
    console.assert(classArray != null, "classArray is null");
    console.assert(parent, "parent is null");
    if (!opt_image) {
      classArray.unshift("pseudo-image");
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
      border: genericMeasurements.standardBorderWidthPx + "px solid black",
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

  function rgbStringToHex(rgbString) {
    // Example input: "rgb(255, 0, 0)"
    var rgbValues = rgbString.match(/\d+/g);
    if (!rgbValues || rgbValues.length !== 3) {
      throw new Error("Invalid RGB string format");
    }
    var r = parseInt(rgbValues[0], 10);
    var g = parseInt(rgbValues[1], 10);
    var b = parseInt(rgbValues[2], 10);
    return rgbToHex(r, g, b);
  }

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function blendHexColors(color1, color2, opt_percentage) {
    var percentage = opt_percentage !== undefined ? opt_percentage : 0.5;
    // Parse hexadecimal color strings into arrays of RGB values
    var rgb1 = hexToRgb(color1);
    var rgb2 = hexToRgb(color2);

    // Calculate the blended RGB values
    var blendedRgb = [
      Math.round(rgb1[0] * (1 - percentage) + rgb2[0] * percentage),
      Math.round(rgb1[1] * (1 - percentage) + rgb2[1] * percentage),
      Math.round(rgb1[2] * (1 - percentage) + rgb2[2] * percentage),
    ];

    // Convert blended RGB values to hexadecimal format
    var blendedHex = rgbToHex(blendedRgb[0], blendedRgb[1], blendedRgb[2]);

    return blendedHex;
  }

  function getPageWidth() {
    debugLog("Layout", "getPageWidth 001");
    var sc = systemConfigs.getSystemConfigs();
    if (sc.explicitPageWidth) {
      debugLog(
        "Layout",
        "getPageWidth sc.explicitPageWidth = " + sc.explicitPageWidth,
      );
      return sc.explicitPageWidth;
    }
    if (sc.pageless) {
      debugLog("Layout", "getPageWidth null");
      return null;
    }
    if (sc.landscape) {
      debugLog(
        "Layout",
        "getPageWidth genericMeasurements.printedPageLandscapeWidthPx = " +
          genericMeasurements.printedPageLandscapeWidthPx,
      );
      return genericMeasurements.printedPageLandscapeWidthPx;
    }

    debugLog(
      "Layout",
      "getPageWidth genericMeasurements.printedPagePortraitWidthPx = " +
        genericMeasurements.printedPagePortraitWidthPx,
    );
    return genericMeasurements.printedPagePortraitWidthPx;
  }

  var getPageHeight = function () {
    var sc = systemConfigs.getSystemConfigs();
    if (sc.pageless) {
      return null;
    }
    if (sc.landscape) {
      return genericMeasurements.printedPageLandscapeHeightPx;
    }

    return genericMeasurements.printedPagePortraitHeightPx;
  };

  function addPageOfItems(parent, opt_classes) {
    var sc = systemConfigs.getSystemConfigs();
    console.assert(parent, "parent is null");
    var pageOfItemsClassArray = genericUtils.growOptStringArray(
      opt_classes,
      "page-of-items",
    );
    var pageId = "pageOfItems_".concat(pageNumber.toString());
    pageNumber++;

    var pageOfItemsNode = addDiv(parent, pageOfItemsClassArray, pageId);
    var width = getPageWidth();
    var height = getPageHeight();
    debugLog("Refactor", "addPageOfItems: width = " + width);
    debugLog("Refactor", "addPageOfItems: height = " + height);
    if (width !== null) {
      domStyle.set(pageOfItemsNode, {
        width: width + "px",
      });
    }
    if (height !== null) {
      domStyle.set(pageOfItemsNode, {
        height: height + "px",
      });
    }

    if (sc.addPageNumbers) {
      var pageNumberNode = addDiv(
        pageOfItemsNode,
        ["page_number"],
        "pageNumber",
        pageNumber.toString(),
      );
    }

    debugLog("Layout", "addPageOfItems: sc.gridGap = " + sc.gridGap);
    var gridGapIsPresent = sc.gridGap !== null && sc.gridGap !== undefined;
    var gridGap = gridGapIsPresent
      ? sc.gridGap
      : genericMeasurements.standardPageGap;
    debugLog("Layout", "addPageOfItems: gridGap = " + gridGap);
    domStyle.set(pageOfItemsNode, {
      gap: `${gridGap}px`,
    });

    return pageOfItemsNode;
  }

  var gCardNumber = 0;
  function addCard(parent, opt_classArray, opt_id) {
    console.assert(parent, "parent is null");
    var classArray = genericUtils.growOptStringArray(opt_classArray, "card");
    var cardId;
    if (opt_id) {
      cardId = opt_id;
    } else {
      cardId = "card.".concat(gCardNumber.toString());
      gCardNumber++;
    }
    var node = addDiv(parent, classArray, cardId);
    if (systemConfigs.cardsNoMargin) {
      domStyle.set(node, {
        "margin-bottom": "0px",
        "margin-right": "0px",
      });
    }
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

  function applyColorFamily(parent, colorFamily) {
    if (!colorFamily) {
      return;
    }
    domStyle.set(parent, {
      "border-color": colorFamily.border,
      color: colorFamily.font,
      background:
        "linear-gradient(to bottom, " +
        colorFamily.gradient1 +
        " 0%, " +
        colorFamily.gradient2 +
        " 100%)",
    });
  }

  function addRowOfItems(parent) {
    var classes = ["row-of-items"];
    return addDiv(parent, classes, "rowOfItems");
  }

  function maybeAddNewRowOfItems(parent, currentRow, index) {
    var itemsPerRow = systemConfigs.getSystemConfigs().itemsPerRow;
    var needNew = index % itemsPerRow;
    if (needNew == 0) {
      debugLog(
        "maybeAddNewRowOfItems",
        "adding new row for index = " + index.toString(),
      );
      return addRowOfItems(parent);
    }
    return currentRow;
  }

  return {
    addDiv: addDiv,
    addImage: addImage,
    addStandardBorder: addStandardBorder,
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    rgbStringToHex: rgbStringToHex,
    componentToHex: componentToHex,
    blendHexColors: blendHexColors,
    addPageOfItems: addPageOfItems,
    addCard: addCard,
    addQuasiRandomTilt: addQuasiRandomTilt,
    applyColorFamily: applyColorFamily,
    addRowOfItems: addRowOfItems,
    maybeAddNewRowOfItems: maybeAddNewRowOfItems,
  };
});
