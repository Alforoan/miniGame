const firstRowContainer = document.querySelector(".first-row-container");
const lettersCotainer = document.querySelector(".letters-container");
const enterBtn = document.querySelector(".enter");
const input = document.querySelector(".input");
const shuffleBtn = document.querySelector(".shuffle-btn");
let hiddenWord;
let allThreeLetterWords = [];
let lettersUsedArray = [];
let letterBtns;

let fiveLetterWordsArray = [];
let threeLetterWordsArray = [];

async function fetchthreeLetterWordsData() {
  fetch("./threeLetterWords.txt")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      let wordsList = data.split("\n");
      wordsList = wordsList.map((word) => word.replace(/\r/g, ""));
      allThreeLetterWords = [...wordsList];

      let num1 = randomNumberGenerator(wordsList);
      let num2 = randomNumberGenerator(wordsList);
      let num3 = randomNumberGenerator(wordsList);
      threeLetterWordsArray.push(
        wordsList[num1].toUpperCase(),
        wordsList[num2].toUpperCase(),
        wordsList[num3].toUpperCase()
      );

      let lettersUsed = showLettersUsed(threeLetterWordsArray);
      lettersUsedArray = [...lettersUsed];
      if (lettersUsed.length <= 7) {
        addThreeLetterWords();
        hiddenWord = document.querySelectorAll(".hidden");

        addLettersUsed(lettersUsed);
      } else {
        fetchthreeLetterWordsData();
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
fetchthreeLetterWordsData();

async function fetchFiveLetterWordsData() {
  fetch("./fiveLetterWords.txt")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      let wordsList = data.split("\n");
      wordsList = wordsList.map((word) => word.replace(/\r/g, ""));
      let num1 = randomNumberGenerator(wordsList);
      let num2 = randomNumberGenerator(wordsList);
      let num3 = randomNumberGenerator(wordsList);
      fiveLetterWordsArray.push(
        wordsList[num1].toUpperCase(),
        wordsList[num2].toUpperCase(),
        wordsList[num3].toUpperCase()
      );
      console.log(fiveLetterWordsArray);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function addFiveLetterWords() {
  for (let i = 0; i < fiveLetterWordsArray.length; i++) {
    const wordDiv = document.createElement("div");
    const word = fiveLetterWordsArray[i];
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const charSpan = document.createElement("span");
      charSpan.innerHTML = char;
      wordDiv.appendChild(charSpan);
    }
    firstRowContainer.appendChild(wordDiv);
  }
}

function addThreeLetterWords() {
  for (let i = 0; i < threeLetterWordsArray.length; i++) {
    const wordDiv = document.createElement("div");
    const word = threeLetterWordsArray[i];
    wordDiv.classList.add("hidden");
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const charSpan = document.createElement("span");
      charSpan.innerHTML = char;
      wordDiv.appendChild(charSpan);
    }
    firstRowContainer.appendChild(wordDiv);
  }
}

function addLettersUsed(arr) {
  for (let i = 0; i < arr.length; i++) {
    const letterButton = document.createElement("button");
    letterButton.classList.add("letter-btn");
    const char = arr[i];
    letterButton.innerHTML = char;

    lettersCotainer.appendChild(letterButton);
  }

  letterBtns = document.querySelectorAll(".letter-btn");

  letterBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      let inputText = input.value;
      let btnLetter = e.target.textContent;

      if (
        !inputText.includes(btnLetter) &&
        !e.target.classList.contains("pressed")
      ) {
        input.value += e.target.textContent;
      } else {
        let lettersArray = inputText.split("");
        for (let i = 0; i < lettersArray.length; i++) {
          if (btnLetter === lettersArray[i]) {
            lettersArray.splice(i, 1);
            input.value = lettersArray.join("");
          }
        }
      }

      e.target.classList.toggle("pressed");
    });
  });
  enterBtn.addEventListener("click", () => {
    letterBtns.forEach((btn) => {
      if (btn.classList.contains("pressed")) {
        btn.classList.remove("pressed");
      }
    });
  });
}

function randomNumberGenerator(arr) {
  let randomNumber = Math.floor(Math.random() * arr.length);
  return randomNumber;
}

function showLettersUsed() {
  const lettersArray = [];
  for (let i = 0; i < threeLetterWordsArray.length; i++) {
    const word = threeLetterWordsArray[i];
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      if (!lettersArray.includes(char)) {
        lettersArray.push(char);
        if (lettersArray.length > 6) {
          return lettersArray;
        }
      }
    }
  }

  return lettersArray;
}

function checkAnswer() {
  let isMatching = false;
  for (let i = 0; i < threeLetterWordsArray.length; i++) {
    const word = threeLetterWordsArray[i];

    if (input.value === word) {
      hiddenWord.forEach((element) => {
        if (element.textContent === word) {
          element.classList.remove("hidden");
        }
      });

      return true;
    }
  }
  if (!isMatching) {
    return false;
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
shuffleBtn.addEventListener("click", function () {
  shuffleArray(lettersUsedArray);
  lettersCotainer.innerHTML = "";
  addLettersUsed(lettersUsedArray);
  input.value = "";
  letterBtns.forEach((btn) => {
    btn.classList.remove("pressed");
  });
});
enterBtn.addEventListener("click", function () {
  if (checkAnswer) {
    input.value = "";
    return true;
  } else {
    input.value = "";
  }
});
input.addEventListener("input", function () {
  this.value = this.value.toUpperCase();

  letterBtns.forEach((btn) => {
    const btnLetter = btn.textContent;
    if (lettersUsedArray.includes(btnLetter)) {
      if (this.value.includes(btnLetter)) {
        btn.classList.add("pressed");
      } else {
        btn.classList.remove("pressed");
      }
    }
  });
});
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && checkAnswer()) {
    console.log("true");
    this.value = "";
    letterBtns.forEach((btn) => {
      btn.classList.remove("pressed");
    });
  } else if (e.key === "Enter" && !checkAnswer()) {
    console.log("False");
    letterBtns.forEach((btn) => {
      btn.classList.remove("pressed");
    });
    this.value = "";
  }
});
