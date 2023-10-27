let wordCount = 500;
let wordsArray = [];
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;
const wordsArraySpan = document.querySelector(".words-array");
const resetBtn = document.querySelector(".reset-btn");
const input = document.querySelector(".input");
const refreshBtn = document.querySelector(".fa-refresh");
const timeContainer = document.querySelector(".time-container");
let randWordsArray = [];

loadWords(50);
resetBtn.addEventListener("click", () => loadWords(50));

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
  correct: 0,
  mistakes: 0,
  i: 0,
  j: 0,
};

input.addEventListener("keydown", function (e) {
  if (e.key === " ") {
    e.preventDefault();
    if (
      input.value.split("")[game.j - 1] ===
        randWordsArray[game.i][game.j - 1] &&
      input.value.length > 0
    ) {
      game.i++;
      console.log(game.i);
      input.value = "";
      game.j = 0;
    } else {
      game.i = game.i;
    }
  }
});

input.addEventListener("keydown", function (e) {
  if (e.key === "Backspace" && game.j > 0) {
    game.j--;
    game.mistakes--;
  }
});

function startGame() {
  let words = wordsArraySpan.querySelectorAll(".word-span");
  let typedChar = input.value.split("");
  let currentWord = words[game.i].querySelectorAll(".letter-span");

  //removing words if i type a certain number correctly
  // if (game.i % 4 === 0 && game.i !== 0) {
  //   if (wordsArraySpan && randWordsArray) {
  //     let newArray = randWordsArray
  //       .slice(game.i, randWordsArray.length)
  //       .join(" ");
  //     wordsArraySpan.textContent = newArray;
  //     game.i = 0;
  //     // console.log("game.i", game.i);
  //     // console.log("randwordsarray[game.i]", randWordsArray[game.i]);
  //   }
  // }

  //applies highlight
  for (let j = 0; j < randWordsArray[game.i].length; j++) {
    if (j === typedChar.length) {
      currentWord[j].classList.add("current-letter-highlight");
    } else {
      currentWord[j].classList.remove("current-letter-highlight");
    }
  }

  //removes all highlight to current word if input box is empty
  if (typedChar.length === 0) {
    game.j = 0;
    for (let i = 0; i < currentWord.length; i++) {
      currentWord[i].classList.remove("highlight");
      currentWord[i].classList.remove("mistake");
    }
  }

  //applying/removing highlight and applying/removing mistake
  if (typedChar[game.j] === randWordsArray[game.i][game.j]) {
    game.correct++;

    currentWord[game.j].classList.add("highlight");
    game.j++;
  } else if (randWordsArray[game.i][game.j] === " ") {
    input.value = "";
    game.j = 0;
    game.i++;
  } else if (typedChar[game.j] !== randWordsArray[game.i][game.j]) {
    game.mistakes++;

    currentWord[game.j].classList.add("mistake");
    game.j++;
  }
  if (typedChar.length < game.j) {
    game.j--;
    currentWord[game.j].classList.remove("highlight");
    currentWord[game.j].classList.remove("mistake");
  }
}

function startTimer(time) {
  const startTime = Date.now();
  const updateInterval = 1000;

  const updateElapsedTime = () => {
    const delta = Date.now() - startTime;

    const remainingSeconds = time - Math.floor(delta / 1000);

    const nonNegativeSeconds = Math.max(0, remainingSeconds);

    const minutes = Math.floor(nonNegativeSeconds / 60);
    const seconds = nonNegativeSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    timeContainer.textContent = `${formattedMinutes}:${formattedSeconds}`;
  };

  setInterval(updateElapsedTime, updateInterval);
}
