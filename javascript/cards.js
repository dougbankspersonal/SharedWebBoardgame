define([
  "dojo/string",
  "dojo/dom",
  "dojo/dom-style",
  "javascript/gameUtils",
  "sharedJavascript/debugLog",
  "sharedJavascript/systemConfigs",
  "dojo/domReady!",
], function (string, dom, domStyle, gameUtils, debugLog, systemConfigs) {
  var adjustedPageWidth =
    gameUtils.printedPagePortraitWidth - 2 * gameUtils.pagePadding;
  var adjustedPageHeight =
    gameUtils.printedPagePortraitHeight - 2 * gameUtils.pagePadding;
  var smallCardFitHorizontally = Math.floor(
    adjustedPageWidth / gameUtils.smallCardWidth
  );
  var smallCardFitVertically = Math.floor(
    adjustedPageHeight / gameUtils.smallCardHeight
  );

  var cardFitHorizontally = Math.floor(adjustedPageWidth / gameUtils.cardWidth);
  var cardFitVertically = Math.floor(adjustedPageHeight / gameUtils.cardHeight);

  var smallCardsPerPage = smallCardFitHorizontally * smallCardFitVertically;
  var cardsPerPage = cardFitHorizontally * cardFitVertically;

  var ttsCardsPerPage = 70;

  function setCardSize(node) {
    var sc = systemConfigs.getSystemConfigs();
    debugLog.debugLog("CardSize", "Doug: setCardSize sc = ", sc);
    if (sc.smallSquares) {
      domStyle.set(node, {
        width: `${gameUtils.smallCardWidth}px`,
        height: `${gameUtils.smallCardWidth}px`,
      });
    } else if (sc.smallCards) {
      domStyle.set(node, {
        width: `${gameUtils.smallCardWidth}px`,
        height: `${gameUtils.smallCardHeight}px`,
      });
    } else {
      domStyle.set(node, {
        width: `${gameUtils.cardWidth}px`,
        height: `${gameUtils.cardHeight}px`,
      });
    }
  }

  function addCardBack(parent, title, color, opt_backCallback) {
    if (opt_backCallback) {
      var node = opt_backCallback(parent, title, color);
      return node;
    }

    var sc = systemConfigs.getSystemConfigs();
    var node = gameUtils.addCard(parent, ["back"], "back");

    setCardSize(node);

    var innerNode = gameUtils.addDiv(node, ["inset"], "inset");
    var otherColor = gameUtils.blendHexColors(color, "#ffffff");
    var gradient = string.substitute("radial-gradient(${color1}, ${color2})", {
      color1: otherColor,
      color2: color,
    });
    domStyle.set(innerNode, "background", gradient);
    var title = gameUtils.addDiv(innerNode, ["title"], "title", title);
    var style = {};
    style["font-size"] = sc.smallCards
      ? `${gameUtils.smallCardBackFontSize}px`
      : `${gameUtils.cardBackFontSize}px`;
    domStyle.set(title, style);

    return node;
  }

  function addCardFront(parent, classArray, id) {
    classArray.push("front");
    var node = gameUtils.addCard(parent, classArray, id);
    setCardSize(node);

    return node;
  }

  function addNutDesc(parent, nutType) {
    var wrapper = gameUtils.addDiv(parent, ["wrapper"], "wrapper");
    var nutPropsTopNode = gameUtils.addDiv(wrapper, ["nutProps"], "nutProps");

    var nutType;
    if (nutType == -1) {
      nutType = "Wild";
    }

    var prop = gameUtils.addDiv(
      nutPropsTopNode,
      ["nutProp", "nut_type"],
      "nut_type"
    );
    gameUtils.addImage(prop, ["nutType", nutType], "nut_type");
    return wrapper;
  }

  function addBoxCardSingleNut(parent, nutType, index, opt_classArray) {
    var classArray = gameUtils.extendOptClassArray(opt_classArray, "box");
    var cardId = "box.".concat(index.toString());
    var node = addCardFront(parent, classArray, cardId);
    addNutDesc(node, nutType);
    return node;
  }

  function addNthBoxCardSingleNut(
    parent,
    index,
    numBoxCardsEachType,
    opt_classArray
  ) {
    var nutTypeIndex = Math.floor(index / numBoxCardsEachType);
    var nutTypes = gameUtils.nutTypes;
    var nutType = nutTypes[nutTypeIndex];

    return addBoxCardSingleNut(parent, nutType, index, opt_classArray);
  }

  function addCards(title, color, numCards, frontCallback, opt_backCallback) {
    var sc = systemConfigs.getSystemConfigs();
    var bodyNode = dom.byId("body");

    var pageOfFronts;
    var pageOfBacks;

    var timeForNewPageDivisor;
    if (sc.ttsCards) {
      timeForNewPageDivisor = ttsCardsPerPage;
    } else if (sc.smallCards) {
      timeForNewPageDivisor = smallCardsPerPage;
    } else {
      timeForNewPageDivisor = cardsPerPage;
    }

    if (sc.separateBacks) {
      for (let i = 0; i < numCards; i++) {
        var timeForNewPage = i % timeForNewPageDivisor;
        if (timeForNewPage == 0) {
          pageOfFronts = gameUtils.addPageOfItems(bodyNode);
        }
        frontCallback(pageOfFronts, i);
      }

      if (!sc.skipBacks) {
        for (let i = 0; i < numCards; i++) {
          var timeForNewPage = i % timeForNewPageDivisor;
          if (timeForNewPage == 0) {
            pageOfBacks = gameUtils.addPageOfItems(bodyNode, ["back"]);
          }
          addCardBack(pageOfBacks, title, color, opt_backCallback);
        }
      }
    } else {
      for (let i = 0; i < numCards; i++) {
        var timeForNewPage = i % timeForNewPageDivisor;
        if (timeForNewPage == 0) {
          pageOfFronts = gameUtils.addPageOfItems(bodyNode);
          if (!sc.skipBacks) {
            pageOfBacks = gameUtils.addPageOfItems(bodyNode, ["back"]);
          }
        }
        frontCallback(pageOfFronts, i);
        if (!sc.skipBacks) {
          addCardBack(pageOfBacks, title, color, opt_backCallback);
        }
      }
    }
  }

  function getNumCardsFromConfigs(cardConfigs) {
    console.log("Doug: getting numToyComponentCards get the count");
    var numCards = 0;
    for (var i = 0; i < cardConfigs.length; i++) {
      var instanceCount = getInstanceCountFromConfig(cardConfigs, i);
      numCards = numCards + instanceCount;
    }
    return numCards;
  }

  function getCardConfigFromIndex(cardConfigs, index) {
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

    var wrapper = gameUtils.addDiv(
      frontNode,
      ["formatted_wrapper"],
      "formatted_wrapper"
    );
    if (config.title) {
      gameUtils.addDiv(wrapper, ["title"], "title", config.title);
    }
    if (config.subtitle) {
      gameUtils.addDiv(wrapper, ["subtitle"], "subtitle", config.subtitle);
    }
    if (config.rulesText) {
      var rulesTextNode = gameUtils.addDiv(wrapper, ["rulesText"], "rulesText");
      rulesTextNode.innerHTML = config.rulesText;
    }
  }

  function getInstanceCountFromConfig(cardConfigs, index) {
    var sc = systemConfigs.getSystemConfigs();
    if (sc.singleCardInstance) {
      // TTS is dumb, needs at least 12 cards.
      if (cardConfigs.length < 12 && index == 0) {
        return 12 - (cardConfigs.length - 1);
      } else {
        return 1;
      }
    } else {
      return cardConfigs[index].count ? cardConfigs[index].count : 1;
    }
  }

  // This returned object becomes the defined value of this module
  return {
    getCardConfigFromIndex: getCardConfigFromIndex,
    addFormattedCardFront: addFormattedCardFront,
    getNumCardsFromConfigs: getNumCardsFromConfigs,
    addNthBoxCardSingleNut: addNthBoxCardSingleNut,
    addBoxCardSingleNut: addBoxCardSingleNut,
    getInstanceCountFromConfig: getInstanceCountFromConfig,
    addCardFront: addCardFront,
    addCards: addCards,
    setCardSize: setCardSize,
  };
});
