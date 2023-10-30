const firstRowContainer = document.querySelector(".first-row-container");
const test = document.querySelector(".test");

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

test.addEventListener("click", () => showLettersUsed());
