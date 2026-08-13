define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (domStyle, cards, debugLogModule, htmlUtils, genericUtils) {
  var debugLog = debugLogModule.debugLog;

  const gSectorsInTriangle = 4;

  function addNthSector(parentNode, sectorIndex, classes, opt_styling) {
    debugLog("addNthSector", "parentNode = ", parentNode);
    debugLog("addNthSector", "sectorIndex = ", sectorIndex);

    var finalClasses = classes.slice();
    finalClasses.push("sector");
    finalClasses.push("sector-index-" + sectorIndex);

    var sectorNode = htmlUtils.addDiv(
      parentNode,
      finalClasses,
      "sector-index-" + sectorIndex,
    );

    if (opt_styling) {
      domStyle.set(sectorNode, opt_styling);
    }

    return sectorNode;
  }

  function addCardFrontAndWrapper(parentNode, cardConfig, index) {
    debugLog(
      "triangleCards",
      "in addCardFront i == " +
        index +
        " cardConfig = " +
        JSON.stringify(cardConfig),
    );
    var id = "triangle-" + index;
    var classes = cardConfig.classes ? cardConfig.classes.slice() : [];
    classes.push("triangle");
    var cardFrontNode = cards.addCardFront(parentNode, classes, id);

    var frontWrapperClasses = ["front-wrapper"];
    if (cardConfig.isStarterCard) {
      frontWrapperClasses.push("starter");
    }
    if (cardConfig.season) {
      frontWrapperClasses.push("season-" + cardConfig.season);
    }
    var frontWrapperNode = htmlUtils.addDiv(
      cardFrontNode,
      frontWrapperClasses,
      "front-wrapper",
    );
    return [cardFrontNode, frontWrapperNode];
  }

  function elementsRotationallyMatch(array1, array2) {
    // Assert the type of each argument is "array"
    console.assert(Array.isArray(array1), "array1 is not an array");
    console.assert(Array.isArray(array2), "array2 is not an array");
    // Should be 2 sets of sector types.
    console.assert(
      array1.length === array2.length,
      "array1 and array2 are not the same length",
    );
    console.assert(
      array1.length === gSectorsInTriangle,
      "array1 is not the right length",
    );

    // Center (index 2) doesn't match: no.
    if (array1[2] !== array2[2]) {
      return false;
    }

    var cornerIndices = [0, 1, 3];
    // They are same if corners match in any rotation.
    for (var rotation = 0; rotation < 3; rotation++) {
      var match = true;
      for (var i = 0; i < cornerIndices.length; i++) {
        var index1 = cornerIndices[i];
        var index2 = cornerIndices[(i + rotation) % cornerIndices.length];
        if (array1[index1] !== array2[index2]) {
          match = false;
          break;
        }
      }
      if (match) {
        return true;
      }
    }
    return false;
  }

  // Is element rotationall unique in the remainder of this array.
  function elementIsRotationallyUnique(elementAsArray, index, array) {
    debugLog(
      "elementIsRotationallyUnique",
      "elementAsArray = ",
      JSON.stringify(elementAsArray),
    );
    debugLog("elementIsRotationallyUnique", "index = ", index);
    for (var i = index + 1; i < array.length; i++) {
      var otherElemenetAsArray = array[i];
      debugLog(
        "elementIsRotationallyUnique",
        "otherElemenetAsArray = ",
        JSON.stringify(otherElemenetAsArray),
      );
      if (elementsRotationallyMatch(elementAsArray, otherElemenetAsArray)) {
        debugLog(
          "elementIsRotationallyUnique",
          "elementAsArray is rotationally same as otherElemenetAsArray: returning false",
        );
        return false;
      }
      debugLog("elementIsRotationallyUnique", "no matches, returning true");
    }
    return true;
  }

  // Given an array of terrain types.
  // Return a set of card descriptors: card has 4 sectors, each sector one of the terrain types.
  // We want all possible permutations, mod some restraitns:
  //
  // 1. Terrain type cannot show up 3 or more times.
  // 2. At least one terrain type must be duplicated.
  // 3. Rotationally unique (clockwise a, b, c around d is same as clockwise b, c, a around d)
  function getLegalUniqueCombos(terrainTypesArray) {
    debugLog(
      "getLegalUniqueCombos",
      "terrainTypesArray = ",
      JSON.stringify(terrainTypesArray),
    );

    // First get all possible combos.
    var allCombos = genericUtils.generateAllArrays(
      terrainTypesArray,
      gSectorsInTriangle,
    );

    debugLog("getLegalUniqueCombos", "allCombos = ", JSON.stringify(allCombos));

    // Throw out anything where one type shows up too much.
    var filteredCombos1 = allCombos.filter((elementAsArray, _index, _array) => {
      var hasTooManyCopies =
        genericUtils.arrayHasAnElemententWithMoreThanNCopies(
          elementAsArray,
          gSectorsInTriangle - 2,
        );
      return !hasTooManyCopies;
    });

    debugLog(
      "getLegalUniqueCombos",
      "filteredCombos1 = ",
      JSON.stringify(filteredCombos1),
    );

    // Throw out anything where there are 0 dups.
    var filteredCombos2 = filteredCombos1.filter(
      (elementAsArray, _index, _array) => {
        var hasDups = genericUtils.arrayHasAnElemententWithMoreThanNCopies(
          elementAsArray,
          1,
        );
        debugLog(
          "getLegalUniqueCombos",
          "elementAsArray = ",
          JSON.stringify(elementAsArray),
        );
        debugLog("getLegalUniqueCombos", "hasDups = ", hasDups);

        return hasDups;
      },
    );

    debugLog(
      "getLegalUniqueCombos",
      "filteredCombos2 = ",
      JSON.stringify(filteredCombos2),
    );

    // Throw out rotationally similar combos.
    var finalCombos = filteredCombos2.filter((elementAsArray, index, array) => {
      return elementIsRotationallyUnique(elementAsArray, index, array);
    });

    debugLog(
      "getLegalUniqueCombos",
      "finalCombos = ",
      JSON.stringify(finalCombos),
    );
    return finalCombos;
  }

  // This returned object becomes the defined value of this module
  return {
    sectorsInTriangle: gSectorsInTriangle,

    addNthSector: addNthSector,
    addCardFrontAndWrapper: addCardFrontAndWrapper,
    elementsRotationallyMatch: elementsRotationallyMatch,
    getLegalUniqueCombos: getLegalUniqueCombos,
  };
});
