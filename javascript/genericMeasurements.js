define(["dojo/domReady!"], function () {
  function getNumberThatFitAccountingForGap(containerWidth, itemWidth, gap) {
    var total = 0;
    var count = 0;
    while (1) {
      if (total == 0) {
        total += itemWidth;
      } else {
        total += itemWidth + gap;
      }
      if (total > containerWidth) {
        break;
      } else {
        count++;
      }
    }
    return count;
  }

  var printedPagePortraitWidthPx = 816;
  var printedPagePortraitHeightPx = 1056;

  var printedPagePortraitWidthIn = 8.5;

  var pixelsPerInch = printedPagePortraitWidthPx / printedPagePortraitWidthIn;

  var standardCardWidthInches = 2.5;
  var standardCardHeightInches = 3.5;
  var standardCardWidthPx = standardCardWidthInches * pixelsPerInch;
  var standardCardHeightPx = standardCardHeightInches * pixelsPerInch;

  var triangleCardHeightPx = (standardCardWidthPx * Math.sqrt(3)) / 2;

  var standardBorderWidthPx = 2;
  var pageOfItemsMarginPx = 10;
  var pageOfItemsCardsMarginPx = 40;

  var printedPageLandscapeWidthPx = printedPagePortraitHeightPx;
  var printedPageLandscapeHeightPx = printedPagePortraitWidthPx;
  var pagePadding = 10;

  var cardBackFontSize = standardCardWidthPx * 0.2;
  var cardBorderWidthPx = 5;

  var adjustedPageWidth = printedPagePortraitWidthPx - 2 * pagePadding;
  var adjustedPageHeight = printedPagePortraitHeightPx - 2 * pagePadding;
  var standardPageGap = 1;

  var cardFrontBorderWidthPx = 10;

  var cardColumnsPerPage = getNumberThatFitAccountingForGap(
    adjustedPageWidth,
    standardCardWidthPx,
    standardPageGap
  );
  var cardRowsPerPage = getNumberThatFitAccountingForGap(
    adjustedPageHeight,
    standardCardHeightPx,
    standardPageGap
  );
  var cardsPerPage = cardColumnsPerPage * cardRowsPerPage;

  var ttsCardsPerPage = 70;
  // FIXME(dbanks) is there a limit?
  var ttpCardsPerPage = 1000;

  var dieWidthPx = 150;
  var dieHeightPx = dieWidthPx;

  var dieFaceInches = 0.63;
  var physicalDieWidthPx = dieFaceInches * pixelsPerInch;
  var physicalDieHeightPx = physicalDieWidthPx;

  var smallCardWidthPx = 160;
  var smallCardHeightPx = 1.4 * smallCardWidthPx;
  var smallCardBackFontSize = 24;
  // Math is going bad here somehow, just be explicit.
  var smallCardsPerRow = 4;
  var smallCardsPerColumn = Math.floor(adjustedPageHeight / smallCardHeightPx);
  var smallCardsPerPage = smallCardsPerRow * smallCardsPerColumn;

  var ttsCardsPerRow = 10;

  return {
    getNumberThatFitAccountingForGap: getNumberThatFitAccountingForGap,

    standardBorderWidthPx: standardBorderWidthPx,
    pageOfItemsMarginPx: pageOfItemsMarginPx,
    pageOfItemsCardsMarginPx: pageOfItemsCardsMarginPx,
    printedPagePortraitWidthPx: printedPagePortraitWidthPx,
    printedPagePortraitHeightPx: printedPagePortraitHeightPx,
    printedPageLandscapeWidthPx: printedPageLandscapeWidthPx,
    printedPageLandscapeHeightPx: printedPageLandscapeHeightPx,
    standardCardWidthPx: standardCardWidthPx,
    standardCardHeightPx: standardCardHeightPx,
    triangleCardHeightPx: triangleCardHeightPx,
    cardBackFontSize: cardBackFontSize,
    cardBorderWidthPx: cardBorderWidthPx,

    adjustedPageWidth: adjustedPageWidth,
    adjustedPageHeight: adjustedPageHeight,
    cardColumnsPerPage: cardColumnsPerPage,
    cardRowsPerPage: cardRowsPerPage,
    cardsPerPage: cardsPerPage,
    ttsCardsPerPage: ttsCardsPerPage,
    ttpCardsPerPage: ttpCardsPerPage,
    standardPageGap: standardPageGap,

    dieWidthPx: dieWidthPx,
    dieHeightPx: dieHeightPx,

    physicalDieWidthPx,
    physicalDieHeightPx,

    smallCardWidthPx: smallCardWidthPx,
    smallCardHeightPx: smallCardHeightPx,
    smallCardsPerRow: smallCardsPerRow,
    smallCardBackFontSize: smallCardBackFontSize,
    smallCardsPerPage: smallCardsPerPage,
    cardFrontBorderWidthPx: cardFrontBorderWidthPx,
    ttsCardsPerRow: ttsCardsPerRow,
  };
});
