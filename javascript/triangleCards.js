define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/triangleCardUtils",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  genericMeasurements,
  htmlUtils,
  triangleCardUtils,
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------

  // Constants
  //
  //-----------------------------------
  // Triangle height = base/2 * rad(3).
  // Row height is half that.
  // This seems to need fudging a bit: hence the +2.
  const gTriangleCardImageHeightPx =
    genericMeasurements.triangleCardImageHeightPx;
  const gRowHeightPx = gTriangleCardImageHeightPx / 2;
  const gSectorWidthPx = genericMeasurements.standardCardWidthPx / 2;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function addRow(parentNode, rowIndex) {
    var rowNode = htmlUtils.addDiv(
      parentNode,
      ["sectors-row", "sectors-row-" + rowIndex],
      "sectors-row-" + rowIndex,
    );
    domStyle.set(rowNode, {
      height: gRowHeightPx + "px",
    });
    return rowNode;
  }

  function addSectorOverlays(parentNode, sectorDescriptor) {
    debugLog(
      "addSectorOverlays",
      "sectorDescriptor = ",
      JSON.stringify(sectorDescriptor),
    );

    for (var overlayType in sectorDescriptor.overlaysByType) {
      var overlays = sectorDescriptor.overlaysByType[overlayType];
      for (
        var overlayIndex = 0;
        overlayIndex < overlays.length;
        overlayIndex++
      ) {
        if (!overlays[overlayIndex]) {
          continue;
        }
        var overlay = overlays[overlayIndex];
        var overlayOrientationClass = "orientation-" + overlayIndex;
        htmlUtils.addImage(
          parentNode,
          ["sector-overlay", overlayOrientationClass, overlay, overlayType],
          "sector-overlay-" + overlayType + "-" + overlayIndex,
        );
      }
    }
  }

  function addSector(parentNode, sectorIndex, sectorDescriptor) {
    debugLog("addSector", "sectorIndex = ", JSON.stringify(sectorIndex));
    debugLog(
      "addSector",
      "sectorDescriptor = ",
      JSON.stringify(sectorDescriptor),
    );

    var sectorNode = triangleCardUtils.addNthSector(
      parentNode,
      sectorIndex,
      sectorDescriptor.classes,
      {
        height: gRowHeightPx + "px",
        width: gSectorWidthPx + "px",
      },
    );

    return sectorNode;
  }

  function addCardFront(parentNode, cardConfigs, index) {
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);
    debugLog("addCardFront", "cardConfig = ", JSON.stringify(cardConfig));
    debugLog("addCardFront", "index = ", index);

    var [cardFrontNode, frontWrapperNode] =
      triangleCardUtils.addCardFrontAndWrapper(parentNode, cardConfig, index);

    var sectorDescriptors = cardConfig.sectorDescriptors;

    // Should be the right number of these.
    console.assert(
      sectorDescriptors.length === triangleCardUtils.sectorsInTriangle,
      "sectorDescriptors.length !== triangleCardUtils.sectorsInTriangle",
    );

    // 2 rows.  Top has 1 sector, bottom 3.
    var columnCountByRow = [1, 3];
    var sectorNodes = [];
    var positionalIndex = 0;

    // We do a little twiddling so that the sector at index 0 is in the middle of bottom.
    // So it's:
    //    1
    //    0
    //  2   3

    const positionalIndexToSectorIndex = [1, 2, 0, 3];

    for (var rowIndex = 0; rowIndex < 2; rowIndex++) {
      var rowNode = addRow(frontWrapperNode, rowIndex);

      var columnCount = columnCountByRow[rowIndex];
      for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        var sectorIndex = positionalIndexToSectorIndex[positionalIndex];
        var sectorDescriptor = sectorDescriptors[sectorIndex];
        var sectorNode = addSector(rowNode, positionalIndex, sectorDescriptor);
        sectorNodes.push(sectorNode);
        addSectorOverlays(sectorNode, sectorDescriptor);
        positionalIndex++;
      }
    }

    // If there's a card index, add that.
    debugLog(
      "addCardFront",
      "cardConfig.cardIndex = ",
      JSON.stringify(cardConfig.cardIndex),
    );
    if (cardConfig.cardIndex) {
      var cardIndexNode = htmlUtils.addDiv(
        cardFrontNode,
        ["card-index"],
        "card-index",
        `${cardConfig.cardIndex}`,
      );

      domStyle.set(cardIndexNode, {
        top: `${genericMeasurements.triangleCardImageHeightPx - 25}px`,
      });
    }

    // If there's customSectorConfiguration function call that.
    debugLog(
      "addCardFront",
      "cardConfig.customSectorConfiguration = ",
      JSON.stringify(cardConfig.customSectorConfiguration),
    );
    if (cardConfig.customSectorConfiguration) {
      cardConfig.customSectorConfiguration(sectorNodes, cardConfig);
    }

    if (cardConfig.overlayClass) {
      var overlayNode = htmlUtils.addImage(
        cardFrontNode,
        [cardConfig.overlayClass, "overlay"],
        "overlay",
      );
      domStyle.set(overlayNode, {
        width: genericMeasurements.standardCardWidthPx + "px",
        height: gTriangleCardImageHeightPx + "px",
      });
    }

    return cardFrontNode;
  }

  function addTriangleCardBack(parent, cardIndex, opt_classes) {
    var classes = opt_classes ? opt_classes.slice() : [];
    classes.push("triangle");

    var cardBackNode = cards.addCardBack(parent, cardIndex, {
      classes: classes,
    });

    var wrapperNode = htmlUtils.addDiv(
      cardBackNode,
      ["back-wrapper"],
      "back-wrapper",
    );

    domStyle.set(wrapperNode, {
      width: genericMeasurements.standardCardWidthPx + "px",
      height: gTriangleCardImageHeightPx + "px",
    });

    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addTriangleCardBack: addTriangleCardBack,
  };
});
