define(["dojo/domReady!"], function () {
  var debugFlags = {
    SantaCards: "off",
    Random: "off",
    Refactor: "on",
    BoxRobotCards: "off",
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
