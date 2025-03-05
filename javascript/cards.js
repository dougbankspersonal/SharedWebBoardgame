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
  var ttsCardsPerPage = 70;

  function setCardSize(node) {
    var sc = systemConfigs.getSystemConfigs();
    debugLog.debugLog("CardSize", "Doug: setCardSize sc = ", sc);
    var cardWidth = sc.altCardWidth
      ? sc.altCardWidth
      : genericMeasurements.cardWidth;
    var cardHeight = sc.altCardHeight
      ? sc.altCardHeight
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
    style["font-size"] = sc.altCardBackFontSize
      ? `${sc.altCardBackFontSize}px`
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

  function addNutDesc(parent, nutType) {
    var wrapper = htmlUtils.addDiv(parent, ["wrapper"], "wrapper");
    var nutPropsTopNode = htmlUtils.addDiv(wrapper, ["nutProps"], "nutProps");

    var nutType;
    if (nutType == -1) {
      nutType = "Wild";
    }

    var prop = htmlUtils.addDiv(
      nutPropsTopNode,
      ["nutProp", "nut_type"],
      "nut_type"
    );
    htmlUtils.addImage(prop, ["nutType", nutType], "nut_type");
    return wrapper;
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
      timeForNewPageDivisor = genericMeasurements.cardsPerPage;
    }

    if (sc.separateBacks) {
      for (let i = 0; i < numCards; i++) {
        var timeForNewPage = i % timeForNewPageDivisor;
        if (timeForNewPage == 0) {
          pageOfFronts = htmlUtils.addPageOfItems(bodyNode);
        }
        frontCallback(pageOfFronts, i);
      }

      debugLog.debugLog(
        "Refactor",
        "Doug: addCards sc.skipBacks = ",
        sc.skipBacks
      );
      if (!sc.skipBacks) {
        for (let i = 0; i < numCards; i++) {
          var timeForNewPage = i % timeForNewPageDivisor;
          if (timeForNewPage == 0) {
            pageOfBacks = htmlUtils.addPageOfItems(bodyNode, ["back"]);
          }
          addCardBack(pageOfBacks, title, color, opt_backCallback);
        }
      }
    } else {
      for (let i = 0; i < numCards; i++) {
        var timeForNewPage = i % timeForNewPageDivisor;
        if (timeForNewPage == 0) {
          pageOfFronts = htmlUtils.addPageOfItems(bodyNode);
          if (!sc.skipBacks) {
            pageOfBacks = htmlUtils.addPageOfItems(bodyNode, ["back"]);
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
    debugLog.debugLog(
      "Refactor",
      "Doug: getCardConfigFromIndex index = " + JSON.stringify(cardConfigs)
    );
    debugLog.debugLog(
      "Refactor",
      "Doug: getCardConfigFromIndex cardConfigs = " +
        JSON.stringify(cardConfigs)
    );
    for (var i = 0; i < cardConfigs.length; i++) {
      var instanceCount = getInstanceCountFromConfig(cardConfigs, i);
      debugLog.debugLog(
        "Refactor",
        "Doug: getCardConfigFromIndex instanceCount = " + instanceCount
      );
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
      var rulesTextNode = htmlUtils.addDiv(wrapper, ["rulesText"], "rulesText");
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
    getInstanceCountFromConfig: getInstanceCountFromConfig,
    addCardFront: addCardFront,
    addCards: addCards,
    setCardSize: setCardSize,
  };
});
