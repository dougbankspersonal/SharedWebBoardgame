// Tokens
export default function (variant, index) {
  const gExtraLightenedSeatColors = [
    "#f5cdcd",
    "#d7f7d7",
    "#f5f3ea",
    "#d4dbf7",
    "#f5dfd3",
    "#e6cef1",
  ];

  var gNumSeatColors = 6;

  var zeroBasedIndex = index - 1;
  var colorIndex = zeroBasedIndex % gNumSeatColors;
  var tokenIndex = Math.floor(zeroBasedIndex / gNumSeatColors);

  return {
    frontFillColor: gExtraLightenedSeatColors[colorIndex],
    frontAssetIndex:  tokenIndex + 1
  };
}

// Cards
export default function(variant, index) {
  return {
    frontAssetIndex: index + 1,
  };
}

// Seats
export default function(seat, index) {
    var gSeatColors = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#aaaaaa",
  ];
  return {
    color: gSeatColors[index-1],

  };
}

// Card holders.
export default function(variant, index) {
    var gLightenedSeatColors = [
    "#f28b8b",
    "#7ed77e",
    "#ffed8b",
    "#7a8fe0",
    "#f9b28b",
    "#c48de0",
    "#7ef0f0",
    "#cccccc",
  ];
  return {
    baseFillColor: gLightenedSeatColors[index-1],
  };
}
