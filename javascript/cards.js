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
  debugLog,
  genericMeasurements,
  genericUtils,
  htmlUtils,
  systemConfigs
) {
  function setCardSize(node) {
    var sc = systemConfigs.getSystemConfigs();
    debugLog.debugLog(
      "CardSize",
      "Doug: setCardSize sc.cardHeightPx = ",
      sc.cardHeightPx
    );
    debugLog.debugLog(
      "CardSize",
      "Doug: setCardSize sc.cardWidthPx = ",
      sc.cardWidthPx
    );
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
    if (backConfig.callback) {
      console.assert(
        typeof backConfig.callback,
        "function",
        "Expected opt_backCallback function"
      );
    } else {
      console.assert(
        backConfig.hexColorString,
        "No hexColorString in backConfig"
      );
      console.assert(backConfig.title, "No title in backConfig");
    }

    var cardsPerRow = systemConfigs.getSystemConfigs().cardsPerRow;
    debugLog.debugLog("Cards", "addCardBack cardsPerRow = " + cardsPerRow);
    debugLog.debugLog("Cards", "addCardBack index = " + index);
    if (backConfig.callback) {
      var node = backConfig.callback(
        parent,
        backConfig.title,
        backConfig.hexColorString,
        index
      );
      return node;
    }

    debugLog.debugLog(
      "ParamCards",
      "Doug: addCardBack: color = " + backConfig.hexColorString
    );

    var sc = systemConfigs.getSystemConfigs();
    var node = htmlUtils.addCard(parent, ["back"], "back");

    setCardSize(node);

    var innerNode = htmlUtils.addDiv(node, ["inset"], "inset");
    var otherColor = htmlUtils.blendHexColors(
      backConfig.hexColorString,
      "#ffffff"
    );
    var gradient = string.substitute("radial-gradient(${color1}, ${color2})", {
      color1: otherColor,
      color2: backConfig.hexColorString,
    });
    domStyle.set(innerNode, "background", gradient);
    var titleNode = htmlUtils.addDiv(
      innerNode,
      ["title"],
      "title",
      backConfig.title
    );
    var style = {};
    debugLog.debugLog("Cards", "Doug: addCardBack sc = " + JSON.stringify(sc));
    style["font-size"] = sc.cardBackFontSize
      ? `${sc.cardBackFontSize}px`
      : `${genericMeasurements.cardBackFontSize}px`;
    domStyle.set(titleNode, style);

    return node;
  }

  function addCardFront(parent, classArray, id) {
    console.assert(parent, "parent is null");
    classArray.push("front");
    var node = htmlUtils.addCard(parent, classArray, id);
    setCardSize(node);

    return node;
  }

  function maybeNewPage(parent, currentPage, index) {
    debugLog.debugLog("Cards", "maybeNewPage index = " + index.toString());
    var cardsPerPage = systemConfigs.getSystemConfigs().cardsPerPage;
    var needNew = index % cardsPerPage;
    if (needNew == 0) {
      debugLog.debugLog(
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
      debugLog.debugLog(
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
    debugLog.debugLog("Cards", "addNthCard index = " + index.toString());
    pageOfCards = maybeNewPage(bodyNode, pageOfCards, index);
    console.assert(pageOfCards, "pageOfCards is null");
    rowOfCards = maybeNewRow(pageOfCards, rowOfCards, index, opt_isCardBack);
    console.assert(rowOfCards, "rowOfCards is null");
    var card = addNthCardCallback(rowOfCards, index);
    return [pageOfCards, rowOfCards, card];
  }

  function addCards(numCards, frontCallback, backConfig) {
    var sc = systemConfigs.getSystemConfigs();

    debugLog.debugLog("Cards", "Doug: addCards: sc = " + JSON.stringify(sc));
    debugLog.debugLog("Cards", "Doug: addCards: numCards = " + numCards);
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
        debugLog.debugLog("Cards", "addCards 001 i = " + index.toString());
        [pageOfFronts, rowOfFronts, dummyCard] = addNthCard(
          bodyNode,
          pageOfFronts,
          rowOfFronts,
          frontCallback,
          index
        );
      }

      if (!sc.skipCardBacks) {
        debugLog.debugLog("Cards", "addCards 002 i = " + i.toString());
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
        debugLog.debugLog("Cards", "addCards 003 i = " + index.toString());
        [pageOfFronts, rowOfFronts, dummyCard] = addNthCard(
          bodyNode,
          pageOfFronts,
          rowOfFronts,
          frontCallback,
          index
        );

        if (!sc.skipCardBacks) {
          debugLog.debugLog("Cards", "addCards 004 i = " + index.toString());
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
    debugLog.debugLog(
      "CardCount",
      "Doug: getNumCardsFromConfigs: cardConfigs = " +
        JSON.stringify(cardConfigs)
    );
    // If we are doing single-instance of each card config, rewrite the array.
    var sc = systemConfigs.getSystemConfigs();
    if (sc.singleCardInstance) {
      for (var i = 0; i < cardConfigs.length; i++) {
        cardConfigs[i].count = 1;
      }
      debugLog.debugLog(
        "CardCount",
        "Doug: getNumCardsFromConfigs: singleCardInstance is true: cardConfigs = " +
          JSON.stringify(cardConfigs)
      );
    }

    // Now count.
    var numCards = 0;
    for (var i = 0; i < cardConfigs.length; i++) {
      var instanceCount = getInstanceCountFromConfig(cardConfigs, i);
      numCards = numCards + instanceCount;
    }

    debugLog.debugLog(
      "CardCount",
      "Doug: getNumCardsFromConfigs: initial numCards = " + numCards
    );

    // If we have some min, and this isn't enough, change count on first card to hit max.
    if (sc.minCardCount && numCards < sc.minCardCount) {
      var firstCount = cardConfigs[0].count ? cardConfigs[0].count : 1;
      cardConfigs[0].count = firstCount + sc.minCardCount - numCards;
      numCards = sc.minCardCount;
      debugLog.debugLog(
        "CardCount",
        "Doug: getNumCardsFromConfigs: sc.minCardCount = " + sc.minCardCount
      );
      debugLog.debugLog(
        "CardCount",
        "Doug: getNumCardsFromConfigs: adjusted card configs: cardConfigs = " +
          JSON.stringify(cardConfigs)
      );
    }

    debugLog.debugLog(
      "CardCount",
      "Doug: getNumCardsFromConfigs: final numCards = " + numCards
    );
    return numCards;
  }

  function getCardConfigFromIndex(cardConfigs, index) {
    debugLog.debugLog(
      "Cards",
      "Doug: getCardConfigFromIndex: cardConfigs = " +
        JSON.stringify(cardConfigs)
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
    debugLog.debugLog(
      "Cards",
      "Doug: getIndexWithinConfig: cardConfigs = " + JSON.stringify(cardConfigs)
    );
    debugLog.debugLog("Cards", "Doug: getIndexWithinConfig: index = " + index);
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
    var config = getCardConfigFromIndex(configs, index);

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
    getCardConfigFromIndex: getCardConfigFromIndex,
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
