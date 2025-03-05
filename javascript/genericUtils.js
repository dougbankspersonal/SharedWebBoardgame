define(["dojo/domReady!"], function () {
  // validKeys maps keys to "true".
  // Passes if every key in table is in validKeys.
  // Does not check types.
  // Does not check the inverse: table may be missing some validKeys.
  function sanityCheckTable(table, validKeys) {
    for (var key in table) {
      if (!validKeys[key]) {
        console.assert(false, "sanityCheckTable: invalid key: " + key);
        return false;
      }
    }
    return true;
  }

  function getIndexOfFirstInstanceInArray(orderedRowTypes, thisRowType) {
    for (var i = 0; i < orderedRowTypes.length; i++) {
      var rowType = orderedRowTypes[i];
      if (rowType == thisRowType) {
        return i;
      }
    }
    return null;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function seededRandom(seed) {
    let currentSeed = seed;

    // Simple linear congruential generator (LCG)
    return function () {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  // Equal chance of being min, min -1, ... max.
  function getIntRandomInRange(min, max, zeroToOneRandom) {
    return Math.floor(min + zeroToOneRandom * (max - min));
  }

  function getRandomArrayElements(array, numElements, randFunction) {
    debugLog.debugLog(
      "Random",
      "Doug getRandomArrayElements: array = " + array
    );
    debugLog.debugLog(
      "Random",
      "Doug getRandomArrayElements: numElements = " + numElements
    );
    debugLog.debugLog(
      "Random",
      "Doug getRandomArrayElements: randFunction = " + randFunction
    );
    var shuffled = array.slice(0),
      i = array.length,
      min = i - numElements,
      temp,
      index;
    while (i-- > min) {
      index = Math.floor((i + 1) * randFunction());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }

  function getRandomArrayElement(array, randFunction) {
    debugLog.debugLog("Random", "Doug getRandomArrayElement: array = " + array);
    return getRandomArrayElements(array, 1, randFunction)[0];
  }

  return {
    sanityCheckTable: sanityCheckTable,
    getIndexOfFirstInstanceInArray: getIndexOfFirstInstanceInArray,
    seededRandom: seededRandom,
    getIntRandomInRange: getIntRandomInRange,
    getRandomArrayElement: getRandomArrayElement,
    getRandomArrayElements: getRandomArrayElements,
  };
});
