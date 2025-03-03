define(["dojo/domReady!"], function () {
  // validKeys maps keys to "true".
  // Passes if every key in table is in validKeys.
  // Does not check types.
  // Does not check the inverse: table may be missing some validKeys.
  function sanityCheckTable(table, validKeys) {
    for (var key in table) {
      if (!validKeys[key]) {
        console.assert(false, "sanityCheckTable: invalid key: " + key);
        return false;
      }
    }
    return true;
  }

  return {
    sanityCheckTable: sanityCheckTable,
  };
});
