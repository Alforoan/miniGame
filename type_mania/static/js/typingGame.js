let wordCount = 300;
let wordsArray = [];
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;
const wordsArraySpan = document.querySelector(".words-array");
const resetBtn = document.querySelector(".reset-btn");
const input = document.querySelector(".input");
const refreshBtn = document.querySelector(".fa-refresh");
const timeContainer = document.querySelector(".time-container");
const recordWpmNumber = document.querySelector(".wpm-record-number");
const currentWpm = document.querySelector(".wpm-number");
const correctNumber = document.querySelector(".correct-number");
const incorrectNumber = document.querySelector(".incorrect-number");
const accuracyNumber = document.querySelector(".accuracy-number");
const btn = document.querySelectorAll(".btn");
const textContainer = document.querySelector(".text-article");
const wpmBtns = document.querySelectorAll(".wpmBtns");
const timeBtns = document.querySelectorAll(".timeBtns");
const wpmContainer = document.querySelector(".wpm-container");
const navbarBtn = document.querySelector(".navbar-btn");
const navbar = document.querySelector(".navbar");
const urlToChange = 'http://127.0.0.1:8000';
const unreadMessageCount = document.getElementById('unread-message-counter');

let randWordsArray = [];
let timeInterval;
let timeIntervalArray = [];
let timerStarted = false;
let currentWordQuery;
let currentLetterQuery;
let maxTime = 60;
let startTime;
let endTime;
let score = 0;
let username = null;
let isUserExists = false;

async function getUnreadMessageCounter() {
  try {
    const response = await fetch(
      `${urlToChange}/recall_it/fetch_unread_message_count/`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    const data = await response.json();
    let unread_message_count = data.unread_message_count;
    if (unread_message_count > 0) {
      unreadMessageCount.textContent = unread_message_count;
    } else {
      unreadMessageCount.style.display = 'none';
    }
    console.log('UNREAD MESSAGES COUNT ', data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

getUnreadMessageCounter();
setInterval(() => {
  getUnreadMessageCounter();
}, 30000);

async function getScore() {
  try {
    const response = await fetch(
      `${urlToChange}/type_mania/api/score/get/`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    const data = await response.json();
    score = data?.score;
    username = data?.user;
    console.log({score});
    if (username !== null) {
      isUserExists = true;
    }
    if (score >= 0) {
      recordWpmNumber.textContent = `${score}`;
    }
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function updateHighScore(score) {
  try {
    const csrftoken = getCookie('csrftoken');
    const response = await fetch(`${urlToChange}/type_mania/api/score/set/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ score: score }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

getScore();


navbarBtn.addEventListener("click", function () {
  navbar.classList.toggle("navbar-show");
});

resetBtn.addEventListener("click", () => {
  let loadWordCount;
  btn.forEach((btn) => {
    if (btn.classList.contains("isActive")) {
      loadWordCount = parseInt(btn.textContent);
    }
  });
  loadWords(loadWordCount);
  refreshBtn.classList.add("rotate");
  game.gameOver = false;
  game.startTime = null;
  currentWpm.textContent = 0;
  setTimeout(() => {
    refreshBtn.classList.remove("rotate");
  }, 500);

  input.disabled = false;
  timeContainer.textContent = "1:00";
  for (let i = 0; i < timeIntervalArray.length; i++) {
    clearInterval(timeIntervalArray[i]);
  }
  timerStarted = false;

  game.counter = 0;
  game.correct = 0;
  game.mistakes = 0;
  game.i = 0;
  game.j = 0;
  correctNumber.textContent = "";
  incorrectNumber.textContent = "";
  accuracyNumber.textContent = "";
});

btn.forEach((eachBtn) => {
  eachBtn.addEventListener("click", (e) => {
    const clickedBtn = e.target;
    if (clickedBtn.textContent == 20) {
      textContainer.style.height = "130px";
    } else if (clickedBtn.textContent == 30) {
      textContainer.style.height = "210px";
    } else {
      textContainer.style.height = "80px";
    }
    clickedBtn.classList.add("isActive");
    loadWords(parseInt(clickedBtn.textContent));
    btn.forEach((btn) => {
      if (btn !== clickedBtn) {
        btn.classList.remove("isActive");
      }
    });
  });
});

wpmBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target === btn) {
      e.target.classList.add("isActive");
      if (e.target.textContent === "Hide") {
        wpmContainer.style.visibility = "hidden";
      } else {
        wpmContainer.style.visibility = "visible";
      }
      wpmBtns.forEach((btn) => {
        if (btn !== e.target) {
          btn.classList.remove("isActive");
        }
      });
    }
  });
});

timeBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target === btn) {
      e.target.classList.add("isActive");
      if (e.target.textContent === "Hide") {
        timeContainer.style.visibility = "hidden";
      } else {
        timeContainer.style.visibility = "visible";
      }
      timeBtns.forEach((btn) => {
        if (btn !== e.target) {
          btn.classList.remove("isActive");
        }
      });
    }
  });
});

input.addEventListener("input", startGame);
input.addEventListener("input", () => {
  if (!timerStarted) {
    setTimeout(() => {
      startTimer(60);
      timerStarted = true;
    }, 50);
  }
});

loadWords(10);
async function loadWords(numberOfWords) {
  wordsArraySpan.innerHTML = "";
  const randomWords = await fetch(url)
    .then((data) => data.json())
    .then((data) => {
      const filteredData = data.filter((word) => {
        return word.length < 6;
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
  counter: 0,
  correct: 0,
  mistakes: 0,
  i: 0,
  j: 0,
  startTime: null,
  intervalId: null,
  wpmIntervalId: null,
  gameOver: false,
};

//localstorage for wpm
let recordWpm = parseInt(localStorage.getItem("wpm")) || 0;
if (localStorage.getItem("wpm") !== null) {
  recordWpmNumber.textContent = recordWpm;
}

input.addEventListener("keydown", function (e) {
  if (e.key === " ") {
    e.preventDefault();
    let currentWordSpans = wordsArraySpan.querySelectorAll(".word-span");
    if (input.value + " " === randWordsArray[game.i]) {
      game.counter++;
    }
    //if you complete all the words
    if (
      game.i === randWordsArray.length - 1 &&
      input.value.length === randWordsArray[game.i].length - 1
    ) {
      input.disabled = true;
      game.gameOver = true;
      for (let i = 0; i < timeIntervalArray.length; i++) {
        clearInterval(timeIntervalArray[i]);
      }
      if(isUserExists){
          if (parseInt(currentWpm.textContent) > parseInt(score)) {
            console.log("i am better");
            updateHighScore(parseInt(currentWpm.textContent));
            recordWpmNumber.textContent = currentWpm.textContent;
          }
      }else {
        if (parseInt(currentWpm.textContent) > recordWpm) {
          localStorage.setItem('wpm', parseInt(currentWpm.textContent));
          recordWpmNumber.textContent = currentWpm.textContent;
        }
      }
      correctNumber.textContent = game.correct;
      incorrectNumber.textContent = game.mistakes;
      let accuracyPercent =
        (game.correct / (game.correct + game.mistakes)) * 100;
      accuracyNumber.textContent = `${Math.round(accuracyPercent)}%`;
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

      nextWordLetterSpans[game.j].classList.add("current-letter-highlight");
    } else if (
      input.value.length > 0 &&
      input.value.length + 1 === randWordsArray[game.i].length &&
      randWordsArray[game.i][game.j - 1] !== input.value[game.j - 1]
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
  let nextWord = words[game.i + 1]?.querySelectorAll(".letter-span");
  let timeContainer = document.querySelector(".time-container");
  let timeLeft = timeContainer.textContent;
  let remainingTimeInSeconds = parseInt(timeLeft.slice(2, 4));


  if (!game.startTime) {
    game.startTime = Date.now();
    game.intervalId = startTimer(maxTime);
    game.wpmIntervalId = setInterval(updateWpm, 100); 
  }

  //if user doesn't press spacebar for last word
  if (
    game.i === randWordsArray.length - 1 &&
    typedChar.length - 1 === randWordsArray[game.i].length - 1
  ) {
    input.disabled = true;

    for (let i = 0; i < timeIntervalArray.length; i++) {
      clearInterval(timeIntervalArray[i]);
    }
    if (parseInt(currentWpm.textContent) > recordWpm) {
      localStorage.setItem("wpm", parseInt(currentWpm.textContent));
      recordWpmNumber.textContent = currentWpm.textContent;
    }
    correctNumber.textContent = game.correct;
    incorrectNumber.textContent = game.mistakes;
    let accuracyPercent = (game.correct / (game.correct + game.mistakes)) * 100;
    accuracyNumber.textContent = `${Math.round(accuracyPercent)}%`;
  }

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

  //applying/removing highlight and applying/removing mistake
  if (typedChar[game.j] === randWordsArray[game.i][game.j]) {
    game.correct++;
    currentWord[game.j].classList.add("highlight");
    game.j++;
  } else if (typedChar[game.j] !== randWordsArray[game.i][game.j]) {
    if (randWordsArray[game.i][game.j] === " ") {
      game.j = 0;
      game.i++;
      input.value = "";
      nextWord[game.j].classList.add("current-letter-highlight");
    } else {
      game.mistakes++;

      currentWord[game.j].classList.add("mistake");
      game.j++;
    }
  }
  if (typedChar.length < game.j) {
    game.j--;
    currentWord[game.j].classList.remove("highlight");
    currentWord[game.j].classList.remove("mistake");
  }
}

const updateWpm = () => {

   if (game.gameOver && input.disabled === true) {
     clearInterval(game.wpmIntervalId);
     game.gameOver = false;
     return;
   }

  const elapsedTimeInSeconds = (Date.now() - game.startTime) / 1000;
  const remainingTimeInSeconds = maxTime - Math.floor(elapsedTimeInSeconds);

  if (remainingTimeInSeconds <= 0) {
    clearInterval(game.wpmIntervalId);
    return;
  }

  const wpm = Math.round(
    game.counter / ((maxTime - remainingTimeInSeconds) / 60)
  );
  const wpmContent = document.querySelector('.wpm-number');

  if (!isNaN(wpm) && wpm !== Infinity) {
    wpmContent.textContent = wpm;
  } else {
    wpmContent.textContent = 0;
  }
};

function startTimer(time) {
  const startTime = Date.now();
  const updateInterval = 100;

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
      clearInterval(timeInterval);
      clearInterval(game.wpmIntervalId);
    }
  };

  timeInterval = setInterval(updateElapsedTime, updateInterval);
  timeIntervalArray.push(timeInterval);
  return timeInterval;
}
