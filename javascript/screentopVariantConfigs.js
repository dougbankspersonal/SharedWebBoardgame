// Dice
export default function (variant, index) export default function(variant, index) {
  var gDieSides = 12;
  var adjustedIndex = index - 1;
  var assetIndex = adjustedIndex * gDieSides + 1;
  return {
    assetIndex: assetIndex,
  };
}

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

// Cards with n equal sized decks, card backs in front.
export default function(variant, index) {
  var gNumDecks = 4;
  var gCardsPerDeck = 48;

  var adjustedIndex = index - 1;
  var cardBackIndex = Math.floor(adjustedIndex / gCardsPerDeck) + 1;
  var cardFrontIndex = adjustedIndex + gNumDecks + 1;
  return {
    frontAssetIndex: cardFrontIndex,
    backAssetIndex: cardBackIndex,
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

// Score counters
export default function(variant, index) {

  var gExtraLightenedSeatColors = [
    "#f5cdcd",
    "#d7f7d7",
    "#f5f3ea",
    "#d4dbf7",
    "#f5dfd3",
    "#e6cef1",
    "#d7f7f7",
    "#f5f5f5",
  ];

  var gExtraDarkenedSeatColors = [
    "#58060d",
    "#0e420e",
    "#3f300d",
    "#081020",
    "#301d07",
    "#2f063f",
    "#0b4242",
    "#666666",
  ];
  return {
    fillColor: gExtraLightenedSeatColors[index-1],
    strokeColor: gExtraDarkenedSeatColors[index-1],
  };
}