let wordCount = 500;
let wordsArray = [];
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;
const wordsArraySpan = document.querySelector(".words-array");
const resetBtn = document.querySelector(".reset-btn");
const input = document.querySelector(".input");
const refreshBtn = document.querySelector(".fa-refresh");
let randWordsArray = [];

loadWords(20);
resetBtn.addEventListener("click", () => loadWords(20));
resetBtn.addEventListener("click", () => {
  refreshBtn.classList.toggle("rotate");
});
input.addEventListener("input", startGame);

async function loadWords(numberOfWords) {
  wordsArraySpan.innerHTML = "";
  const randomWords = await fetch(url)
    .then((data) => data.json())
    .then((data) => {
      const filteredData = data.filter((word) => {
        return word.length < 8;
      });
      return filteredData.slice(0, numberOfWords);
    });
  for (let i = 0; i < randomWords.length; i++) {
    randomWords[i] = randomWords[i] + " ";
  }
  randWordsArray = [...randomWords];

  for (let i = 0; i < randomWords.length; i++) {
    const wordSpan = document.createElement("span");
    const word = randomWords[i];

    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const letterSpan = document.createElement("span");
      letterSpan.innerText = char;
      letterSpan.classList.add("letter-span");
      wordSpan.appendChild(letterSpan);
    }
    wordSpan.classList.add("word-span");
    wordsArraySpan.appendChild(wordSpan);
  }

  input.value = "";
  let characters = wordsArraySpan.querySelectorAll(".letter-span");

  characters[0].classList.add("current-letter-highlight");
}

const game = {
  mistakes: 0,
  i: 0,
  j: 0,
};

let gameArray = "";
function startGame() {
  let randomWordsArray = wordsArraySpan.textContent;
  let characters = wordsArraySpan.querySelectorAll(".letter-span");
  let words = wordsArraySpan.querySelectorAll(".word-span");
  let typedChar = input.value.split("");
  let currentWord = words[game.i].querySelectorAll(".letter-span");

  characters[0].classList.remove("current-letter-highlight");

  characters[0].classList.remove("current-letter-highlight");

  if (typedChar.join("") === randWordsArray[game.i]) {
    words[game.i].classList.add("word-highlight");
    input.value = "";
    for (let i = 0; i < randWordsArray[game.i].length; i++) {
      gameArray += randWordsArray[game.i][i];
    }

    game.i++;

    game.j = 0;
  }
  console.log("game.j", game.j);
  console.log(randomWordsArray[game.j]);
  console.log(randomWordsArray[game.j + 1]);

  if (typedChar[game.j] === randWordsArray[game.i][game.j]) {
    currentWord[game.j].classList.add("highlight");
    game.j++;
  }
}
