define(["dojo/domReady!"], function () {
  var debugFlags = {
    SantaCards: "on",
    Random: "off",
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
