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

  var standardBorderWidth = 2;
  var pageOfItemsPaddingPx = 10;

  var printedPageLandscapeWidth = printedPagePortraitHeightPx;
  var printedPageLandscapeHeight = printedPagePortraitWidthPx;
  var pagePadding = 10;

  var cardBackFontSize = standardCardWidthPx * 0.2;
  var cardBorderWidth = 5;

  var adjustedPageWidth = printedPagePortraitWidthPx - 2 * pagePadding;
  var adjustedPageHeight = printedPagePortraitHeightPx - 2 * pagePadding;
  var standardPageGap = 1;

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

  var dieWidth = 150;
  var dieHeight = dieWidth;

  return {
    getNumberThatFitAccountingForGap: getNumberThatFitAccountingForGap,

    standardBorderWidth: standardBorderWidth,
    pageOfItemsPaddingPx: pageOfItemsPaddingPx,
    printedPagePortraitWidthPx: printedPagePortraitWidthPx,
    printedPagePortraitHeightPx: printedPagePortraitHeightPx,
    printedPageLandscapeWidth: printedPageLandscapeWidth,
    printedPageLandscapeHeight: printedPageLandscapeHeight,
    standardCardWidthPx: standardCardWidthPx,
    standardCardHeightPx: standardCardHeightPx,
    cardBackFontSize: cardBackFontSize,
    cardBorderWidth: cardBorderWidth,

    adjustedPageWidth: adjustedPageWidth,
    adjustedPageHeight: adjustedPageHeight,
    cardColumnsPerPage: cardColumnsPerPage,
    cardRowsPerPage: cardRowsPerPage,
    cardsPerPage: cardsPerPage,
    ttsCardsPerPage: ttsCardsPerPage,
    standardPageGap: standardPageGap,

    dieWidth: dieWidth,
    dieHeight: dieHeight,
  };
});
