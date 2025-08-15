//
// Model for setting system configs as we generate this or that page.
// Custom this boardgame module: the allowed configs have to do with questions of
// card size, how we print things, etc.
define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (debugLog, genericMeasurements, genericUtils) {
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

  var ttsCardsPerRow = 10;

  function sanityCheckConfigs(configs) {
    genericUtils.sanityCheckTable(configs, validSystemConfigKeys);
  }

  function addCardSystemConfigs(opt_inputSc, opt_configs) {
    var inputSc = opt_inputSc ? opt_inputSc : {};
    var configs = opt_configs ? opt_configs : {};
    var cardWidthPx = configs.cardWidthPx
      ? configs.cardWidthPx
      : genericMeasurements.standardCardWidthPx;
    var cardHeightPx = configs.cardHeightPx
      ? configs.cardHeightPx
      : genericMeasurements.standardCardHeightPx;
    var cardsPerPage =
      Math.floor(genericMeasurements.adjustedPageWidth / cardWidthPx) *
      Math.floor(genericMeasurements.adjustedPageHeight / cardHeightPx);
    var cardsPerRow = configs.cardsPerRow
      ? configs.cardsPerRow
      : Math.floor(genericMeasurements.adjustedPageWidth / cardWidthPx);
    debugLog.debugLog(
      "Cards",
      "Doug: genericMeasurements.adjustedPageWidth = " +
        genericMeasurements.adjustedPageWidth
    );
    debugLog.debugLog("Cards", "Doug: cardWidthPx = " + cardWidthPx);
    debugLog.debugLog(
      "Cards",
      "Doug: genericMeasurements.adjustedPageHeight = " +
        genericMeasurements.adjustedPageHeight
    );
    debugLog.debugLog("Cards", "Doug: cardHeightPx = " + cardHeightPx);
    var outputSc = structuredClone(inputSc);
    outputSc.cardsPerPage = cardsPerPage;
    outputSc.cardWidthPx = cardWidthPx;
    outputSc.cardHeightPx = cardHeightPx;
    outputSc.cardsPerRow = cardsPerRow;
    outputSc.cardBackFontSize = configs.cardBackFontSize;
    outputSc.gridGap = genericMeasurements.standardPageGap;
    outputSc.isCards = true;

    return outputSc;
  }

  function addSmallCardSystemConfigs(opt_inputSc) {
    return addCardSystemConfigs(opt_inputSc, {
      cardWidthPx: genericMeasurements.smallCardWidthPx,
      cardHeightPx: genericMeasurements.smallCardHeightPx,
      cardsPerRow: genericMeasurements.smallCardsPerRow,
      cardBackFontSize: genericMeasurements.smallCardBackFontSize,
    });
  }

  function addLandscapeSystemConfigs(opt_inputSc) {
    var inputSc = opt_inputSc ? opt_inputSc : {};
    var outputSc = structuredClone(inputSc);
    outputSc.landscape = true;
    return outputSc;
  }

  function addTTSCardSystemConfigs(opt_inputSc, opt_configs) {
    var inputSc = opt_inputSc ? opt_inputSc : {};
    var configs = opt_configs ? opt_configs : {};

    var cardsPerRow = configs.cardsPerRow
      ? configs.cardsPerRow
      : ttsCardsPerRow;
    configs.cardsPerRow = cardsPerRow;
    var outputSc = addCardSystemConfigs(inputSc, configs);
    // Apply tweaks.
    outputSc.pageless = true;
    outputSc.explicitPageWidth = 10 * outputSc.cardWidthPx;
    outputSc.skipCardBacks = true;
    outputSc.minCardCount = 12;
    outputSc.cardsPerPage = genericMeasurements.ttsCardsPerPage;
    outputSc.extraClassesForPageOfItemsContents = ["tts"];
    outputSc.gridGap = 0;
    outputSc.isCards = true;
    outputSc.addPageNumbers = false;

    return outputSc;
  }

  function addTTPCardSystemConfigs(opt_inputSc) {
    var inputSc = opt_inputSc ? opt_inputSc : {};
    var outputSc = structuredClone(inputSc);
    outputSc.cardsPerPage = genericMeasurements.ttpCardsPerPage;
    return outputSc;
  }

  function addTTSSmallCardSystemConfigs(opt_inputSc) {
    return addTTSCardSystemConfigs(opt_inputSc, {
      cardWidthPx: genericMeasurements.smallCardWidthPx,
      cardHeightPx: genericMeasurements.smallCardHeightPx,
      cardsPerRow: ttsCardsPerRow,
      cardBackFontSize: genericMeasurements.smallCardBackFontSize,
    });
  }

  function addTTSDieSystemConfigs(opt_inputSc) {
    var inputSc = opt_inputSc ? opt_inputSc : {};
    var outputSc = structuredClone(inputSc);
    outputSc.pageless = true;
    outputSc.gridGap = 0;
    outputSc.isCards = false;
    return outputSc;
  }

  function addTileSystemConfigs(opt_inputSc) {
    var inputSc = opt_inputSc ? opt_inputSc : {};
    v;
    var outputSc = structuredClone(inputSc);
    outputSc.isCards = false;
    debugLog.debugLog(
      "SystemConfigs",
      "Doug: addTileSystemConfigs: outputSc = " + JSON.stringify(outputSc)
    );
    return outputSc;
  }

  function setSystemConfigs(opt_sc) {
    var sc = opt_sc ? opt_sc : {};
    sanityCheckConfigs(sc);
    _systemConfigs = sc;
    // tts -> should avoid card backs.
    debugLog.debugLog(
      "SystemConfigs",
      "Doug: _systemConfigs = " + JSON.stringify(_systemConfigs)
    );
  }

  function getSystemConfigs() {
    return _systemConfigs;
  }

  function getCardSystemConfigs() {
    var queryParams = genericUtils.getCommonQueryParams();

    var sc;
    if (queryParams.isTTS) {
      sc = addTTSCardSystemConfigs();
      if (queryParams.isTTP) {
        sc = addTTPCardSystemConfigs(sc);
      }
    } else {
      sc = addCardSystemConfigs();
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

    ttsCardsPerRow: ttsCardsPerRow,
  };
});
