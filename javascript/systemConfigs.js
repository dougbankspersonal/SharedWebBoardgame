//
// Model for setting system configs as we generate this or that page.
// Custom this boardgame module: the allowed configs have to do with questions of
// card size, how we print things, etc.
define(["sharedJavascript/genericUtils", "dojo/domReady!"], function (
  genericUtils
) {
  var systemConfigs = {};

  var validSystemConfigKeys = {
    ttsDie: true,
    ttsCards: true,
    demoBoard: true,
    skipBacks: true,
    smallCards: true,
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
