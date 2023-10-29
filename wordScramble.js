const firstRowContainer = document.querySelector(".first-row-container");
const test = document.querySelector(".test");

let fiveLetterWordsArray = [];

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
        wordsList[num1],
        wordsList[num2],
        wordsList[num3]
      );
      console.log(fiveLetterWordsArray);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
fetchFiveLetterWordsData();

function addWords() {
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

function randomNumberGenerator(arr) {
  let randomNumber = Math.floor(Math.random() * arr.length);
  return randomNumber;
}

test.addEventListener("click", function () {
  console.log("test");
  addWords();
});

addWords();
