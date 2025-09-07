define([
  "dojo/string",
  "dojo/dom",
  "dojo/dom-style",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/systemConfigs",
  "dojo/domReady!",
], function (
  string,
  dom,
  domStyle,
  debugLogModule,
  genericMeasurements,
  genericUtils,
  htmlUtils,
  systemConfigs
) {
  var debugLog = debugLogModule.debugLog;

  function setCardSize(node) {
    var sc = systemConfigs.getSystemConfigs();
    debugLog("CardSize", "setCardSize sc.cardHeightPx = ", sc.cardHeightPx);
    debugLog("CardSize", "setCardSize sc.cardWidthPx = ", sc.cardWidthPx);
    var cardWidthPx = sc.cardWidthPx
      ? sc.cardWidthPx
      : genericMeasurements.standardCardWidthPx;
    var cardHeightPx = sc.cardHeightPx
      ? sc.cardHeightPx
      : genericMeasurements.standardCardHeightPx;

    domStyle.set(node, {
      width: `${cardWidthPx}px`,
      height: `${cardHeightPx}px`,
    });
  }

  function addPageOfCards(parent, opt_classArray) {
    var classes = genericUtils.growOptStringArray(
      opt_classArray,
      "page_of_cards"
    );
    return htmlUtils.addPageOfItems(parent, classes);
  }

  function addRowOfCards(parent, opt_isCardBack) {
    var classes = ["row_of_cards"];
    if (opt_isCardBack) {
      classes.push("row_of_cards_back");
    }
    return htmlUtils.addDiv(parent, classes, "rowOfCards");
  }

  function addCardBack(parent, index, backConfig) {
    debugLog("Cards", "addCardBack backConfig = " + JSON.stringify(backConfig));

    var cardsPerRow = systemConfigs.getSystemConfigs().cardsPerRow;
    debugLog("Cards", "addCardBack cardsPerRow = " + cardsPerRow);
    debugLog("Cards", "addCardBack index = " + index);

    if (backConfig.callback) {
      console.assert(
        typeof backConfig.callback,
        "function",
        "Expected backConfig.callback function"
      );
      return backConfig.callback(parent, index);
    }

    var sc = systemConfigs.getSystemConfigs();
    var classes = backConfig.classes ? backConfig.classes : [];
    classes = classes.slice();
    classes.push("back");
    var cardBackNode = htmlUtils.addCard(parent, classes, "back");
    setCardSize(cardBackNode);

    if (backConfig.hexColorString) {
      var otherColor = htmlUtils.blendHexColors(
        backConfig.hexColorString,
        "#ffffff"
      );
      var gradient = string.substitute(
        "radial-gradient(${color1}, ${color2})",
        {
          color1: otherColor,
          color2: backConfig.hexColorString,
        }
      );
      domStyle.set(cardBackNode, "background", gradient);
    }

    if (backConfig.title) {
      var titleNode = htmlUtils.addDiv(
        cardBackNode,
        ["title"],
        "title",
        backConfig.title
      );
      var style = {};
      debugLog("Cards", "addCardBack sc = " + JSON.stringify(sc));
      style["font-size"] = sc.cardBackFontSize
        ? `${sc.cardBackFontSize}px`
        : `${genericMeasurements.cardBackFontSize}px`;
      domStyle.set(titleNode, style);
    }

    return cardBackNode;
  }

  function addCardFront(parent, classArray, id) {
    console.assert(parent, "parent is null");
    classArray.push("front");
    var node = htmlUtils.addCard(parent, classArray, id);
    setCardSize(node);

    return node;
  }

  function maybeNewPage(parent, currentPage, index) {
    debugLog("Cards", "maybeNewPage index = " + index.toString());
    var cardsPerPage = systemConfigs.getSystemConfigs().cardsPerPage;
    var needNew = index % cardsPerPage;
    if (needNew == 0) {
      debugLog(
        "Cards",
        "maybeNewPage adding new page for index = " + index.toString()
      );
      return addPageOfCards(parent);
    }
    return currentPage;
  }

  function maybeNewRow(parent, currentRow, index, opt_isCardBack) {
    var cardsPerRow = systemConfigs.getSystemConfigs().cardsPerRow;
    var needNew = index % cardsPerRow;
    if (needNew == 0) {
      debugLog(
        "Cards",
        "NewCardFu adding new row for index = " + index.toString()
      );
      return addRowOfCards(parent, opt_isCardBack);
    }
    return currentRow;
  }

  function addNthCard(
    bodyNode,
    pageOfCards,
    rowOfCards,
    addNthCardCallback,
    index,
    opt_isCardBack
  ) {
    debugLog("Cards", "addNthCard index = " + index.toString());
    pageOfCards = maybeNewPage(bodyNode, pageOfCards, index);
    console.assert(pageOfCards, "pageOfCards is null");
    rowOfCards = maybeNewRow(pageOfCards, rowOfCards, index, opt_isCardBack);
    console.assert(rowOfCards, "rowOfCards is null");
    var card = addNthCardCallback(rowOfCards, index);
    return [pageOfCards, rowOfCards, card];
  }

  function addCards(numCards, frontCallback, backConfig) {
    var sc = systemConfigs.getSystemConfigs();

    debugLog("Cards", "addCards: sc = " + JSON.stringify(sc));
    debugLog("Cards", "addCards: numCards = " + numCards);
    // Better be in cards mode.
    console.assert(sc.isCards, "Not in cards mode");

    var bodyNode = dom.byId("body");

    var pageOfFronts;
    var pageOfBacks;
    var rowOfFronts;
    var rowOfBacks;
    var dummyCard;

    if (sc.separateBacks) {
      for (let index = 0; index < numCards; index++) {
        debugLog("Cards", "addCards 001 i = " + index.toString());
        [pageOfFronts, rowOfFronts, dummyCard] = addNthCard(
          bodyNode,
          pageOfFronts,
          rowOfFronts,
          frontCallback,
          index
        );
      }

      if (!sc.skipCardBacks) {
        debugLog("Cards", "addCards 002 i = " + i.toString());
        [pageOfBacks, rowOfBacks, dummyCard] = addNthCard(
          bodyNode,
          pageOfBacks,
          rowOfBacks,
          function (rowOfCards, index) {
            i.toString();
            addCardBack(rowOfCards, i, backConfig);
          },
          i,
          true
        );
      }
    } else {
      for (let index = 0; index < numCards; index++) {
        debugLog("Cards", "addCards 003 i = " + index.toString());
        [pageOfFronts, rowOfFronts, dummyCard] = addNthCard(
          bodyNode,
          pageOfFronts,
          rowOfFronts,
          frontCallback,
          index
        );

        if (!sc.skipCardBacks) {
          debugLog("Cards", "addCards 004 i = " + index.toString());
          [pageOfBacks, rowOfBacks, dummyCard] = addNthCard(
            bodyNode,
            pageOfBacks,
            rowOfBacks,
            function (rowOfCards, index) {
              addCardBack(rowOfCards, index, backConfig);
            },
            index,
            true
          );
        }
      }
    }
  }

  function getNumCardsFromConfigs(cardConfigs) {
    debugLog(
      "CardCount",
      "getNumCardsFromConfigs: cardConfigs = " + JSON.stringify(cardConfigs)
    );

    // If we are doing single-instance of each card config, rewrite the array.
    var sc = systemConfigs.getSystemConfigs();
    if (sc.singleCardInstance) {
      for (var i = 0; i < cardConfigs.length; i++) {
        cardConfigs[i].count = 1;
      }
      debugLog(
        "CardCount",
        "getNumCardsFromConfigs: singleCardInstance is true: cardConfigs = " +
          JSON.stringify(cardConfigs)
      );
    }

    // Now count.
    var numCards = 0;
    for (var i = 0; i < cardConfigs.length; i++) {
      var instanceCount = getInstanceCountFromConfig(cardConfigs, i);
      numCards = numCards + instanceCount;
    }

    debugLog(
      "CardCount",
      "getNumCardsFromConfigs: initial numCards = " + numCards
    );

    // If we have some min, and this isn't enough, change count on first card to hit max.
    if (sc.minCardCount && numCards < sc.minCardCount) {
      var firstCount = cardConfigs[0].count ? cardConfigs[0].count : 1;
      cardConfigs[0].count = firstCount + sc.minCardCount - numCards;
      numCards = sc.minCardCount;
      debugLog(
        "CardCount",
        "getNumCardsFromConfigs: sc.minCardCount = " + sc.minCardCount
      );
      debugLog(
        "CardCount",
        "getNumCardsFromConfigs: adjusted card configs: cardConfigs = " +
          JSON.stringify(cardConfigs)
      );
    }

    debugLog(
      "CardCount",
      "getNumCardsFromConfigs: final numCards = " + numCards
    );
    return numCards;
  }

  function getCardConfigAtIndex(cardConfigs, index) {
    debugLog(
      "Cards",
      "getCardConfigAtIndex: cardConfigs = " + JSON.stringify(cardConfigs)
    );
    for (var i = 0; i < cardConfigs.length; i++) {
      var instanceCount = getInstanceCountFromConfig(cardConfigs, i);
      if (index < instanceCount) {
        return cardConfigs[i];
      }
      index -= instanceCount;
    }
    return null;
  }

  function getIndexWithinConfig(cardConfigs, index) {
    debugLog(
      "Cards",
      "getIndexWithinConfig: cardConfigs = " + JSON.stringify(cardConfigs)
    );
    debugLog("Cards", "getIndexWithinConfig: index = " + index);
    for (var i = 0; i < cardConfigs.length; i++) {
      var instanceCount = getInstanceCountFromConfig(cardConfigs, i);
      if (index < instanceCount) {
        return index;
      }
      index -= instanceCount;
    }
    return -1; // Not found.
  }

  function addFormattedCardFront(parent, index, className, configs) {
    var config = getCardConfigAtIndex(configs, index);

    var idElements = [className, index.toString()];
    var id = idElements.join(".");
    var classArray = [className];
    var frontNode = addCardFront(parent, classArray, id);

    var wrapper = htmlUtils.addDiv(
      frontNode,
      ["formatted_wrapper"],
      "formatted_wrapper"
    );
    if (config.title) {
      htmlUtils.addDiv(wrapper, ["title"], "title", config.title);
    }
    if (config.subtitle) {
      htmlUtils.addDiv(wrapper, ["subtitle"], "subtitle", config.subtitle);
    }
    if (config.rulesText) {
      var rulesTextNode = htmlUtils.addDiv(
        wrapper,
        ["rules_text"],
        "rulesText"
      );
      rulesTextNode.innerHTML = config.rulesText;
    }
  }

  function getInstanceCountFromConfig(cardConfigs, index) {
    return cardConfigs[index].count ? cardConfigs[index].count : 1;
  }

  // This returned object becomes the defined value of this module
  return {
    getCardConfigAtIndex: getCardConfigAtIndex,
    getIndexWithinConfig: getIndexWithinConfig,
    addFormattedCardFront: addFormattedCardFront,
    getNumCardsFromConfigs: getNumCardsFromConfigs,
    getInstanceCountFromConfig: getInstanceCountFromConfig,
    addCardFront: addCardFront,
    addCards: addCards,
    setCardSize: setCardSize,
    addCardBack: addCardBack,
  };
});
