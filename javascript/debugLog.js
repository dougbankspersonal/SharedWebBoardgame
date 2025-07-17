define(["dojo/domReady!"], function () {
  var debugFlags = {
    Belts: "off",
    BoxHolderCards: "off",
    Cards: "on",
    CardConfigs: "off",
    CardCount: "off",
    CardSize: "off",
    ConveyorTiles: "off",
    Dice: "off",
    GameBoard: "off",
    Highlight: "off",
    Layout: "off",
    Machines: "off",
    Markers: "off",
    ParamCards: "off",
    Random: "off",
    Refactor: "off",
    ScalingText: "off",
    ScoringTrack: "off",
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
