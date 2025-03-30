define(["dojo/domReady!"], function () {
  var debugFlags = {
    Belts: "off",
    BoxRobotCards: "off",
    Cards: "off",
    CardConfigs: "off",
    CardCount: "off",
    CardSize: "off",
    Layout: "off",
    Machines: "off",
    Markers: "off",
    Random: "off",
    Refactor: "off",
    SantaCards: "off",
    Special: "off",
    SystemConfigs: "off",
    Truck: "on",
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
