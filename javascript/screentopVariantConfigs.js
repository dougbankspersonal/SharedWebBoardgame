//-------------------------
// Grid of anchors
//-------------------------
export default function(anchor, index) {
  var anchorsPerRow = 3;
  var initialX = -276;
  var initialY = 39;
  var xStep = 276;
  var yStep = 396;

  var adjustedIndex = index - 1;
  var x = initialX + (adjustedIndex % anchorsPerRow) * xStep;
  var y = initialY + Math.floor(adjustedIndex / anchorsPerRow) * yStep;

  return {
    x: x,
    y: y
  };
}

//-------------------------------
//
// Dice
//
//-------------------------------
export default function(variant, index) {
  var gDieSides = 12;
  var zBasedIndex = index - 1;
  var assetIndex = zBasedIndex * gDieSides + 1;
  return {
    assetIndex: assetIndex,
  };
}

//-------------------------------
//
// Tokens
//
//-------------------------------
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

//-------------------------------
//
// Cards with n equal sized decks, card backs in front.
//
//-------------------------------
export default function(variant, index) {
  var gNumDecks = 1;
  var gCardsPerDeck = 54;

  var zBasedIndex = index - 1;
  var cardBackIndex = Math.floor(zBasedIndex / gCardsPerDeck) + 1;
  var cardFrontIndex = zBasedIndex + gNumDecks + 1;
  return {
    frontAssetIndex: cardFrontIndex,
    backAssetIndex: cardBackIndex,
  };
}

//-------------------------------
//
// Cards with n equal sized decks, card backs in front.
//
//-------------------------------

//-------------------------------
//
// Seats
//
//-------------------------------
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

//-------------------------------
//
// Card holders/containers
//
//-------------------------------
export default function(variant, index) {
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
  var fillColor = gExtraLightenedSeatColors[index-1];
  return {
    baseFillColor: fillColor,
    coverFillColor: fillColor,
  };
}

//-------------------------------
//
// Score counters.
//
//-------------------------------
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

// Tokens.
// n families of token.
// Each token: first token is "token back".
// Next tokensPerFamily are different fronts for the family.
export default function(variant, index) {
  var numTokensPerFamily = 3;
  // Back counts as one.
  var numTokenImagesPerFamily = numTokensPerFamily + 1;
  // 0-based index of back of first token family.
  var firstBackZBasedIndex = 0;
  // 0-based index of this token.
  var zIndex = index-1;
  // Which family are we dealing with?
  var familyIndex = Math.floor(zIndex / numTokensPerFamily);
  // backIndex: first item in this family.
  var zBackIndex = familyIndex * numTokenImagesPerFamily;
  // front Index: nth utem after floor index.
  var zFrontIndex = zBackIndex + 1 + (zIndex % numTokensPerFamily);

  return {
    frontAssetIndex: zFrontIndex + 1,
    backAssetIndex: zBackIndex + 1,
  };
}

// Objects owned by seat and admin.
export default function(object, index) {
  var indexAsString = index.toString();
  return {
    "tag": indexAsString,
    "variant": "Variant " + indexAsString,
    "seats": [
      "Seat " + indexAsString,
      "Admin"
    ],
    "viewPolicy": "ALLOW_SEATS",
  };
}