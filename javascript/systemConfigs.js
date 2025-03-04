//
// Model for setting system configs as we generate this or that page.
// Custom this boardgame module: the allowed configs have to do with questions of
// card size, how we print things, etc.
define(["sharedJavascript/genericUtils", "dojo/domReady!"], function (
  genericUtils
) {
  var systemConfigs = {};

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
    // Mini playing cards.
    smallCards: true,
    // Mini squares.
    smallSquares: true,
  };

  function sanityCheckConfigs(configs) {
    genericUtils.sanityCheckTable(configs, validSystemConfigKeys);
  }

  function setSystemConfigs(c) {
    sanityCheckConfigs(c);
    systemConfigs = c;
    // tts -> should avoid card backs.
    if (systemConfigs.ttsCards) {
      systemConfigs.skipBacks = true;
    }
  }

  function getSystemConfigs() {
    return systemConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    setSystemConfigs: setSystemConfigs,
    getSystemConfigs: getSystemConfigs,
  };
});
