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

  function isString(value) {
    return typeof value === "string";
  }

  // opt_stringArray is array of strings or null.
  // If null treat like empty array.
  // addedStringOrStrings is string or array of strings.
  // If addedStringOrStrings is a string, add to opt_stringArray.
  // If addedStringOrStrings is an array, concatenate to opt_stringArray.
  function growOptStringArray(opt_existingStringArray, addedStringOrStrings) {
    var existingStringArray = opt_existingStringArray
      ? opt_existingStringArray
      : [];
    console.assert(
      typeof existingStringArray === "object",
      "existingStringArray is not an object"
    );
    if (isString(addedStringOrStrings)) {
      existingStringArray.push(addedStringOrStrings);
      return existingStringArray;
    } else {
      // must be an array
      var newStringArray = existingStringArray.concat(addedStringOrStrings);
      return newStringArray;
    }
  }

  return {
    sanityCheckTable: sanityCheckTable,
    getIndexOfFirstInstanceInArray: getIndexOfFirstInstanceInArray,
    getRandomInt: getRandomInt,
    seededRandom: seededRandom,
    getIntRandomInRange: getIntRandomInRange,
    getRandomArrayElement: getRandomArrayElement,
    getRandomArrayElements: getRandomArrayElements,
    growOptStringArray: growOptStringArray,
  };
});
