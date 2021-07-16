const CONTENT_ID = "content";
const PLAY_BUTTON_ID = "btnPlay";
const SHOW_ALL_CARDS_BUTTON_ID = "btnShowAllCards";
const ALERT_MESSAGE_ID = "message";
const LOADING_ID = "loading";
const COUNTER_ID = "counter";
const INVISIBLE_CLASS = "invisible";

const util = Util;

const INTERVAL_TIME = 1000;
const COUNTER_STARTER_VALUE = 3;
const COUNTER_FINAL_VALUE = 0;

const MESSAGES = {
  success: {
    text: "Combinação correta!",
    bootstrapClass: "alert-success",
  },
  error: {
    text: "Combinação incorreta!",
    bootstrapClass: "alert-danger",
  },
};

class Screen {
  static getCardHtmlCode(card) {
    return `
        <div class="col-md-3">
          <div class="card p-4" style="width: 50%" onclick="window.verifySelectedCard('${card.id}', '${card.name}')">
            <img name="${card.name}" src="${card.img}" class="card-img-top" alt="..." />
          </div>
          <br />
        </div>
        `;
  }

  static updateHtmlCode(htmlCode) {
    const content = document.getElementById(CONTENT_ID);
    content.innerHTML = htmlCode;
  }

  static generateHtmlStringFromImageList(images) {
    return images.map(Screen.getCardHtmlCode).join("");
  }

  static updateImageList(images) {
    const htmlCode = Screen.generateHtmlStringFromImageList(images);
    Screen.updateHtmlCode(htmlCode);
  }

  static setupPlayButton(onClickFunction) {
    const playButton = document.getElementById(PLAY_BUTTON_ID);
    playButton.onclick = onClickFunction;
  }

  static setupShowAllCardsButton(onClickFunction) {
    const showAllCardsButton = document.getElementById(
      SHOW_ALL_CARDS_BUTTON_ID
    );
    showAllCardsButton.onclick = onClickFunction;
  }

  static setupCard(onClickFunction) {
    window.verifySelectedCard = onClickFunction;
  }

  static showCard(name, img) {
    const cardHtml = document.getElementsByName(name);
    cardHtml.forEach((card) => (card.src = img));
  }

  static async showMessage(success = true) {
    const alertMessage = document.getElementById(ALERT_MESSAGE_ID);
    if (success) {
      alertMessage.classList.remove(MESSAGES.error.bootstrapClass);
      alertMessage.classList.add(MESSAGES.success.bootstrapClass);
      alertMessage.innerText = MESSAGES.success.text;
    } else {
      alertMessage.classList.remove(MESSAGES.success.bootstrapClass);
      alertMessage.classList.add(MESSAGES.error.bootstrapClass);
      alertMessage.innerText = MESSAGES.error.text;
    }

    alertMessage.classList.remove(INVISIBLE_CLASS);
    await util.timeout(1000);
    alertMessage.classList.add(INVISIBLE_CLASS);
  }

  static showLoading(show = true) {
    const loading = document.getElementById(LOADING_ID);
    if (show) {
      loading.classList.remove(INVISIBLE_CLASS);
      Screen.startCounter();
      return;
    }
    loading.classList.add(INVISIBLE_CLASS);
  }

  static startCounter() {
    let counterValue = COUNTER_STARTER_VALUE;
    const counter = document.getElementById(COUNTER_ID);
    const counterTextIdentifier = "$$counter";
    const defaultText = `Começando em ${counterTextIdentifier} segundos...`;

    const updateText = () => {
      counter.innerHTML = defaultText.replace(
        counterTextIdentifier,
        counterValue--
      );

      if (counterValue < COUNTER_FINAL_VALUE) {
        clearInterval(interval);
        counter.innerHTML = "";
        counterValue = COUNTER_STARTER_VALUE;
      }
    };

    updateText();
    const interval = setInterval(updateText, INTERVAL_TIME);
  }
}
