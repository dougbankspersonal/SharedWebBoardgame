define(["dojo/domReady!"], function () {
  var gEnabledFlags = new Set(["Cards"]);

  function debugLog(flag, ...args) {
    if (gEnabledFlags.has(flag)) {
      console.log(`[${flag}]`, ...args);
    }
  }

  function setEnabledFlags(flags) {
    gEnabledFlags = new Set(flags);
  }

  return {
    debugLog: debugLog,
    setEnabledFlags: setEnabledFlags,
  };
});
