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

  var standardBorderWidth = 2;
  var pageOfItemsPaddingPx = 10;

  var printedPagePortraitWidth = 816;
  var printedPagePortraitHeight = 1056;
  var printedPageLandscapeWidth = printedPagePortraitHeight;
  var printedPageLandscapeHeight = printedPagePortraitWidth;
  var pagePadding = 10;

  var cardWidth = 224;
  var cardHeight = 314;
  var cardBackFontSize = cardWidth * 0.2;
  var cardBorderWidth = 5;

  var adjustedPageWidth = printedPagePortraitWidth - 2 * pagePadding;
  var adjustedPageHeight = printedPagePortraitHeight - 2 * pagePadding;
  var standardPageGap = 1;

  var cardColumnsPerPage = getNumberThatFitAccountingForGap(
    adjustedPageWidth,
    cardWidth,
    standardPageGap
  );
  var cardRowsPerPage = getNumberThatFitAccountingForGap(
    adjustedPageHeight,
    cardHeight,
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
    printedPagePortraitWidth: printedPagePortraitWidth,
    printedPagePortraitHeight: printedPagePortraitHeight,
    printedPageLandscapeWidth: printedPageLandscapeWidth,
    printedPageLandscapeHeight: printedPageLandscapeHeight,
    cardWidth: cardWidth,
    cardHeight: cardHeight,
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
