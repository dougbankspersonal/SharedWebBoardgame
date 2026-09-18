// Doug

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
  debugLogModule,
  genericMeasurements,
  htmlUtils,
  systemConfigs,
) {
  var debugLog = debugLogModule.debugLog;

  function setCardSize(node) {
    var sc = systemConfigs.getSystemConfigs();
    debugLog("setCardSize", "setCardSize node = ", JSON.stringify(node));
    debugLog("setCardSize", "setCardSize sc.cardHeightPx = ", sc.cardHeightPx);
    debugLog("setCardSize", "setCardSize sc.cardWidthPx = ", sc.cardWidthPx);
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

  function maybeAddCardBackColor(parent, backConfig) {
    if (backConfig.hexColorString) {
      var otherColor = htmlUtils.blendHexColors(
        backConfig.hexColorString,
        "#ffffff",
      );
      var gradient = string.substitute(
        "radial-gradient(${color1}, ${color2})",
        {
          color1: otherColor,
          color2: backConfig.hexColorString,
        },
      );
      domStyle.set(parent, "background", gradient);
    }
  }

  function maybeAddCardBackTitle(parent, backConfig) {
    var titleNode;
    var classes = backConfig.titleClasses ? backConfig.titleClasses : [];
    classes.push("title");
    if (backConfig.title) {
      titleNode = htmlUtils.addDiv(parent, classes, "title", backConfig.title);
    }
    return titleNode;
  }

  function maybeAddCardBackImage(parent, backConfig) {
    var imageNode;
    if (backConfig.imageClasses) {
      imageNode = htmlUtils.addImage(parent, backConfig.imageClasses, "image");
    }
    return imageNode;
  }

  function addCardBack(parent, index, backConfig) {
    debugLog("addCardBack", "parent = " + JSON.stringify(parent));
    debugLog("addCardBack", "index = " + JSON.stringify(index));
    debugLog("addCardBack", "backConfig = " + JSON.stringify(backConfig));

    var itemsPerRow = systemConfigs.getSystemConfigs().itemsPerRow;
    debugLog("addCardBack", "itemsPerRow = " + itemsPerRow);
    debugLog("addCardBack", "index = " + index);

    var cardBackNode;
    if (backConfig.callback) {
      debugLog("addCardBack", "hitting callback for backConfig.callback");
      console.assert(
        typeof backConfig.callback === "function",
        "Expected backConfig.callback function",
      );
      cardBackNode = backConfig.callback(parent, index);
      console.assert(cardBackNode, "backNode is null");
    } else {
      debugLog("addCardBack", "no callback");

      debugLog(
        "addCardBack",
        "backConfig.classes = " + JSON.stringify(backConfig.classes),
      );

      var classes = backConfig.classes ? backConfig.classes : [];
      classes = classes.slice();
      classes.push("back");

      debugLog("addCardBack", "classes = " + JSON.stringify(classes));

      var cardBackNode = htmlUtils.addCard(parent, classes, "back");

      maybeAddCardBackColor(cardBackNode, backConfig);
      maybeAddCardBackTitle(cardBackNode, backConfig);
      maybeAddCardBackImage(cardBackNode, backConfig);
    }

    setCardSize(cardBackNode);
    return cardBackNode;
  }

  function addCardFront(parent, classArray, id) {
    console.assert(parent, "parent is null");
    classArray.push("front");
    var cardFrontNode = htmlUtils.addCard(parent, classArray, id);
    setCardSize(cardFrontNode);

    return cardFrontNode;
  }

  // Add the nth card to this parent node.
  // parent: what to stuff the card in.
  // callback: generates the card.
  // index: tells the callback what card to generate.
  function addNthCard(parentNode, addNthCardCallback, index) {
    console.assert(parentNode, "parentNode   is null");
    console.assert(addNthCardCallback, "addNthCardCallback is null");
    var nthCardNode = addNthCardCallback(parentNode, index);
    return nthCardNode;
  }

  // Hit the frontCallback to add a card.
  // use callbacks to generate new page/row if needed.
  // startIndex: index of first card we're adding.
  // numberToDump: how many cards to add starting from startIndex.
  function dumpCardFronts(
    frontCallback,
    addPageCallback,
    addRowCallback,
    startIndex,
    numberToDump,
  ) {
    for (var i = startIndex; i < startIndex + numberToDump; i++) {
      debugLog(
        "addCards",
        "calling addNthCard for frontCard index = " + i.toString(),
      );
      var parentNode = htmlUtils.getCurrentPageOfItemsNextParentNode(
        addPageCallback,
        addRowCallback,
      );

      var cardFrontNode = addNthCard(parentNode, frontCallback, i);
      htmlUtils.incrementCurrentTotalItemCount();
    }
  }

  // Print one instance of each back config.
  // Use callbacks to get proper page/row.
  function dumpCardBacks(backConfigs, addPageCallback, addRowCallback) {
    // Dump one of each back.
    for (var i = 0; i < backConfigs.length; i++) {
      var backConfig = backConfigs[i];
      debugLog(
        "addCards",
        "calling addNthCard for backConfig index = " + i.toString(),
      );
      var parentNode = htmlUtils.getCurrentPageOfItemsNextParentNode(
        addPageCallback,
        addRowCallback,
      );

      var cardBackNode = addCardBack(parentNode, i, backConfig);
      htmlUtils.incrementCurrentTotalItemCount();
    }
  }

  // We are going to add some card backs to a page.
  // They are suppose to line up with card fronts on the other side
  // of the page.
  // We may have more than one card back to worry about.
  // We assume the card backs are eveny distributed over fronts (e.g. if there's
  // 40 card fronts and 10 backs, the nth 10 fronts go with the nth back).
  function addPagedCardBacks(
    backConfigs,
    addPagedPageOfCards,
    addRowOfCards,
    numCardFronts,
    cardsAddedSoFar,
    cardsToAddThisPage,
  ) {
    var frontCardsPerBack = Math.floor(numCardFronts / backConfigs.length);
    for (var i = 0; i < cardsToAddThisPage; i++) {
      var correspondingFrontIndex = cardsAddedSoFar + i;
      var backConfigIndex = Math.floor(
        correspondingFrontIndex / frontCardsPerBack,
      );
      var backConfig = backConfigs[backConfigIndex];
      var parentNode = htmlUtils.getCurrentPageOfItemsNextParentNode(
        addPagedPageOfCards,
        addRowOfCards,
      );
      var cardBackNode = addCardBack(
        parentNode,
        correspondingFrontIndex,
        backConfig,
      );
      htmlUtils.incrementCurrentTotalItemCount();
    }
  }

  // Look for a "count" field.
  // If it's nil, it's assumed to be 1.
  // If it's explicitly 0, it's 0.
  // Else it's the given count.
  function getInstanceCountFromConfig(cardConfigs, index) {
    var config = cardConfigs[index];
    if (!config.hasOwnProperty("count")) {
      return 1;
    } else {
      return config.count ? config.count : 0;
    }
  }

  function getNumCardsFromConfigs(cardConfigs) {
    console.assert(cardConfigs, "cardConfigs is null");
    debugLog(
      "getNumCardsFromConfigs",
      "cardConfigs = " + JSON.stringify(cardConfigs),
    );
    debugLog(
      "getNumCardsFromConfigs",
      "cardConfigs.length = " + JSON.stringify(cardConfigs.length),
    );

    // If we are doing single-instance of each card config, rewrite the array.
    var sc = systemConfigs.getSystemConfigs();
    if (sc.singleCardInstance) {
      for (var i = 0; i < cardConfigs.length; i++) {
        cardConfigs[i].count = 1;
      }
      debugLog(
        "getNumCardsFromConfigs",
        "singleCardInstance is true: cardConfigs = " +
          JSON.stringify(cardConfigs),
      );
    }

    // Now count.
    var numCards = 0;
    for (var i = 0; i < cardConfigs.length; i++) {
      var instanceCount = getInstanceCountFromConfig(cardConfigs, i);
      numCards = numCards + instanceCount;
    }

    debugLog("getNumCardsFromConfigs", "initial numCards = " + numCards);
    debugLog("CardCount", "final numCards = " + numCards);
    return numCards;
  }

  // Card configs is ordered list of card descriptions (configs).
  // Each config must have a count field.
  // If the count field is missing or 0, we skip this config.
  function getCardConfigAtIndex(cardConfigs, index) {
    debugLog(
      "Cards",
      "getCardConfigAtIndex: cardConfigs = " + JSON.stringify(cardConfigs),
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
      "getIndexWithinConfig: cardConfigs = " + JSON.stringify(cardConfigs),
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
      ["formatted-wrapper"],
      "formatted-wrapper",
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
        "rulesText",
      );
      rulesTextNode.innerHTML = config.rulesText;
    }
  }

  // Assumption:
  // We have some callback that knows what to do when given a "makeNthCard" plus some
  // index.
  // We know how many times we are going to call that.
  // We also have some back configs:
  // - In pageless mode, we print these first: one instance of each card back.
  // - In paged mode, we evently divide fronts by backs, so that if there's n back configs,
  //   the first 1/n fronts will be printed on a page so that they have back 0, next 1/n has
  //   back 1, etc.
  function addCards(numCardFronts, frontCallback, backConfigs) {
    console.assert(
      Array.isArray(backConfigs),
      "Expected an array for backConfigs",
    );
    var sc = systemConfigs.getSystemConfigs();

    debugLog("addCards", "sc = " + JSON.stringify(sc));
    debugLog("addCards", "numCardFronts = " + numCardFronts);

    // Better be in cards mode.
    console.assert(sc.isCards, "Not in cards mode");

    var bodyNode = dom.byId("body");
    debugLog("addCards", "bodyNode = " + JSON.stringify(bodyNode));

    debugLog("addCards", "adding card backs");

    function addPageOfCards() {
      return htmlUtils.addPageOfItems(bodyNode, ["cards"]);
    }

    function addPageOfCardBacks() {
      return htmlUtils.addPageOfItems(bodyNode, ["cards", "back"]);
    }

    function addRowOfCards(pageNode) {
      return htmlUtils.addRowOfItems(pageNode, ["cards"]);
    }

    // Pageless:
    if (sc.pageless) {
      // First dump all backs then dump all fronts.
      dumpCardBacks(backConfigs, addPageOfCards, addRowOfCards);
      dumpCardFronts(
        frontCallback,
        addPageOfCards,
        addRowOfCards,
        0,
        numCardFronts,
      );
    } else {
      // Do it in page sized handfuls.
      // And just a sanity check: these guys should jive.
      console.assert(
        sc.itemsPerPage > 0,
        "itemsPerPage should be greater than 0",
      );
      console.assert(
        sc.itemsPerRow > 0,
        "itemsPerRow should be greater than 0",
      );
      console.assert(
        sc.itemsPerPage % sc.itemsPerRow === 0,
        "itemsPerPage should be a multiple of itemsPerRow",
      );

      var numFrontPages = Math.ceil(numCardFronts / sc.itemsPerPage);
      debugLog("addCards", "numFrontPages = " + numFrontPages);

      for (var i = 0; i < numFrontPages; i++) {
        var cardsAddedSoFar = i * sc.itemsPerPage;
        var cardsToAddThisPage = Math.min(
          sc.itemsPerPage,
          numCardFronts - i * sc.itemsPerPage,
        );
        htmlUtils.initCurrentPageOfItems();
        dumpCardFronts(
          frontCallback,
          addPageOfCards,
          addRowOfCards,
          cardsAddedSoFar,
          cardsToAddThisPage,
        );

        // If we're adding backs, add a page of backs.
        htmlUtils.initCurrentPageOfItems();
        addPagedCardBacks(
          backConfigs,
          addPageOfCardBacks,
          addRowOfCards,
          numCardFronts,
          cardsAddedSoFar,
          cardsToAddThisPage,
        );
      }
    }

    debugLog("addCards", "backConfigs = ", JSON.stringify(backConfigs));
  }

  // This returned object becomes the defined value of this module
  return {
    getCardConfigAtIndex: getCardConfigAtIndex,
    getIndexWithinConfig: getIndexWithinConfig,
    addFormattedCardFront: addFormattedCardFront,
    getNumCardsFromConfigs: getNumCardsFromConfigs,
    getInstanceCountFromConfig: getInstanceCountFromConfig,
    addCardFront: addCardFront,
    setCardSize: setCardSize,
    addCardBack: addCardBack,
    addCards: addCards,
  };
});
