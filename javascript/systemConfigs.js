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
    // How many cards before we add a page break?
    cardsPerPage: true,

    // Alt size of cards.
    cardWidth: true,
    cardHeight: true,
    cardBackFontSize: true,

    // Thing is pageless, we don't want boundaries on size or page breaks.
    pageless: true,
    // Can override page width.
    explicitPageWidth: true,

    // For cards, no margin around them.
    cardsNoMargin: true,
    // Extra class to apply to page_of_items div.
    extraClassesForPageOfItemsContents: true,
    explicitPageWidth: true,

    gridGap: true,

    // Do not render card backs.
    skipCardBacks: true,

    // Print landscape.
    landscape: true,

    // Do all card fronts separate from backs: we are not gonna print double sided,
    // we print fronts and backs and then stick em together.
    separateBacks: true,

    // TTS requires at least 12 cards.
    minCardCount: true,
    // Sometimes we just want one of each type of card, no dups.
    singleCardInstance: true,

    pageOfItemsContentsPaddingPx: true,

    // Add page numbers to bottom corner of page.
    addPageNumbers: true,
  };

  function sanityCheckConfigs(configs) {
    genericUtils.sanityCheckTable(configs, validSystemConfigKeys);
  }

  function addCardSizingSystemConfigs(
    opt_cardWidth,
    opt_cardHeight,
    opt_cardBackFontSize,
    opt_scInput
  ) {
    var sc = opt_scInput ? opt_scInput : {};
    var cardWidth = opt_cardWidth
      ? opt_cardWidth
      : genericMeasurements.cardWidth;
    var cardHeight = opt_cardHeight
      ? opt_cardHeight
      : genericMeasurements.cardHeight;
    var cardsPerPage =
      Math.floor(genericMeasurements.adjustedPageWidth / cardWidth) *
      Math.floor(genericMeasurements.adjustedPageHeight / cardHeight);
    sc.cardsPerPage = cardsPerPage;
    sc.cardWidth = cardWidth;
    sc.cardHeight = cardHeight;
    sc.cardBackFontSize = opt_cardBackFontSize;
    sc.gridGap = genericMeasurements.cardGap;
    sc.addPageNumbers = true;

    return sc;
  }

  function addTTSCardSystemConfigs(
    opt_cardWidth,
    opt_cardHeight,
    opt_cardBackFontSize,
    opt_scInput
  ) {
    var sc = addCardSizingSystemConfigs(
      opt_cardWidth,
      opt_cardHeight,
      opt_cardBackFontSize,
      opt_scInput
    );
    // Apply tweaks.
    sc.pageless = true;
    sc.explicitPageWidth = 10 * sc.cardWidth;
    sc.skipCardBacks = true;
    sc.minCardCount = 12;
    sc.cardsPerPage = genericMeasurements.ttsCardsPerPage;
    sc.extraClassesForPageOfItemsContents = ["tts"];
    sc.gridGap = 0;
    return sc;
  }

  function addTTSDieSystemConfigs(opt_scInput) {
    var sc = opt_scInput ? opt_scInput : {};
    sc.pageless = true;
    sc.gridGap = 0;
    sc.explicitPageWidth = 3 * genericMeasurements.dieWidth;
    return sc;
  }

  function addGameBoardSystemConfigs(opt_scInput) {
    var sc = opt_scInput ? opt_scInput : {};
    sc.gridGap = 0;
    sc.extraClassesForPageOfItemsContents = ["tts"];
    return sc;
  }

  function addTileSystemConfigs(gridGap, opt_scInput) {
    var sc = opt_scInput ? opt_scInput : {};
    sc.gridGap = gridGap;
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

  // This returned object becomes the defined value of this module
  return {
    setSystemConfigs: setSystemConfigs,
    getSystemConfigs: getSystemConfigs,
    addCardSizingSystemConfigs: addCardSizingSystemConfigs,
    addTTSCardSystemConfigs: addTTSCardSystemConfigs,
    addTTSDieSystemConfigs: addTTSDieSystemConfigs,
    addGameBoardSystemConfigs: addGameBoardSystemConfigs,
    addTileSystemConfigs: addTileSystemConfigs,
  };
});
