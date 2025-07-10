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

  function addCardSizingSystemConfigs(
    opt_cardWidthPx,
    opt_cardHeightPx,
    opt_cardsPerRow,
    opt_cardBackFontSize,
    opt_scInput
  ) {
    var sc = opt_scInput ? opt_scInput : {};
    var cardWidthPx = opt_cardWidthPx
      ? opt_cardWidthPx
      : genericMeasurements.standardCardWidthPx;
    var cardHeightPx = opt_cardHeightPx
      ? opt_cardHeightPx
      : genericMeasurements.standardCardHeightPx;
    var cardsPerPage =
      Math.floor(genericMeasurements.adjustedPageWidth / cardWidthPx) *
      Math.floor(genericMeasurements.adjustedPageHeight / cardHeightPx);
    var cardsPerRow = opt_cardsPerRow
      ? opt_cardsPerRow
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
    sc.cardsPerPage = cardsPerPage;
    sc.cardWidthPx = cardWidthPx;
    sc.cardHeightPx = cardHeightPx;
    sc.cardsPerRow = cardsPerRow;
    sc.cardBackFontSize = opt_cardBackFontSize;
    sc.gridGap = genericMeasurements.standardPageGap;
    sc.isCards = true;

    return sc;
  }

  function addSmallCardSizingSystemConfigs(opt_scInput) {
    return addCardSizingSystemConfigs(
      genericMeasurements.smallCardWidthPx,
      genericMeasurements.smallCardHeightPx,
      genericMeasurements.smallCardsPerRow,
      genericMeasurements.smallCardBackFontSize,
      opt_scInput
    );
  }

  function addLandscapeSystemConfigs(opt_scInput) {
    var sc = opt_scInput ? opt_scInput : {};
    sc.landscape = true;

    return sc;
  }

  function addTTSCardSystemConfigs(
    opt_cardWidth,
    opt_cardHeight,
    opt_cardsPerRow,
    opt_cardBackFontSize,
    opt_scInput
  ) {
    var cardsPerRow = opt_cardsPerRow ? opt_cardsPerRow : ttsCardsPerRow;
    var sc = addCardSizingSystemConfigs(
      opt_cardWidth,
      opt_cardHeight,
      cardsPerRow,
      opt_cardBackFontSize,
      opt_scInput
    );
    // Apply tweaks.
    sc.pageless = true;
    sc.explicitPageWidth = 10 * sc.cardWidthPx;
    sc.skipCardBacks = true;
    sc.minCardCount = 12;
    sc.cardsPerPage = genericMeasurements.ttsCardsPerPage;
    sc.extraClassesForPageOfItemsContents = ["tts"];
    sc.gridGap = 0;
    sc.isCards = true;
    sc.addPageNumbers = false;

    return sc;
  }

  function addSmallCardTTSCardSystemConfigs(opt_scInput) {
    return addTTSCardSystemConfigs(
      genericMeasurements.smallCardWidthPx,
      genericMeasurements.smallCardHeightPx,
      ttsCardsPerRow,
      genericMeasurements.smallCardBackFontSize,
      opt_scInput
    );
  }

  function addTTSDieSystemConfigs(opt_scInput) {
    var sc = opt_scInput ? opt_scInput : {};
    sc.pageless = true;
    sc.gridGap = 0;
    sc.isCards = false;
    return sc;
  }

  function addTileSystemConfigs(opt_scInput) {
    var sc = opt_scInput ? opt_scInput : {};
    sc.isCards = false;
    debugLog.debugLog(
      "SystemConfigs",
      "Doug: addTileSystemConfigs: sc = " + JSON.stringify(sc)
    );
    return sc;
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
    } else {
      sc = addCardSizingSystemConfigs();
      sc.skipCardBacks = queryParams.skipCardBacks;
    }
    sc.singleCardInstance = queryParams.singleCardInstance;
    return sc;
  }

  // This returned object becomes the defined value of this module
  return {
    setSystemConfigs: setSystemConfigs,
    getSystemConfigs: getSystemConfigs,
    addCardSizingSystemConfigs: addCardSizingSystemConfigs,
    addSmallCardSizingSystemConfigs: addSmallCardSizingSystemConfigs,
    addTTSCardSystemConfigs: addTTSCardSystemConfigs,
    addSmallCardTTSCardSystemConfigs: addSmallCardTTSCardSystemConfigs,
    addTTSDieSystemConfigs: addTTSDieSystemConfigs,
    addTileSystemConfigs: addTileSystemConfigs,
    addLandscapeSystemConfigs: addLandscapeSystemConfigs,
    getCardSystemConfigs: getCardSystemConfigs,

    ttsCardsPerRow: ttsCardsPerRow,
  };
});
