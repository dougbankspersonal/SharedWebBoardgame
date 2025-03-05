define(["dojo/domReady!"], function () {
  var standardBorderWidth = 2;
  var pageOfItemsPaddingPx = 10;

  var printedPagePortraitWidth = 816;
  var printedPagePortraitHeight = 1056;
  var printedPageLandscapeWidth = printedPagePortraitHeight;
  var printedPageLandscapeHeight = printedPagePortraitWidth;

  return {
    standardBorderWidth: standardBorderWidth,
    pageOfItemsPaddingPx: pageOfItemsPaddingPx,
    printedPagePortraitWidth: printedPagePortraitWidth,
    printedPagePortraitHeight: printedPagePortraitHeight,
    printedPageLandscapeWidth: printedPageLandscapeWidth,
    printedPageLandscapeHeight: printedPageLandscapeHeight,
  };
});
