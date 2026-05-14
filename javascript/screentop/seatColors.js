// Given a piece type and a style, return a list of specific item names.
// E.g. a "Top" in "[parameters.Boho]" style might be a "Peasant Blouse", "Tunic Top", or "Off-the-Shoulder Top".
define(["javascript/parameters", "dojo/domReady!"], function (parameters) {
  var seatColors = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#ffffff",
  ];

  return {
    seatColors: seatColors,
  };
});
