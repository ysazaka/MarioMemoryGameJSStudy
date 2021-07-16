const RANDOMIZER_VALUE = 0.5;
const TIME_FOR_THE_USER_TO_MEMORIZE_THE_CARDS = 3000;

const FIRST_CARD_SELECTED = 0;
const SECOND_CARD_SELECTED = 1;

class MemoryGame {
  constructor({ screen, util }) {
    this.screen = screen;
    this.util = util;
    this.defaultCardIcon = "./assets/mysterious_cube.png";
    this.availablePowerUps = [
      { img: "./assets/1up_mushroom.png", name: "1UP Mushroom" },
      { img: "./assets/red_mushroom.png", name: "Red Mushroom" },
      { img: "./assets/fire_flower.png", name: "Fire Flower" },
      { img: "./assets/star.png", name: "Star" },
    ];
    this.hiddenPowerUps = [];
    this.selectedPowerUps = [];
  }

  initialize() {
    const initialPowerUps = this.availablePowerUps
      .concat(this.availablePowerUps)

    this.screen.updateImageList(initialPowerUps);
    this.screen.setupPlayButton(this.play.bind(this));
    this.screen.setupCard(this.verifySelectedCard.bind(this));
    this.screen.setupShowAllCardsButton(this.showAllCards.bind(this));
  }

  hideCards(cards) {
    const hiddenCards = cards.map(({ name, id }) => ({
      id,
      name,
      img: this.defaultCardIcon,
    }));

    this.screen.updateImageList(hiddenCards);
    this.hiddenPowerUps = hiddenCards;
  }

  async shuffleCards() {
    const copies = this.availablePowerUps
      .concat(this.availablePowerUps)
      .map((item) => {
        return Object.assign({}, item, {
          id: Math.random() / RANDOMIZER_VALUE,
        });
      })
      .sort(() => Math.random() - RANDOMIZER_VALUE);

    this.screen.updateImageList(copies);
    this.screen.showLoading();

    await this.util.timeout(TIME_FOR_THE_USER_TO_MEMORIZE_THE_CARDS);
    this.hideCards(copies);
    this.screen.showLoading(false);
  }

  play() {
    this.shuffleCards();
  }

  verifySelectedCard(id, name) {
    const selectedCard = { id, name };
    const numberOfSelectedPowerUps = this.selectedPowerUps.length;

    switch (numberOfSelectedPowerUps) {
      case FIRST_CARD_SELECTED:
        this.selectedPowerUps.push(selectedCard);
        break;
      case SECOND_CARD_SELECTED:
        const [firstCardSelected] = this.selectedPowerUps;
        this.selectedPowerUps = [];

        if (
          firstCardSelected.name === selectedCard.name &&
          firstCardSelected.id !== selectedCard.id
        ) {
          this.showCard(selectedCard.name);
          this.screen.showMessage(true);
          return;
        }

        this.screen.showMessage(false);
        break;
    }
  }

  showCard(powerUpName) {
    const { img } = this.availablePowerUps.find(
      ({ name }) => powerUpName === name
    );
    this.screen.showCard(powerUpName, img);
  }

  showAllCards() {
    const hiddenPowerUps = this.hiddenPowerUps;
    for (const powerUp of hiddenPowerUps) {
      const { img } = this.availablePowerUps.find(
        (item) => item.name === powerUp.name
      );
      powerUp.img = img;
    }
    this.screen.updateImageList(hiddenPowerUps);
  }
}
