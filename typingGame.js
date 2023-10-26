let wordCount = 500;
let wordsArray = [];
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;
const wordsArraySpan = document.querySelector(".words-array");
const resetBtn = document.querySelector(".reset-btn");
const input = document.querySelector(".input");
const refreshBtn = document.querySelector(".fa-refresh");
let randWordsArray = [];

loadWords(50);
resetBtn.addEventListener("click", () => loadWords(20));

resetBtn.addEventListener("click", () => {
  refreshBtn.classList.toggle("rotate");
  game.mistakes = 0;
  game.i = 0;
  game.j = 0;
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

input.addEventListener("keydown", function (e) {
  if (e.key === " ") {
    e.preventDefault();
    if (
      input.value.split("")[game.j - 1] ===
        randWordsArray[game.i][game.j - 1] ||
      input.value.length === randWordsArray[game.i].length - 1
    ) {
      game.i++;
      input.value = "";
      game.j = 0;
    }
  }
});
input.addEventListener("keydown", function (e) {
  if (e.key === "Backspace" && game.j > 0) {
    game.j--;
  }
});

function startGame() {
  let characters = wordsArraySpan.querySelectorAll(".letter-span");
  let words = wordsArraySpan.querySelectorAll(".word-span");
  let typedChar = input.value.split("");
  let currentWord = words[game.i].querySelectorAll(".letter-span");

  characters[0].classList.remove("current-letter-highlight");

  characters[0].classList.remove("current-letter-highlight");

  if (typedChar.length === randWordsArray[game.i].length) {
    input.value = "";
    game.i++;
    game.j = 0;
  }
  // if (randWordsArray[game.i][game.j] === " " && typedChar[game.j] !== " ") {
  //   game.j = 0;
  // }
  console.log("game.j", game.j);

  if (typedChar[game.j] === randWordsArray[game.i][game.j]) {
    currentWord[game.j].classList.add("highlight");
    game.j++;
  } else if (typedChar[game.j] !== randWordsArray[game.i][game.j]) {
    currentWord[game.j].classList.add("mistake");

    game.j++;
  }
  if (typedChar.length < game.j) {
    game.j--;
  }
}
