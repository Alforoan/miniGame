const firstRowContainer = document.querySelector(".first-row-container");
const lettersCotainer = document.querySelector(".letters-container");
const enterBtn = document.querySelector(".enter");
const input = document.querySelector(".input");

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
      let num1 = randomNumberGenerator(wordsList);
      let num2 = randomNumberGenerator(wordsList);
      let num3 = randomNumberGenerator(wordsList);
      threeLetterWordsArray.push(
        wordsList[num1].toUpperCase(),
        wordsList[num2].toUpperCase(),
        wordsList[num3].toUpperCase()
      );
      let threeLetterWordsLettersArray = showLettersUsed(threeLetterWordsArray);
      console.log(threeLetterWordsLettersArray);
      if (threeLetterWordsLettersArray.length <= 7) {
        addThreeLetterWords();
        addLettersUsed(threeLetterWordsLettersArray);
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
  const letterBtns = document.querySelectorAll(".letter-btn");

  letterBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      input.value += e.target.textContent;
      e.target.disabled = true;
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
      return true;
    }
  }
  if (!isMatching) {
    return false;
  }
}

enterBtn.addEventListener("click", () => checkAnswer());
input.addEventListener("input", function () {
  this.value = this.value.toUpperCase();
});
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && checkAnswer()) {
    console.log("true");
    this.value = "";
  }
});

// window.addEventListener("DOMContentLoaded", function () {
//   const letterBtns = document.querySelectorAll(".letter-btn");

//   letterBtns.forEach((btn) => {
//     btn.addEventListener("click", function () {
//       console.log("hi");
//     });
//   });
// });
