function onLoad() {
  const dependencies = {
    screen: Screen,
    util: Util,
  };

  const memoryGame = new MemoryGame(dependencies);
  memoryGame.initialize();
}

window.onload = onLoad;
