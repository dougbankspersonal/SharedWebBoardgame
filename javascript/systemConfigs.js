//
// Model for setting system configs as we generate this or that page.
// Custom this boardgame module: the allowed configs have to do with questions of
// card size, how we print things, etc.
define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (debugLogModule, genericMeasurements, genericUtils) {
  var debugLog = debugLogModule.debugLog;

  var _systemConfigs = {};

  var validSystemConfigKeys = {
    //---------------------------
    //
    // Vars for cards
    //
    //---------------------------
    isCards: true,
    // How many cards before we add a page break?
    cardsPerPage: true,
    // Alt size of cards.
    cardWidthPx: true,
    cardHeightPx: true,
    cardBackFontSize: true,
    // Do all card fronts separate from backs: we are not gonna print double sided,
    // we print fronts and backs and then stick em together.
    separateBacks: true,
    // TTS requires at least 12 cards.
    minCardCount: true,
    // Sometimes we just want one of each type of card, no dups.
    singleCardInstance: true,
    // Do not render card backs.
    skipCardBacks: true,
    // For cards, no margin around them.
    cardsNoMargin: true,
    // Should be able to figure out cards per row based on card width and page width but
    // somehow it's off and I'm too lazy to fix.
    cardsPerRow: true,

    //---------------------------
    //
    // Vars for boards
    //
    //---------------------------
    maxRowsPerPage: true,
    maxColumnsPerPage: true,

    //---------------------------
    //
    // Other stuff.
    //
    //---------------------------
    // Thing is pageless, we don't want boundaries on size or page breaks.
    pageless: true,
    // This is a demo game board (demo meaning it's an image of a game board, not
    // the board broken into pieces across pages for printing)
    demoBoard: true,
    // Can override page width.
    explicitPageWidth: true,

    // Extra class to apply to page_of_items div.
    extraClassesForPageOfItemsContents: true,
    explicitPageWidth: true,

    gridGap: true,

    // Print landscape.
    landscape: true,

    pageOfItemsContentsPaddingPx: true,

    // Add page numbers to bottom corner of page.
    addPageNumbers: true,
  };

  function sanityCheckConfigs(configs) {
    genericUtils.sanityCheckTable(configs, validSystemConfigKeys);
  }

  // This and all "Add" functions:
  // Take in optional default: this is what you start with.
  // Apply some values.
  // Use some standard value unless an override is passed in, then use that.
  function addCardSystemConfigs(opt_defaultSc, opt_overrides) {
    var defaultSc = opt_defaultSc ? opt_defaultSc : {};
    var overrides = opt_overrides ? opt_overrides : {};

    var cardWidthPx =
      overrides.cardWidthPx !== undefined
        ? overrides.cardWidthPx
        : genericMeasurements.standardCardWidthPx;
    var cardHeightPx = overrides.cardHeightPx
      ? overrides.cardHeightPx
      : genericMeasurements.standardCardHeightPx;

    var cardsPerPage =
      Math.floor(genericMeasurements.adjustedPageWidth / cardWidthPx) *
      Math.floor(genericMeasurements.adjustedPageHeight / cardHeightPx);

    var cardsPerRow = overrides.cardsPerRow
      ? overrides.cardsPerRow
      : Math.floor(genericMeasurements.adjustedPageWidth / cardWidthPx);

    outputSc = structuredClone(defaultSc);

    outputSc.cardsPerPage = cardsPerPage;
    outputSc.cardWidthPx = cardWidthPx;
    outputSc.cardHeightPx = cardHeightPx;
    outputSc.cardsPerRow = cardsPerRow;
    outputSc.cardBackFontSize = overrides.cardBackFontSize;
    outputSc.gridGap = genericMeasurements.standardPageGap;
    outputSc.isCards = true;
    debugLog(
      "SystemConfigs",
      "addCardSystemConfigs outputSc = " + JSON.stringify(outputSc)
    );

    return outputSc;
  }

  function addSmallCardSystemConfigs(opt_defaultSc, opt_overrides) {
    var defaultSc = opt_defaultSc ? opt_defaultSc : {};
    var overrides = opt_overrides ? opt_overrides : {};

    overrides.cardWidthPx =
      overrides.cardWidthPx !== undefined
        ? overrides.cardWidthPx
        : genericMeasurements.smallCardWidthPx;

    overrides.cardHeightPx =
      overrides.cardHeightPx !== undefined
        ? overrides.cardHeightPx
        : genericMeasurements.smallCardHeightPx;

    return addCardSystemConfigs(defaultSc, overrides);
  }

  function addLandscapeSystemConfigs(opt_defaultSc, opt_overrides) {
    var defaultSc = opt_defaultSc ? opt_defaultSc : {};
    var overrides = opt_overrides ? opt_overrides : {};

    var outputSc = structuredClone(defaultSc);

    outputSc.landscape =
      overrides.landscape !== undefined ? overrides.landscape : true;

    return outputSc;
  }

  function addTTSCardSystemConfigs(opt_defaultSc, opt_overrides) {
    var defaultSc = opt_defaultSc ? opt_defaultSc : {};
    var overrides = opt_overrides ? opt_overrides : {};

    var outputSc = addCardSystemConfigs(defaultSc, overrides);

    // Apply tweaks.
    debugLog(
      "SystemConfigs",
      "addTTSCardSystemConfigs: overrides = " + JSON.stringify(overrides)
    );
    outputSc.cardsPerRow = overrides.cardsPerRow
      ? overrides.cardsPerRow
      : genericMeasurements.ttsCardsPerRow;
    outputSc.pageless = true;
    outputSc.explicitPageWidth = overrides.cardsPerRow * outputSc.cardWidthPx;
    outputSc.skipCardBacks = true;
    outputSc.minCardCount = 12;
    outputSc.cardsPerPage = genericMeasurements.ttsCardsPerPage;
    outputSc.extraClassesForPageOfItemsContents = ["tts"];
    outputSc.gridGap = 0;
    outputSc.addPageNumbers = false;
    debugLog(
      "SystemConfigs",
      "addTTSCardSystemConfigs outputSc = " + JSON.stringify(outputSc)
    );

    return outputSc;
  }

  function addTTPCardSystemConfigs(opt_defaultSc, opt_overrides) {
    var defaultSc = opt_defaultSc ? opt_defaultSc : {};
    var overrides = opt_overrides ? opt_overrides : {};

    var outputSc = structuredClone(defaultSc);

    outputSc.cardsPerPage =
      overrides.cardsPerPage !== undefined
        ? overrides.cardsPerPage
        : genericMeasurements.ttpCardsPerPage;
    return outputSc;
  }

  function addTTSSmallCardSystemConfigs(opt_defaultSc, opt_overrides) {
    var defaultSc = opt_defaultSc ? opt_defaultSc : {};
    var overrides = opt_overrides ? opt_overrides : {};

    overrides.cardWidthPx =
      overrides.cardWidthPx !== undefined
        ? overrides.cardWidthPx
        : genericMeasurements.smallCardWidthPx;
    overrides.cardHeightPx =
      overrides.cardHeightPx !== undefined
        ? overrides.cardHeightPx
        : genericMeasurements.smallCardHeightPx;
    overrides.cardsPerRow =
      overrides.cardsPerRow !== undefined
        ? overrides.cardsPerRow
        : genericMeasurementsttsCardsPerRow;
    overrides.cardBackFontSize =
      overrides.cardBackFontSize !== undefined
        ? overrides.cardBackFontSize
        : genericMeasurements.smallCardBackFontSize;

    return addTTSCardSystemConfigs(defaultSc, overrides);
  }

  function addTTSDieSystemConfigs(opt_defaultSc, opt_overrides) {
    var defaultSc = opt_defaultSc ? opt_defaultSc : {};
    var overrides = opt_overrides ? opt_overrides : {};

    var outputSc = structuredClone(defaultSc);
    outputSc.pageless = true;
    outputSc.gridGap = 0;
    outputSc.isCards = false;
    return outputSc;
  }

  function addTileSystemConfigs(opt_defaultSc, opt_overrides) {
    var defaultSc = opt_defaultSc ? opt_defaultSc : {};
    var overrides = opt_overrides ? opt_overrides : {};

    var outputSc = structuredClone(defaultSc);
    outputSc.isCards = false;
    debugLog(
      "SystemConfigs",
      "addTileSystemConfigs: outputSc = " + JSON.stringify(outputSc)
    );
    return outputSc;
  }

  function setSystemConfigs(opt_sc) {
    var sc = opt_sc ? opt_sc : {};
    sanityCheckConfigs(sc);
    _systemConfigs = sc;
    // tts -> should avoid card backs.
    debugLog(
      "SystemConfigs",
      "_systemConfigs = " + JSON.stringify(_systemConfigs)
    );
  }

  function getSystemConfigs() {
    return _systemConfigs;
  }

  function getCardSystemConfigs(opt_overrides) {
    var queryParams = genericUtils.getCommonQueryParams();

    var sc;
    if (queryParams.isTTS) {
      debugLog("SystemConfigs", "getCardSystemConfigs: isTTS = true");
      debugLog(
        "SystemConfigs",
        "calling addTTSCardSystemConfigs with opt_overrides  = " +
          JSON.stringify(opt_overrides)
      );

      sc = addTTSCardSystemConfigs(null, opt_overrides);
      if (queryParams.isTTP) {
        sc = addTTPCardSystemConfigs(sc);
      }
    } else {
      sc = addCardSystemConfigs(null, opt_overrides);
      sc.skipCardBacks = queryParams.skipCardBacks;
    }
    sc.singleCardInstance = queryParams.singleCardInstance;
    return sc;
  }

  function getSmallCardSystemConfigs() {
    var queryParams = genericUtils.getCommonQueryParams();

    var sc;
    if (queryParams.isTTS) {
      sc = addTTSSmallCardSystemConfigs();
    } else {
      sc = addSmallCardSystemConfigs();
      sc.skipCardBacks = queryParams.skipCardBacks;
    }
    sc.singleCardInstance = queryParams.singleCardInstance;
    return sc;
  }

  // This returned object becomes the defined value of this module
  return {
    setSystemConfigs: setSystemConfigs,
    getSystemConfigs: getSystemConfigs,
    addCardSystemConfigs: addCardSystemConfigs,
    addSmallCardSystemConfigs: addSmallCardSystemConfigs,
    addTTSCardSystemConfigs: addTTSCardSystemConfigs,
    addTTSSmallCardSystemConfigs: addTTSSmallCardSystemConfigs,
    addTTSDieSystemConfigs: addTTSDieSystemConfigs,
    addTileSystemConfigs: addTileSystemConfigs,
    addLandscapeSystemConfigs: addLandscapeSystemConfigs,
    getCardSystemConfigs: getCardSystemConfigs,
    getSmallCardSystemConfigs: getSmallCardSystemConfigs,
  };
});
