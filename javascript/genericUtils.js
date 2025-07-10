define(["sharedJavascript/debugLog", "dojo/domReady!"], function (debugLog) {
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

  function createSeededGetZeroToOneRandomFunction(seed) {
    let currentSeed = seed;

    // Simple linear congruential generator (LCG)
    return function () {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  // Equal chance of being min, min + 1, max.
  // Note max is INCLUDED: range is [min, max]
  function getRandomIntInRange(min, max, getRandomZeroToOne) {
    return Math.floor(min + getRandomZeroToOne() * (1 + max - min));
  }

  function getRandomArrayElements(array, numElements, getRandomZeroToOne) {
    var shuffled = array.slice(0),
      i = array.length,
      min = i - numElements,
      temp,
      index;
    while (i-- > min) {
      index = Math.floor((i + 1) * getRandomZeroToOne());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }

  function getRandomArrayElement(array, getRandomZeroToOne) {
    debugLog.debugLog(
      "Random",
      "Doug: getRandomArrayElement: array = " + array
    );
    return getRandomArrayElements(array, 1, getRandomZeroToOne)[0];
  }

  function getRandomArrayElementNotMatching(
    array,
    skippedValue,
    getRandomZeroToOne
  ) {
    while (1) {
      var element = getRandomArrayElement(array, getRandomZeroToOne);
      if (element != skippedValue) {
        return element;
      }
    }
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

  function stringToBoolean(str) {
    if (typeof str !== "string") {
      return false;
    }
    return str === "true";
  }

  function getCommonQueryParams() {
    var queryString = window.location.search;
    // Create a URLSearchParams object
    var params = new URLSearchParams(queryString);
    // Get individual parameters
    var isTTS = stringToBoolean(params.get("isTTS"));
    var skipCardBacks = stringToBoolean(params.get("skipCardBacks"));
    var singleCardInstance = stringToBoolean(params.get("singleCardInstance"));
    return {
      isTTS: isTTS,
      skipCardBacks: skipCardBacks,
      singleCardInstance: singleCardInstance,
    };
  }

  return {
    sanityCheckTable: sanityCheckTable,
    getIndexOfFirstInstanceInArray: getIndexOfFirstInstanceInArray,
    getRandomInt: getRandomInt,
    createSeededGetZeroToOneRandomFunction:
      createSeededGetZeroToOneRandomFunction,
    getRandomIntInRange: getRandomIntInRange,
    getRandomArrayElement: getRandomArrayElement,
    getRandomArrayElementNotMatching: getRandomArrayElementNotMatching,
    getRandomArrayElements: getRandomArrayElements,
    growOptStringArray: growOptStringArray,
    stringToBoolean: stringToBoolean,
    getCommonQueryParams: getCommonQueryParams,
  };
});
