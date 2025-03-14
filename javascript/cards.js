define([
  "dojo/string",
  "dojo/dom",
  "dojo/dom-style",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/systemConfigs",
  "dojo/domReady!",
], function (
  string,
  dom,
  domStyle,
  debugLog,
  genericMeasurements,
  htmlUtils,
  systemConfigs
) {
  function setCardSize(node) {
    var sc = systemConfigs.getSystemConfigs();
    debugLog.debugLog("CardSize", "Doug: setCardSize sc = ", sc);
    var cardWidth = sc.cardWidth ? sc.cardWidth : genericMeasurements.cardWidth;
    var cardHeight = sc.cardHeight
      ? sc.cardHeight
      : genericMeasurements.cardHeight;
    domStyle.set(node, {
      width: `${cardWidth}px`,
      height: `${cardHeight}px`,
    });
  }

  function addCardBack(parent, title, color, opt_backCallback) {
    if (opt_backCallback) {
      var node = opt_backCallback(parent, title, color);
      return node;
    }

    var sc = systemConfigs.getSystemConfigs();
    var node = htmlUtils.addCard(parent, ["back"], "back");

    setCardSize(node);

    var innerNode = htmlUtils.addDiv(node, ["inset"], "inset");
    var otherColor = htmlUtils.blendHexColors(color, "#ffffff");
    var gradient = string.substitute("radial-gradient(${color1}, ${color2})", {
      color1: otherColor,
      color2: color,
    });
    domStyle.set(innerNode, "background", gradient);
    var title = htmlUtils.addDiv(innerNode, ["title"], "title", title);
    var style = {};
    debugLog.debugLog("Cards", "Doug addCardBack sc = " + JSON.stringify(sc));
    style["font-size"] = sc.cardBackFontSize
      ? `${sc.cardBackFontSize}px`
      : `${genericMeasurements.cardBackFontSize}px`;
    domStyle.set(title, style);

    return node;
  }

  function addCardFront(parent, classArray, id) {
    classArray.push("front");
    var node = htmlUtils.addCard(parent, classArray, id);
    setCardSize(node);

    return node;
  }

  function addCards(title, color, numCards, frontCallback, opt_backCallback) {
    var sc = systemConfigs.getSystemConfigs();
    var bodyNode = dom.byId("body");

    var pageOfFronts;
    var pageOfBacks;

    var cardsPerPage = sc.cardsPerPage
      ? sc.cardsPerPage
      : genericMeasurements.cardsPerPage;

    debugLog.debugLog("Cards", "Doug: addCards: sc = " + JSON.stringify(sc));
    debugLog.debugLog("Cards", "Doug: addCards: numCards = " + numCards);
    debugLog.debugLog(
      "Cards",
      "Doug: addCards: cardsPerPage = " + cardsPerPage
    );

    if (sc.separateBacks) {
      for (let i = 0; i < numCards; i++) {
        var timeForNewPage = i % cardsPerPage;
        if (timeForNewPage == 0) {
          pageOfFronts = htmlUtils.addPageOfItems(bodyNode);
        }
        frontCallback(pageOfFronts, i);
      }

      if (!sc.skipCardBacks) {
        for (let i = 0; i < numCards; i++) {
          var timeForNewPage = i % cardsPerPage;
          if (timeForNewPage == 0) {
            pageOfBacks = htmlUtils.addPageOfItems(bodyNode, ["back"]);
          }
          addCardBack(pageOfBacks, title, color, opt_backCallback);
        }
      }
    } else {
      for (let i = 0; i < numCards; i++) {
        var timeForNewPage = i % cardsPerPage;
        if (timeForNewPage == 0) {
          pageOfFronts = htmlUtils.addPageOfItems(bodyNode);
          if (!sc.skipCardBacks) {
            pageOfBacks = htmlUtils.addPageOfItems(bodyNode, ["back"]);
          }
        }
        frontCallback(pageOfFronts, i);
        debugLog.debugLog("Cards", "Doug: addCards: hit he front callback");

        if (!sc.skipCardBacks) {
          debugLog.debugLog("Cards", "Doug: addCards: calling addCardBack");
          addCardBack(pageOfBacks, title, color, opt_backCallback);
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
    addFormattedCardFront: addFormattedCardFront,
    getNumCardsFromConfigs: getNumCardsFromConfigs,
    getInstanceCountFromConfig: getInstanceCountFromConfig,
    addCardFront: addCardFront,
    addCards: addCards,
    setCardSize: setCardSize,
  };
});
