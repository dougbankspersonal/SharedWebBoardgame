define(["dojo/domReady!"], function () {
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

  var cardColumnsPerPage = Math.floor(adjustedPageWidth / cardWidth);
  var cardRowsPerPage = Math.floor(adjustedPageHeight / cardHeight);
  var cardsPerPage = cardColumnsPerPage * cardRowsPerPage;

  return {
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
  };
});
