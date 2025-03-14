define(["dojo/domReady!"], function () {
  var debugFlags = {
    Cards: "off",
    CardConfigs: "off",
    CardCount: "on",
    Layout: "off",
    Random: "off",
    Refactor: "off",
    SantaCards: "off",
    Special: "off",
    SystemConfigs: "off",
  };

  function debugLog(flag, statement) {
    if (debugFlags[flag] == "on") {
      console.log(statement);
    }
  }

  return {
    debugLog: debugLog,
  };
});
