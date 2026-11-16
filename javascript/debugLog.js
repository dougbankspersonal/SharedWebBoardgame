define(["dojo/domReady!"], function () {
  var gEnabledFlags = new Set([]);

  function debugLog(flag, ...args) {
    if (gEnabledFlags.has(flag)) {
      console.log(`[${flag}]`, ...args);
    }
  }

  function setsAreEqual(a, b) {
    return a.size === b.size && [...a].every((x) => b.has(x));
  }

  function setEnabledFlags(flags) {
    var newEnabledFlags = new Set(flags);
    if (!setsAreEqual(newEnabledFlags, gEnabledFlags)) {
      console.log("Enabled flags changed:", [...newEnabledFlags]);
    }
    gEnabledFlags = newEnabledFlags;
  }

  return {
    debugLog: debugLog,
    setEnabledFlags: setEnabledFlags,
  };
});
