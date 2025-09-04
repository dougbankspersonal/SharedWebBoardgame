define(["sharedJavascript/debugLog", "dojo/domReady!"], function (
  debugLogModule
) {
  var debugLog = debugLogModule.debugLog;
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

  // Note max is INCLUDED: range is [min, max]
  function getRandomIntInRange(min, max, getRandomZeroToOne) {
    return Math.floor(min + getRandomZeroToOne() * (1 + max - min));
  }

  // This gives back elements at n uniuqe instances in the array.
  function getRandomNonRepeatingArrayElements(
    array,
    numElements,
    getRandomZeroToOne
  ) {
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

  function getRandomMaybeRepeatingArrayElements(
    array,
    numElements,
    getRandomZeroToOne
  ) {
    var result = [];
    for (var i = 0; i < numElements; i++) {
      result.push(getRandomArrayElement(array, getRandomZeroToOne));
    }
    return result;
  }

  function getRandomArrayElement(array, getRandomZeroToOne) {
    debugLog("Random", "getRandomArrayElement: array = " + array);
    return getRandomNonRepeatingArrayElements(array, 1, getRandomZeroToOne)[0];
  }

  function getRandomArrayElementNotMatching(
    array,
    skippedValues,
    getRandomZeroToOne
  ) {
    while (1) {
      var element = getRandomArrayElement(array, getRandomZeroToOne);
      if (!skippedValues.includes(element)) {
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
    var isTTP = stringToBoolean(params.get("isTTP"));
    var skipCardBacks = stringToBoolean(params.get("skipCardBacks"));
    var singleCardInstance = stringToBoolean(params.get("singleCardInstance"));
    var debugLogFlagsString = params.get("debugLogFlags");
    // Assume this is a comma separated string of strings.  Parse to an array of strings.
    var debugLogFlagsArray = debugLogFlagsString
      ? debugLogFlagsString.split(",")
      : [];
    // Just set it now:
    debugLogModule.setEnabledFlags(debugLogFlagsArray);
    return {
      isTTP: isTTP,
      isTTS: isTTS || isTTP,
      skipCardBacks: skipCardBacks,
      singleCardInstance: singleCardInstance,
      debugFlags: debugLogFlagsArray,
    };
  }

  // We given some array where each element is unique value.
  // We are going to randomlys select an element from the array n times.
  // The result is expressed as a histogram mapping array member to count.
  function randomHistogramFromArray(count, array, getRandomZeroToOne) {
    var histogram = {};
    for (var i = 0; i < count; i++) {
      var element = getRandomArrayElement(array, getRandomZeroToOne);
      if (histogram[element]) {
        histogram[element]++;
      } else {
        histogram[element] = 1;
      }
    }
    return histogram;
  }

  // Given two js tables are they the same: both keys and contents, recursively.
  function tablesMatch(table1, table2) {
    if (Object.keys(table1).length !== Object.keys(table2).length) {
      return false;
    }
    for (var key in table1) {
      if (!table2.hasOwnProperty(key)) {
        return false;
      }
      var value1 = table1[key];
      var value2 = table2[key];
      if (typeof value1 === "object" && typeof value2 === "object") {
        if (!tablesMatch(value1, value2)) {
          return false;
        }
      } else if (value1 !== value2) {
        return false;
      }
    }
    return true;
  }

  // Call randomHistogramFromArray on the given inputs: note that result.
  // Do it again until the second result is different from the first.
  // Return array of two histograms.
  function generateNonMatchingHistograms(count, array, getRandomZeroToOne) {
    var histograms;
    debugLog("CardConfigs", "generateNonMatchingHistograms");

    var firstHistogram = randomHistogramFromArray(
      count,
      array,
      getRandomZeroToOne
    );
    for (var z = 0; z < 1000; z++) {
      var secondHistogram = randomHistogramFromArray(
        count,
        array,
        getRandomZeroToOne
      );
      if (!tablesMatch(firstHistogram, secondHistogram)) {
        histograms = [firstHistogram, secondHistogram];
        debugLog(
          "CardConfigs",
          "generateNonMatchingHistograms returning histograms = " +
            JSON.stringify(histograms)
        );
        return histograms;
      }
    }
    console.assert(false, "Early exit from generateNonMatchingHistograms");
  }

  function sumHistogram(opt_histogram) {
    var histogram = opt_histogram ? opt_histogram : {};
    var sum = 0;
    for (var key in histogram) {
      sum += histogram[key];
    }
    return sum;
  }

  function copyAndShuffleArray(array, getRandomZeroToOne) {
    debugLog("Random", "copyAndShuffleArray: array = " + JSON.stringify(array));
    var shuffled = array.slice(0),
      i = array.length,
      temp,
      index;
    while (i--) {
      index = Math.floor((i + 1) * getRandomZeroToOne());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled;
  }

  // Pick a random element from the array, paying attention to history:
  // 1. If most-picked is maxExcess or more ahead of least picked, then most-picked is ineligible.
  // 2. If anything was picked maxCount times, it is ineligible.
  // 3. Potentially some callback to reject/approve.
  // If nothing can be picked, return null.
  function getRandomFromArrayWithRails(
    arrayOfOptions,
    previousHistoryHistogram,
    maxExcess,
    maxCount,
    getRandomZeroToOne,
    opt_validationCallback
  ) {
    debugLog(
      "getRandomFromArrayWithRails",
      "getRandomFromArrayWithRails arrayOfOptions = ",
      JSON.stringify(arrayOfOptions)
    );
    debugLog(
      "getRandomFromArrayWithRails",
      "getRandomFromArrayWithRails previousHistoryHistogram = ",
      JSON.stringify(previousHistoryHistogram)
    );
    debugLog(
      "getRandomFromArrayWithRails",
      "getRandomFromArrayWithRails maxExcess = ",
      JSON.stringify(maxExcess)
    );
    debugLog(
      "getRandomFromArrayWithRails",
      "getRandomFromArrayWithRails maxCount = ",
      JSON.stringify(maxCount)
    );

    debugLog(
      "testRandom",
      "  getRandomFromArrayWithRails: previousHistoryHistogram = ",
      JSON.stringify(previousHistoryHistogram)
    );

    // Sanity check: should never have more than max in history.
    for (var i = 0; i < arrayOfOptions.length; i++) {
      var option = arrayOfOptions[i];
      var historyCount = previousHistoryHistogram[option] || 0;
      console.assert(
        historyCount <= maxCount,
        "historyCount = " + historyCount + ", maxCount = " + maxCount
      );
    }

    var leastPickedOption = Math.min(
      ...Object.values(previousHistoryHistogram)
    );
    var eligibleOptions = arrayOfOptions.filter(function (option) {
      if (opt_validationCallback && !opt_validationCallback[option]) {
        debugLog(
          "getRandomFromArrayWithRails",
          "getRandomFromArrayWithRails eligibleOptions failed callback."
        );
        return false;
      }
      var optionHistory = previousHistoryHistogram[option] || 0;
      if (optionHistory >= maxCount) {
        debugLog(
          "getRandomFromArrayWithRails",
          "getRandomFromArrayWithRails eligibleOptions failed optionHistory: optionHistory = " +
            JSON.stringify(optionHistory) +
            ": maxCount = " +
            JSON.stringify(maxCount)
        );
        return false;
      }

      var lessThanMaxExcess = optionHistory - leastPickedOption < maxExcess;
      if (!lessThanMaxExcess) {
        debugLog(
          "getRandomFromArrayWithRails",
          "getRandomFromArrayWithRails eligibleOptions failed lessThanMaxExcess: lessThanMaxExcess = " +
            JSON.stringify(lessThanMaxExcess)
        );
        return false;
      }

      return true;
    });

    debugLog(
      "getRandomFromArrayWithRails",
      "getRandomFromArrayWithRails eligibleOptions = ",
      JSON.stringify(eligibleOptions)
    );

    if (eligibleOptions.length === 0) {
      // No fallback: return null.
      return null;
    }

    var pickedValue = getRandomArrayElement(
      eligibleOptions,
      getRandomZeroToOne
    );

    // Update the results histogram.
    previousHistoryHistogram[pickedValue] =
      (previousHistoryHistogram[pickedValue] || 0) + 1;
    debugLog(
      "getRandomFromArrayWithRails",
      "getRandomFromArrayWithRails returning pickedValue = ",
      pickedValue
    );
    return pickedValue;
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
    getRandomNonRepeatingArrayElements: getRandomNonRepeatingArrayElements,
    getRandomMaybeRepeatingArrayElements: getRandomMaybeRepeatingArrayElements,
    growOptStringArray: growOptStringArray,
    stringToBoolean: stringToBoolean,
    getCommonQueryParams: getCommonQueryParams,
    generateNonMatchingHistograms: generateNonMatchingHistograms,
    tablesMatch: tablesMatch,
    randomHistogramFromArray: randomHistogramFromArray,
    sumHistogram: sumHistogram,
    copyAndShuffleArray: copyAndShuffleArray,
    getRandomFromArrayWithRails: getRandomFromArrayWithRails,
  };
});
