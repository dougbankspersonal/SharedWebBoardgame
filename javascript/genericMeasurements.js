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

  const printedPagePortraitWidthPx = 816;
  const printedPagePortraitHeightPx = 1056;

  const printedPagePortraitWidthIn = 8.5;

  const pixelsPerInch = printedPagePortraitWidthPx / printedPagePortraitWidthIn;

  const standardCardWidthInches = 2.5;
  const standardCardHeightInches = 3.5;
  const standardCardWidthPx = standardCardWidthInches * pixelsPerInch;
  const standardCardHeightPx = standardCardHeightInches * pixelsPerInch;

  const triangleCardImageHeightPx = (standardCardWidthPx * Math.sqrt(3)) / 2;
  // We need to embed the card in a rect s.t. center of rect is centroid of card.
  // Centroid of triangle is 2/3 from top, down.
  // So I need a padding of extra 1/3 of height below the card.
  const triangleCardScreentopActualHeightPx = triangleCardImageHeightPx; // (triangleCardImageHeightPx * 4) / 3;

  const standardBorderWidthPx = 2;
  const pageOfItemsMarginPx = 10;
  const pageOfItemsCardsMarginPx = 40;

  const printedPageLandscapeWidthPx = printedPagePortraitHeightPx;
  const printedPageLandscapeHeightPx = printedPagePortraitWidthPx;
  const pagePadding = 10;

  const cardBackFontSize = standardCardWidthPx * 0.2;
  const cardBorderWidthPx = 5;

  const adjustedPageWidth = printedPagePortraitWidthPx - 2 * pagePadding;
  const adjustedPageHeight = printedPagePortraitHeightPx - 2 * pagePadding;
  const standardPageGap = 1;

  const cardFrontBorderWidthPx = 10;

  const cardColumnsPerPage = getNumberThatFitAccountingForGap(
    adjustedPageWidth,
    standardCardWidthPx,
    standardPageGap,
  );
  const cardRowsPerPage = getNumberThatFitAccountingForGap(
    adjustedPageHeight,
    standardCardHeightPx,
    standardPageGap,
  );

  const dieWidthPx = 150;
  const dieHeightPx = dieWidthPx;

  const dieFaceInches = 0.63;
  const physicalDieWidthPx = dieFaceInches * pixelsPerInch;
  const physicalDieHeightPx = physicalDieWidthPx;

  const smallCardWidthPx = 160;
  const smallCardHeightPx = 1.4 * smallCardWidthPx;
  const smallCardBackFontSize = 24;
  // Math is going bad here somehow, just be explicit.
  const smallCardsPerRow = 4;
  const smallCardsPerColumn = Math.floor(
    adjustedPageHeight / smallCardHeightPx,
  );

  const screentopitemsPerRow = 10;

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
    triangleCardImageHeightPx: triangleCardImageHeightPx,
    triangleCardScreentopActualHeightPx: triangleCardScreentopActualHeightPx,
    cardBackFontSize: cardBackFontSize,
    cardBorderWidthPx: cardBorderWidthPx,

    adjustedPageWidth: adjustedPageWidth,
    adjustedPageHeight: adjustedPageHeight,
    cardColumnsPerPage: cardColumnsPerPage,
    cardRowsPerPage: cardRowsPerPage,
    standardPageGap: standardPageGap,

    dieWidthPx: dieWidthPx,
    dieHeightPx: dieHeightPx,

    physicalDieWidthPx,
    physicalDieHeightPx,

    smallCardWidthPx: smallCardWidthPx,
    smallCardHeightPx: smallCardHeightPx,
    smallCardBackFontSize: smallCardBackFontSize,
    cardFrontBorderWidthPx: cardFrontBorderWidthPx,
    screentopitemsPerRow: screentopitemsPerRow,
  };
});
