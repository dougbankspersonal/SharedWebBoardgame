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
    ScalingText: "off",
    ScoringTrack: "on",
    Special: "off",
    SystemConfigs: "off",
    Truck: "off",
  };

  function debugLog(flag, statement) {
    if (debugFlags[flag] == "on") {
      console.log(statement);
    }
  }

  return {
    debugLog: debugLog,
    debugFlags: debugFlags,
  };
});
