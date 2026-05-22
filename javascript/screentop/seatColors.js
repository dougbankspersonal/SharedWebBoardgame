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
    "#aaaaaa",
  ];

  var lightenedSeatColors = [
    "#f28b8b",
    "#7ed77e",
    "#ffed8b",
    "#7a8fe0",
    "#f9b28b",
    "#c48de0",
    "#7ef0f0",
    "#cccccc",
  ];

  var darkenedSeatColors = [
    "#b30f1c",
    "#1f7a1f",
    "#ffb300",
    "#1f3a7a",
    "#b36f1f",
    "#5c0e7a",
    "#1f7e7e",
    "#666666",
  ];

  return {
    seatColors: seatColors,
  };
});
