define([
  "dojo/dom-class",
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/triangleCardUtils",
  "dojo/domReady!",
], function (
  domClass,
  domStyle,
  cards,
  debugLogModule,
  genericMeasurements,
  htmlUtils,
  triangleCardUtils
) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------

  // Constants
  //
  //-----------------------------------
  // Triangle height = base/2 * rad(3).
  // Row height is half that.
  // This seems to need fudging a bit: hence the +2.
  const gTriangleHeightPx = genericMeasurements.triangleCardHeightPx;
  const gRowHeightPx = gTriangleHeightPx / 2;
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
      "sectors-row-" + rowIndex
    );
    domStyle.set(rowNode, {
      height: gRowHeightPx + "px",
    });
    return rowNode;
  }

  function addOverlays(parentNode, sectorDescriptor) {
    debugLog(
      "addOverlays",
      "sectorDescriptor = ",
      JSON.stringify(sectorDescriptor)
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
        var overlayNode = htmlUtils.addImage(
          parentNode,
          ["sector-overlay", overlayOrientationClass, overlay, overlayType],
          "sector-overlay-" + overlayType + "-" + overlayIndex
        );
      }
    }
  }

  function addSector(parentNode, sectorIndex, sectorDescriptor) {
    debugLog("addSector", "sectorIndex = ", JSON.stringify(sectorIndex));

    var sectorNode = triangleCardUtils.addNthSector(
      parentNode,
      sectorIndex,
      sectorDescriptor.classes,
      {
        height: gTriangleHeightPx / 2 + "px",
        width: gSectorWidthPx + "px",
      }
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

    // 2 rows.  Top has 1 sector, bottom 3.
    var columnCountByRow = [1, 3];
    var sectorNodes = [];
    var sectorIndex = 0;
    for (var rowIndex = 0; rowIndex < 2; rowIndex++) {
      var rowNode = addRow(frontWrapperNode, rowIndex);

      var columnCount = columnCountByRow[rowIndex];
      for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        var sectorNode = addSector(
          rowNode,
          sectorIndex,
          sectorDescriptors[sectorIndex]
        );
        sectorNodes.push(sectorNode);
        addOverlays(sectorNode, sectorDescriptors[sectorIndex]);
        sectorIndex++;
      }
    }

    // If there's a card index, add that.
    debugLog(
      "addCardFront",
      "cardConfig.cardIndex = ",
      JSON.stringify(cardConfig.cardIndex)
    );
    if (cardConfig.cardIndex) {
      var cardIndexNode = htmlUtils.addDiv(
        cardFrontNode,
        ["card-index"],
        "card-index",
        `${cardConfig.cardIndex}`
      );
    }

    // If there's customSectorConfiguration function call that.
    debugLog(
      "addCardFront",
      "cardConfig.customSectorConfiguration = ",
      JSON.stringify(cardConfig.customSectorConfiguration)
    );
    if (cardConfig.customSectorConfiguration) {
      cardConfig.customSectorConfiguration(sectorNodes, cardConfig);
    }

    return cardFrontNode;
  }

  function addCardBack(parent, cardConfigs, index) {
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    var classes = cardConfig.classes ? cardConfig.classes.slice() : [];
    classes.push("triangle");

    var cardBackNode = cards.addCardBack(parent, index, {
      classes: classes,
    });

    var cardBackIconNode = htmlUtils.addImage(
      cardBackNode,
      ["triangle-icon"],
      "triangle-icon"
    );

    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
