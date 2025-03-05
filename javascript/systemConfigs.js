//
// Model for setting system configs as we generate this or that page.
// Custom this boardgame module: the allowed configs have to do with questions of
// card size, how we print things, etc.
define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (debugLog, genericUtils) {
  var _systemConfigs = {};

  var validSystemConfigKeys = {
    // We are generating a png file for rules or whatever:
    // a board with game state.
    demoBoard: true,
    // Print landscape.
    landscape: true,
    // Making png image we can import for TTS to make a deck of cards.
    ttsCards: true,
    // Making png image we can import for TTS to make a die.
    ttsDie: true,
    // Do not render card backs.
    skipBacks: true,
    // Do all card fronts separate from backs: we are not gonna print double sided,
    // we print fronts and backs and then stick em together.
    separateBacks: true,
    // Alt size of cards.
    altCardWidth: true,
    altCardHeight: true,
    altCardBackFontSize: true,
  };

  function sanityCheckConfigs(configs) {
    genericUtils.sanityCheckTable(configs, validSystemConfigKeys);
  }

  function setSystemConfigs(sc) {
    sanityCheckConfigs(sc);
    _systemConfigs = sc;
    // tts -> should avoid card backs.
    debugLog.debugLog(
      "Refactor",
      "Doug: _systemConfigs = ",
      JSON.stringify(_systemConfigs)
    );
    if (_systemConfigs.ttsCards) {
      _systemConfigs.skipBacks = true;
    }
  }

  function getSystemConfigs() {
    return _systemConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    setSystemConfigs: setSystemConfigs,
    getSystemConfigs: getSystemConfigs,
  };
});
