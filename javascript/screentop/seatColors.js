// Given a piece type and a style, return a list of specific item names.
// E.g. a "Top" in "[parameters.Boho]" style might be a "Peasant Blouse", "Tunic Top", or "Off-the-Shoulder Top".
define(["dojo/domReady!"], function () {
  const gSeatColors = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#aaaaaa",
  ];

  const gLightenedSeatColors = [
    "#f28b8b",
    "#7ed77e",
    "#ffed8b",
    "#7a8fe0",
    "#f9b28b",
    "#c48de0",
    "#7ef0f0",
    "#cccccc",
  ];

  const gExtraLightenedSeatColors = [
    "#f5cdcd",
    "#d7f7d7",
    "#f5f3ea",
    "#d4dbf7",
    "#f5dfd3",
    "#e6cef1",
    "#d7f7f7",
    "#f5f5f5",
  ];

  const gDarkenedSeatColors = [
    "#b30f1c",
    "#1f7a1f",
    "#ffb300",
    "#1f3a7a",
    "#b36f1f",
    "#5c0e7a",
    "#1f7e7e",
    "#666666",
  ];

  const gExtraDarkenedSeatColors = [
    "#58060d",
    "#0e420e",
    "#3f300d",
    "#081020",
    "#301d07",
    "#2f063f",
    "#0b4242",
    "#666666",
  ];

  function getLightColorFamilyForSeat(seatIndex) {
    var colorFamily = {};
    colorFamily.gradient1 = gLightenedSeatColors[seatIndex];
    colorFamily.gradient2 = gExtraLightenedSeatColors[seatIndex];
    colorFamily.border = gExtraDarkenedSeatColors[seatIndex];
    colorFamily.font = gExtraDarkenedSeatColors[seatIndex];
    return colorFamily;
  }

  function getMediumColorFamilyForSeat(seatIndex) {
    var colorFamily = {};
    colorFamily.gradient1 = gSeatColors[seatIndex];
    colorFamily.gradient2 = gLightenedSeatColors[seatIndex];
    colorFamily.border = gExtraDarkenedSeatColors[seatIndex];
    colorFamily.font = gExtraDarkenedSeatColors[seatIndex];
    return colorFamily;
  }

  return {
    seatColors: gSeatColors,
    lightenedSeatColors: gLightenedSeatColors,
    darkenedSeatColors: gDarkenedSeatColors,
    extraDarkenedSeatColors: gExtraDarkenedSeatColors,
    extraLightenedSeatColors: gExtraLightenedSeatColors,
    getLightColorFamilyForSeat: getLightColorFamilyForSeat,
    getMediumColorFamilyForSeat: getMediumColorFamilyForSeat,
  };
});
