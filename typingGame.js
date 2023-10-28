let wordCount = 500;
let wordsArray = [];
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;
const wordsArraySpan = document.querySelector(".words-array");
const resetBtn = document.querySelector(".reset-btn");
const input = document.querySelector(".input");
const refreshBtn = document.querySelector(".fa-refresh");
const timeContainer = document.querySelector(".time-container");
let randWordsArray = [];
let timeInterval;
let timeIntervalArray = [];
let timerStarted = false;
let currentWordQuery;
let currentLetterQuery;

resetBtn.addEventListener("click", () => {
  loadWords(2);
  refreshBtn.classList.add("rotate");

  setTimeout(() => {
    refreshBtn.classList.remove("rotate");
  }, 500);

  input.disabled = false;
  timeContainer.textContent = "0:10";
  for (let i = 0; i < timeIntervalArray.length; i++) {
    clearInterval(timeIntervalArray[i]);
  }
  timerStarted = false;

  game.mistakes = 0;
  game.i = 0;
  game.j = 0;
});
input.addEventListener("input", startGame);
input.addEventListener("input", () => {
  if (!timerStarted) {
    setTimeout(() => {
      startTimer(100);
      timerStarted = true;
    }, 100);
  }
});

loadWords(20);
async function loadWords(numberOfWords) {
  wordsArraySpan.innerHTML = "";
  const randomWords = await fetch(url)
    .then((data) => data.json())
    .then((data) => {
      const filteredData = data.filter((word) => {
        return word.length < 7;
      });
      return filteredData.slice(0, numberOfWords);
    });

  for (let i = 0; i < randomWords.length; i++) {
    randomWords[i] = randomWords[i] + " ";
  }

  for (let i = 0; i < randomWords.length; i++) {
    const wordSpan = document.createElement("span");
    let word = randomWords[i];
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const letterSpan = document.createElement("span");
      if (char === " ") {
        letterSpan.innerHTML = "&nbsp;";
      } else {
        letterSpan.innerHTML = char;
      }
      letterSpan.classList.add("letter-span");
      wordSpan.appendChild(letterSpan);
    }
    wordSpan.classList.add("word-span");

    wordsArraySpan.appendChild(wordSpan);
  }

  randWordsArray = [...randomWords];

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
    let currentWordSpans = wordsArraySpan.querySelectorAll(".word-span");
    //if you complete all the words
    if (game.i === randWordsArray.length - 1) {
      input.disabled = true;

      clearInterval(timeInterval);
    }
    if (
      input.value.length > 0 &&
      input.value.length + 1 === randWordsArray[game.i].length &&
      randWordsArray[game.i][game.j - 1] === input.value[game.j - 1]
    ) {
      input.value = "";

      currentWordSpans = wordsArraySpan.querySelectorAll(".word-span");
      let currentWordLetterSpans =
        currentWordSpans[game.i].querySelectorAll(".letter-span");
      let nextWordLetterSpans =
        currentWordSpans[game.i + 1]?.querySelectorAll(".letter-span");
      currentWordLetterSpans[game.j].classList.remove(
        "current-letter-highlight"
      );

      game.i++;

      game.j = 0;
      console.log("game.i", game.i);
      nextWordLetterSpans[game.j].classList.add("current-letter-highlight");
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

  //applies current letter highlight

  for (let j = 0; j < randWordsArray[game.i].length; j++) {
    if (j === typedChar.length) {
      currentWord[j].classList.add("current-letter-highlight");
    } else if (j !== typedChar.length) {
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

  if (typedChar.length + 1 > randWordsArray[game.i].length) {
    game.i++;
    game.j = 0;
    input.value = "";
  }

  //applying/removing highlight and applying/removing mistake
  if (typedChar[game.j] === randWordsArray[game.i][game.j]) {
    game.correct++;
    currentWord[game.j].classList.add("highlight");
    game.j++;
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
    const formattedMinutes = String(Math.min(999, minutes)).padStart(1, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    timeContainer.textContent = `${formattedMinutes}:${formattedSeconds}`;
    if (timeContainer.textContent === "0:00") {
      input.disabled = true;
    }
  };

  timeInterval = setInterval(updateElapsedTime, updateInterval);
  timeIntervalArray.push(timeInterval);
  return timeInterval;
}
