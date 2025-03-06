define(["dojo/domReady!"], function () {
  var debugFlags = {
    BoxRobotCards: "off",
    Cards: "on",
    Layout: "off",
    Random: "off",
    Refactor: "off",
    SantaCards: "off",
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
