define([
  "dojo/dom-style",
  "dojo/dom-class",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/systemConfigs",
  "sharedJavascript/triangleCardUtils",
  "dojo/domReady!",
], function (
  domStyle,
  domClass,
  cards,
  debugLogModule,
  genericMeasurements,
  genericUtils,
  htmlUtils,
  systemConfigs,
  triangleCardUtils,
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------

  // Constants
  //
  //-----------------------------------
  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function getTriangleCardHeightPx() {
    var sc = systemConfigs.getSystemConfigs();
    return sc.cardHeightPx;
  }

  function getTriangleCardWidthPx() {
    var sc = systemConfigs.getSystemConfigs();
    return sc.cardWidthPx;
  }

  function getSectorHeightPx() {
    var cardHeightPx = getTriangleCardHeightPx();
    return cardHeightPx / 2;
  }

  function getSectorWidthPx() {
    var sc = systemConfigs.getSystemConfigs();
    var cardWidthPx = sc.cardWidthPx;
    return cardWidthPx / 2;
  }

  function addRowOfSectors(parentNode, rowIndex) {
    var rowNode = htmlUtils.addDiv(
      parentNode,
      ["sectors-row", "sectors-row-" + rowIndex],
      "sectors-row-" + rowIndex,
    );
    domStyle.set(rowNode, {
      height: getSectorHeightPx() + "px",
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
          [
            "sector-overlay",
            "single-sector-insert",
            overlayOrientationClass,
            overlay,
            overlayType,
          ],
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
        height: getSectorHeightPx() + "px",
        width: getSectorWidthPx() + "px",
      },
    );

    return sectorNode;
  }

  function addTriangleCardFront(parentNode, cardConfigs, index) {
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);
    debugLog(
      "addTriangleCardFront",
      "cardConfig = ",
      JSON.stringify(cardConfig),
    );
    debugLog("addTriangleCardFront", "index = ", JSON.stringify(index));

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
      var rowNode = addRowOfSectors(frontWrapperNode, rowIndex);

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
      "addTriangleCardFront",
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
        top: `${getTriangleCardHeightPx() - 25}px`,
      });
    }

    // If there's customSectorConfiguration function call that.
    debugLog(
      "addTriangleCardFront",
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
        width: getTriangleCardWidthPx() + "px",
        height: getTriangleCardHeightPx() + "px",
      });
    }

    return cardFrontNode;
  }

  function addTriangleCardBack(
    parent,
    cardIndex,
    opt_classes,
    opt_wrapperCallback,
  ) {
    var classes = opt_classes ? opt_classes.slice() : [];
    classes.push("triangle");

    var cardBackNode = cards.addCardBack(parent, cardIndex, {
      classes: classes,
    });

    var wrapperClasses = ["back-wrapper"];
    var wrapperNode = htmlUtils.addDiv(
      cardBackNode,
      wrapperClasses,
      "back-wrapper",
    );

    domStyle.set(wrapperNode, {
      width: getTriangleCardWidthPx() + "px",
      height: getTriangleCardHeightPx() + "px",
    });

    if (opt_wrapperCallback) {
      opt_wrapperCallback(wrapperNode);
    }

    console.assert(
      cardBackNode,
      "addTriangleCardBack failed to create cardBackNode",
    );
    return cardBackNode;
  }

  // Each player has a custom deck.
  // Each deck has specific back.
  // Back has a background image and an icon image.
  function addPlayerSpecificTriangleCardBack(
    parentNode,
    cardIndex,
    playerIndex,
    cardClasses,
  ) {
    debugLog("addPlayerSpecificTriangleCardBack", "cardIndex = ", cardIndex);
    debugLog(
      "addPlayerSpecificTriangleCardBack",
      "playerIndex = ",
      playerIndex,
    );
    var finalCardClasses = cardClasses ? cardClasses.slice() : [];
    finalCardClasses.push("player-" + playerIndex.toString());
    var cardBackNode = addTriangleCardBack(
      parentNode,
      cardIndex,
      finalCardClasses,
      function (wrapperNode) {
        // Wrapper node gets player class.
        var playerClass = "player-" + playerIndex.toString();
        domClass.add(wrapperNode, playerClass);

        // Insert the player's image.
        var imageNode = htmlUtils.addImage(wrapperNode, [
          "player",
          "player-icon-" + playerIndex.toString(),
          "single-sector-insert",
        ]);
        console.assert(
          imageNode,
          "addPlayerCardBack failed to create imageNode",
        );
        return imageNode;
      },
    );

    console.assert(
      cardBackNode,
      "addPlayerCardBack failed to create cardBackNode",
    );
    return cardBackNode;
  }

  function generateTriangleCards(cardsData) {
    var isScreentop = genericUtils.getCommonQueryParams().isScreentop;

    var cardWidthPx;
    var cardHeightPx;
    var itemsPerRow;
    if (isScreentop) {
      cardWidthPx = genericMeasurements.triangleCardWidthPx;
      cardHeightPx = genericMeasurements.triangleCardHeightPx;
      itemsPerRow = 10;
    } else {
      cardWidthPx = genericMeasurements.nonScreentopTriangleCardWidthPx;
      cardHeightPx = genericMeasurements.nonScreentopTriangleCardHeightPx;
    }

    var sc = systemConfigs.getCardSystemConfigs({
      cardHeightPx: cardHeightPx,
      cardWidthPx: cardWidthPx,
      itemsPerRow: itemsPerRow,
    });

    systemConfigs.setSystemConfigs(sc);

    var numCards = cardsData.getNumCards();
    var cardConfigs = cardsData.getCardConfigs();
    var backConfigs = cardsData.getBackConfigs();

    debugLog(
      "generateTriangleCards",
      "backConfigs = ",
      JSON.stringify(backConfigs),
    );

    cards.addCards(
      numCards,
      function (parentNode, index) {
        return addTriangleCardFront(parentNode, cardConfigs, index);
      },
      backConfigs,
    );
  }

  // This returned object becomes the defined value of this module
  return {
    addTriangleCardFront: addTriangleCardFront,
    addTriangleCardBack: addTriangleCardBack,
    addPlayerSpecificTriangleCardBack: addPlayerSpecificTriangleCardBack,
    generateTriangleCards: generateTriangleCards,
  };
});
