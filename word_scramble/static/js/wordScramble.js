const firstRowContainer = document.querySelector(".first-row-container");
const fourLetterWordsContainer = document.querySelector(
  ".four-letter-words-container"
);
const lettersCotainer = document.querySelector(".letters-container");
const enterBtn = document.querySelector(".enter");
const input = document.querySelector(".input");
const shuffleBtn = document.querySelector(".shuffle-btn");
const ultimate = document.querySelector(".ultimate-btn");
const levelText = document.querySelector(".level");
const scoreText = document.querySelector(".score");
const highscoreText = document.querySelector(".highscore");
const checkLevel = document.querySelector(".check-level");
const trashBtn = document.querySelector(".trash-btn");
const deleteBtn = document.querySelector(".delete-btn");
const levelUp = document.getElementById("level-up");
const wordFound = document.getElementById("word-found");
const revealWord = document.getElementById("reveal-word");
const ultimateSound = document.getElementById("ultimate-sound");
const hintBtn = document.querySelector(".hint-button");
const hintBtnContainer = document.querySelector(".hint-button-container");
const hintBtnText = document.querySelector(".hint-button-text");
const laughTrack = document.getElementById("laugh-track");
const navbarBtn = document.querySelector(".navbar-btn");
const navbar = document.querySelector(".navbar");
const hintOptionText = document.querySelector(".hint-button-text");
const testBtn = document.querySelector(".test-btn");
const errorMsg = document.querySelector(".error");
const timeContainer = document.querySelector(".time-container");
const urlToChange = 'http://127.0.0.1:8000';
const unreadMessageCount = document.getElementById('unread-message-counter');

let isTimerRunning = false;
let timeIntervalArray = [];
let progressCount = 20;
let level = 1;
let score = 0;
let highscore = 0;
let progressPercent;
let hiddenFourLetterWord;
let hiddenFourLetterWordLetter;
let hiddenWord;
let hiddenLetter;
let allThreeLetterWords = [];
let allFourLetterWords = [];
let lettersUsedArray = [];
let letterBtns;
let generatedWords;
let fiveLetterWordsArray = [];
let threeLetterWordsArray = [];
let fourLetterWordsArray = [];
let wordsList;
let userScore = 0;
let username = '';
let isUserExists = false;
levelText.textContent = `Level: ${level}`;
scoreText.textContent = `Score: ${score}`;
ultimate.textContent = `Ultimate: ${Math.floor(progressCount / 5)}`;
levelUp.volume = 0.25;
wordFound.volume = 0.25;
revealWord.volume = 0.25;
ultimateSound.volume = 0.25;

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
      `${urlToChange}/word_scramble/api/score/get/`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    const data = await response.json();
    console.log({data});
    userScore = data?.score;
    username = data?.user;
    console.log({ userScore });
    if (username !== null) {
      isUserExists = true;
    }
    if (userScore >= 0) {
      highscoreText.textContent = `High Score: ${userScore}`;
      highscore = localStorage.getItem('highscore');
      if (!isUserExists) {
        if (highscore) {
          highscoreText.textContent = `High Score: ${highscore}`;
        } else {
          highscoreText.textContent = `High Score: 0`;
        }
      } 

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
    const response = await fetch(
      `${urlToChange}/word_scramble/api/score/set/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ score: score }),
        credentials: 'include',
      }
    );
    console.log('response from setting high score', response);
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


async function fetchthreeLetterWordsData() {
  fetch(threeLetterWordsUrl)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      wordsList = data.split('\n');
      wordsList = wordsList.map((word) => word.replace(/\r/g, ''));
      allThreeLetterWords = [...wordsList];
      generatedWords = generateThreeWordsArray(allThreeLetterWords);
      threeLetterWordsArray = [...generatedWords];
      let lettersUsed = showLettersUsed(generatedWords);

      //console.log("letters used before if block", lettersUsed);
      if (lettersUsed.length <= 7) {
        addLettersUsed(shuffleArray(lettersUsed));

        addThreeLetterWords(generatedWords);
        hiddenWord = document.querySelectorAll('.hidden');
        hiddenLetter = document.querySelectorAll('.hidden-span');
      } else {
        while (lettersUsed.length > 7) {
          generatedWords = generateThreeWordsArray(allThreeLetterWords);
          lettersUsed = showLettersUsed(generatedWords);
          threeLetterWordsArray = [...generatedWords];
          if (lettersUsed.length <= 7) {
            addLettersUsed(shuffleArray(lettersUsed));
            addThreeLetterWords(generatedWords);
            hiddenWord = document.querySelectorAll('.hidden');
            hiddenLetter = document.querySelectorAll('.hidden-span');

            break;
          }
        }
      }

      lettersUsedArray = [...lettersUsed];
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}
fetchthreeLetterWordsData();

async function fetchFourLetterWordsData() {
  fetch(fourLetterWordsUrl)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      allFourLetterWords = data.split("\n");
      allFourLetterWords = allFourLetterWords.map((word) =>
        word.replace(/\r/g, "")
      );

      if (level === 2) {
        let fourLetterWordFirst = findWordWithLettersArray(
          lettersUsedArray,
          allFourLetterWords
        );
        let firstIndex = allFourLetterWords.indexOf(
          fourLetterWordFirst?.toLowerCase()
        );

        allFourLetterWords.splice(firstIndex, 1);
        let fourLetterWordSecond = findWordWithLettersArray(
          lettersUsedArray,
          allFourLetterWords
        );
        let secondIndex = allFourLetterWords.indexOf(
          fourLetterWordSecond?.toLowerCase()
        );
        allFourLetterWords.splice(secondIndex, 1);

        fourLetterWordsArray.push(fourLetterWordFirst, fourLetterWordSecond);
        addFourLetterWords(fourLetterWordsArray);
        hiddenFourLetterWord = document.querySelectorAll(".hidden-four");
        hiddenFourLetterWordLetter =
          document.querySelectorAll(".hidden-four-span");
      } else if (level >= 3) {
        let fourLetterWordFirst = findWordWithLettersArray(
          lettersUsedArray,
          allFourLetterWords
        );
        let firstIndex = allFourLetterWords.indexOf(
          fourLetterWordFirst?.toLowerCase()
        );
        allFourLetterWords.splice(firstIndex, 1);

        let fourLetterWordSecond = findWordWithLettersArray(
          lettersUsedArray,
          allFourLetterWords
        );
        let secondIndex = allFourLetterWords.indexOf(
          fourLetterWordSecond?.toLowerCase()
        );
        allFourLetterWords.splice(secondIndex, 1);

        let fourLetterWordThird = findWordWithLettersArray(
          lettersUsedArray,
          allFourLetterWords
        );
        let thirdIndex = allFourLetterWords.indexOf(
          fourLetterWordThird?.toLowerCase()
        );
        allFourLetterWords.splice(thirdIndex, 1);

        fourLetterWordsArray.push(
          fourLetterWordFirst,
          fourLetterWordSecond,
          fourLetterWordThird
        );
        while (fourLetterWordsArray.includes(null)) {
          firstRowContainer.innerHTML = "";
          lettersCotainer.innerHTML = "";
          fourLetterWordsContainer.innerHTML = "";
          fourLetterWordsArray.length = 0;
          fetchthreeLetterWordsData();
          fetchFourLetterWordsData();
          if (!fourLetterWordsArray.includes(null)) {
            break;
          }
        }

        addFourLetterWords(fourLetterWordsArray);
        hiddenFourLetterWord = document.querySelectorAll(".hidden-four");
        hiddenFourLetterWordLetter =
          document.querySelectorAll(".hidden-four-span");
        ultimate.addEventListener("click", () => {
          if (progressCount >= 5) {
            hiddenWord.forEach((word) => {
              word.classList.remove("hidden");
            });
            hiddenFourLetterWord.forEach((word) => {
              word.classList.remove("hidden-four");
            });
          }
        });
      }
    });
}

function generateThreeWordsArray(wordsArray) {
  let attempts = 0;
  let newArr = [];

  while (newArr.length < 3 && attempts < wordsArray.length) {
    let randomIndex = randomNumberGenerator(wordsArray.length);

    newArr.push(wordsArray[randomIndex].toUpperCase());
    wordsArray.splice(randomIndex, 1);

    attempts++;
  }

  return newArr;
}

function addThreeLetterWords(arr) {
  for (let i = 0; i < arr.length; i++) {
    const wordDiv = document.createElement("div");
    const word = arr[i];
    wordDiv.classList.add("hidden");
    wordDiv.classList.add("word");
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const charSpan = document.createElement("span");
      charSpan.innerHTML = char;
      charSpan.classList.add("hidden-span");
      charSpan.classList.add("letter");
      wordDiv.appendChild(charSpan);
    }
    firstRowContainer.appendChild(wordDiv);
  }
}

function addFourLetterWords(arr) {
  for (let i = 0; i < arr.length; i++) {
    const wordDiv = document.createElement("div");
    const word = arr[i];
    wordDiv.classList.add("hidden-four");
    wordDiv.classList.add("four-letter-word");
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const charSpan = document.createElement("span");
      charSpan.innerHTML = char;
      charSpan.classList.add("hidden-four-span");
      charSpan.classList.add("letter");
      wordDiv.appendChild(charSpan);
    }
    fourLetterWordsContainer.appendChild(wordDiv);
  }
}

function addLettersUsed(arr) {
  arr = arr.join("");
  for (let i = 0; i < arr.length; i++) {
    const letterButton = document.createElement("button");
    letterButton.classList.add("btn");
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

function randomNumberGenerator(num) {
  let randomNumber = Math.floor(Math.random() * num);
  return randomNumber;
}

function showLettersUsed(arr) {
  const combinedWord = arr.join("");
  const letterSet = new Set(combinedWord);
  return [...letterSet];
}

function checkLettersUsed(lettersArr, word) {
  const letterSet = new Set(lettersArr.join("").toLowerCase().split(""));
  for (const char of word) {
    if (!letterSet.has(char)) {
      return false;
    }
  }
  return true;
}

function checkWordInArr(arr) {
  if (arr.includes(input.value)) {
    return true;
  }
  return false;
}

function checkAnswer() {
  let isMatching = false;

  for (let i = 0; i < threeLetterWordsArray.length; i++) {
    const word = threeLetterWordsArray[i];

    if (input.value === word) {
      score += 100;
      scoreText.textContent = `Score: ${score}`;
      if (score > userScore) {
        if (isUserExists) {
          updateHighScore(score);
          highscoreText.textContent = `High Score: ${score}`;
        } else {
          if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', score);
            highscoreText.textContent = `High Score: ${highscore}`;
          }
        }
      }
      allThreeLetterWords.splice(
        allThreeLetterWords.indexOf(threeLetterWordsArray[i]),
        1
      );
      threeLetterWordsArray[i] = "";

      hiddenWord.forEach((element) => {
        if (element.textContent === word) {
          progressPercent = fillMore();
          element.style.opacity = "1";
          element.classList.remove("hidden");
          let hiddenLetterSpans = element.querySelectorAll(".hidden-span");
          hiddenLetterSpans.forEach((span) => {
            span.style.transition = "opacity 2s";
            span.classList.remove("hidden-span");
          });
        }
      });
      if (progressPercent === 100) {
        let randomNum = randomNumberGenerator(3);
        console.log({ randomNum });
        hiddenWord.forEach((element) => {
          if (element.classList.contains("hidden")) {
            element.classList.remove("hidden");
            let hiddenLetterSpans = element.querySelectorAll(".hidden-span");
            hiddenLetterSpans[randomNum].style.transition = "opacity 2s";
            hiddenLetterSpans[randomNum].classList.remove("hidden-span");
            randomNum = randomNumberGenerator(3);
          }
        });
        if (level >= 2) {
          hiddenFourLetterWord.forEach((element) => {
            if (element.classList.contains("hidden-four")) {
              element.classList.remove("hidden-four");
              let hiddenLetterSpans =
                element.querySelectorAll(".hidden-four-span");
              hiddenLetterSpans[randomNum].style.transition = "opacity 2s";
              hiddenLetterSpans[randomNum].classList.remove("hidden-four-span");
              randomNum = randomNumberGenerator(3);
            }
          });
        }
      }
      return true;
    }
  }

  if (!isMatching) {
    return false;
  }
}

function checkFourWords() {
  let isMatching = false;
  if (
    allFourLetterWords.includes(input.value.toUpperCase()) &&
    input.value !== fourLetterWordsArray[0] &&
    input.value !== fourLetterWordsArray[1] &&
    input.value !== fourLetterWordsArray[2] &&
    fourLetterWordsArray.join("") !== ""
  ) {
    let index = allFourLetterWords.indexOf(input.value.toLowerCase());
    wordFound.play();
    allFourLetterWords.splice(index, 1);
    fillMore();
  }
  for (let i = 0; i < fourLetterWordsArray.length; i++) {
    const word = fourLetterWordsArray[i];

    if (input.value === word) {
      score += 200;
      scoreText.textContent = `Score: ${score}`;
      if (score > userScore) {
        if (isUserExists) {
          updateHighScore(score);
          highscoreText.textContent = `High Score: ${score}`;
        } else {
          if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', score);
            highscoreText.textContent = `High Score: ${highscore}`;
          }
        }
      }
      fourLetterWordsArray[i] = "";
      hiddenFourLetterWord.forEach((element) => {
        if (element.textContent === word) {
          progressPercent = fillMore();
          element.style.opacity = "1";
          element.classList.remove("hidden-four");
          let hiddenLetterSpans = element.querySelectorAll(".hidden-four-span");
          hiddenLetterSpans.forEach((span) => {
            span.style.transition = "opacity 1s";
            span.classList.remove("hidden-four-span");
          });
        }
      });
      if (progressPercent === 100) {
        let randomNum = randomNumberGenerator(3);
        hiddenWord.forEach((element) => {
          if (element.classList.contains("hidden")) {
            element.classList.remove("hidden");
            let hiddenLetterSpans = element.querySelectorAll(".hidden-span");
            hiddenLetterSpans[randomNum].style.transition = "opacity 1s";
            hiddenLetterSpans[randomNum].classList.remove("hidden-span");
            randomNum = randomNumberGenerator(3);
          }
        });
        hiddenFourLetterWord.forEach((element) => {
          let hasHidden = false;
          if (element.classList.contains("hidden-four")) {
            hasHidden = true;
            element.classList.remove("hidden-four");
            let hiddenLetterSpans =
              element.querySelectorAll(".hidden-four-span");
            hiddenLetterSpans[randomNum].style.transition = "opacity 1s";
            hiddenLetterSpans[randomNum].classList.remove("hidden-four-span");
            randomNum = randomNumberGenerator(2);
          }
          if (!hasHidden) {
            progressCount++;
            ultimate.textContent = `Ultimate: ${Math.floor(progressCount / 5)}`;
          }
        });
      }
      return true;
    }
  }

  if (!isMatching) {
    return false;
  }
}

function checkEndOfLevel() {
  if (threeLetterWordsArray.join("") === "") {
    return true;
  }
  return false;
}

function findWordWithLettersArray(lettersArr, wordsArr) {
  const lettersSet = new Set(lettersArr);

  for (let i = wordsArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordsArr[i], wordsArr[j]] = [wordsArr[j], wordsArr[i]];
  }

  for (let i = 0; i < wordsArr.length; i++) {
    const word = wordsArr[i].toUpperCase();
    let hasAllLetters = true;
    for (let j = 0; j < word.length; j++) {
      if (!lettersSet.has(word[j])) {
        hasAllLetters = false;
        break;
      }
    }
    if (hasAllLetters) {
      return word;
    }
  }
  return null;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function useUltimate() {
  
  if(level === 1){
      errorMsg.classList.remove('hidden-error');
    setTimeout(() => {
      errorMsg.classList.add('hidden-error');
    }, 4000);
    return;
  }

  let hasHiddenCount = 0;

  hiddenWord.forEach((word) => {
    let hiddenLetterSpans = word.childNodes;

    hiddenLetterSpans.forEach((child) => {
      if (child.classList.contains("hidden-span")) {
        hasHiddenCount++;
      }
    });
  });
  hiddenFourLetterWord.forEach((word) => {
    let hiddenLetterSpans = word.childNodes;
    hiddenLetterSpans.forEach((child) => {
      if (child.classList.contains("hidden-four-span")) {
        hasHiddenCount++;
      }
    });
  });

  if (progressCount >= 5 && hasHiddenCount >= 1) {
    hiddenWord.forEach((word) => {
      ultimateSound.play();

      word.classList.remove("hidden");
      let hiddenLetterSpans = word.childNodes;
      hiddenLetterSpans.forEach((child) => {
        child.style.transition = "opacity 1s";
        child.classList.remove("hidden-span");
      });
    });
    hiddenFourLetterWord.forEach((word) => {
      word.classList.remove("hidden-four");
      let hiddenLetterSpans = word.querySelectorAll(".hidden-four-span");
      hiddenLetterSpans.forEach((span) => {
        span.style.transition = "opacity 1s";
        span.classList.remove("hidden-four-span");
      });
    });
    progressCount = progressCount - 5;
    ultimate.textContent = `Ultimate: ${Math.floor(progressCount / 5)}`;
    threeLetterWordsArray = [""];
    fourLetterWordsArray = [""];
  }
}

function fillMore() {
  let progressBar = document.querySelector(".progress");
  let progressPercentage;
  if (progressBar.style.width === "0%" || progressBar.style.width === "") {
    progressBar.style.width = "50%";
  } else if (progressBar.style.width === "50%") {
    progressBar.style.width = "100%";
    progressPercentage = 100;

    let randomNum;
    let hasHidden = false;
    hiddenWord.forEach((element) => {
      randomNum = randomNumberGenerator(3);
      if (element.classList.contains("hidden")) {
        hasHidden = true;
        element.classList.remove("hidden");
        let hiddenLetterSpans = element.querySelectorAll(".hidden-span");
        hiddenLetterSpans[randomNum].style.transition = "opacity 1s";
        hiddenLetterSpans[randomNum].classList.remove("hidden-span");
        randomNum = randomNumberGenerator(3);
      }
    });
    if (!hasHidden) {
      progressCount++;

      ultimate.textContent = `Ultimate: ${Math.floor(progressCount / 5)}`;
    }
    if (level >= 2) {
      hiddenFourLetterWord.forEach((element) => {
        if (element.classList.contains("hidden-four")) {
          element.classList.remove("hidden-four");
          let hiddenLetterSpans = element.querySelectorAll(".hidden-four-span");
          hiddenLetterSpans[randomNum].style.transition = "opacity 1s";
          hiddenLetterSpans[randomNum].classList.remove("hidden-four-span");
          randomNum = randomNumberGenerator(3);
        }
      });
    }

    setTimeout(() => {
      progressBar.style.transition = "none";
    }, 260);

    setTimeout(() => {
      progressBar.style.width = "0";
    }, 500);
  } else {
    progressBar.style.transition = "all 0.3s";
    progressBar.style.width = "50%";
  }
  return progressPercentage;
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
  if (input.value === "") {
    return;
  }
  if (level === 1) {
    if (checkAnswer()) {
      input.value = "";
      if (wordFound.currentTime > 0 && !wordFound.paused && !wordFound.ended) {
        wordFound.currentTime = 0;
      } else {
        wordFound.play();
      }

      letterBtns.forEach((btn) => {
        btn.classList.remove("pressed");
      });
    } else if (
      checkWordInArr(allThreeLetterWords) &&
      checkLettersUsed(lettersUsedArray, input.value.toLowerCase())
    ) {
      allThreeLetterWords.splice(
        allThreeLetterWords.indexOf(input.value.toLowerCase()),
        1
      );
      wordFound.play();
      input.value = "";
      letterBtns.forEach((btn) => {
        btn.classList.remove("pressed");
      });

      fillMore();
    } else {
      input.value = "";
      letterBtns.forEach((btn) => {
        btn.classList.remove("pressed");
      });
    }
  } else if (level >= 2) {
    console.log("testing");
    if (checkAnswer() || checkFourWords()) {
      letterBtns.forEach((btn) => {
        btn.classList.remove("pressed");
      });
      if (wordFound.currentTime > 0 && !wordFound.paused && !wordFound.ended) {
        wordFound.currentTime = 0; // Rewind to the beginning
      } else {
        wordFound.play();
      }

      input.value = "";
    } else if (
      (checkWordInArr(allThreeLetterWords) &&
        checkLettersUsed(lettersUsedArray, input.value.toLowerCase())) ||
      (checkWordInArr(allFourLetterWords) &&
        checkLettersUsed(lettersUsedArray, input.value.toLowerCase()))
    ) {
      input.value = "";
      letterBtns.forEach((btn) => {
        btn.classList.remove("pressed");
      });
      wordFound.play();
      fillMore();
    } else {
      input.value = "";
      letterBtns.forEach((btn) => {
        btn.classList.remove("pressed");
      });
    }
  }
});
ultimate.addEventListener("click", () => useUltimate());

checkLevel.addEventListener("click", function () {
  if (checkEndOfLevel()) {
    score += level * 100;
    scoreText.textContent = `Score: ${score}`;
    if (score > userScore) {
      if (isUserExists) {
        updateHighScore(score);
        highscoreText.textContent = `High Score: ${score}`;
      } else {
        if (score > highscore) {
          highscore = score;
          localStorage.setItem('highscore', score);
          highscoreText.textContent = `High Score: ${highscore}`;
        }
      }
    }
    level++;

    levelUp.play();
    levelText.textContent = `Level: ${level}`;
    firstRowContainer.innerHTML = "";
    lettersCotainer.innerHTML = "";
    fourLetterWordsContainer.innerHTML = "";
    fourLetterWordsArray.length = 0;
    fetchthreeLetterWordsData();
    fetchFourLetterWordsData();
  } else {
    console.log("not yet");
  }
});

input.addEventListener("input", function () {
  this.value = this.value.toUpperCase();
  console.log("changing");
  if (!isTimerRunning) {
    isTimerRunning = true;
    startTimer(180);
  }
  letterBtns.forEach((btn) => {
    const btnLetter = btn.textContent;
    if (lettersUsedArray.includes(btnLetter)) {
      if (this.value.includes(btnLetter)) {
        btn.classList.add("pressed");
        if (!isTimerRunning) {
          isTimerRunning = true;
          startTimer(180);
        }
      } else {
        btn.classList.remove("pressed");
      }
    }
  });
});

hintBtnContainer.addEventListener("click", function (event) {
  const target = event.target;
  
  if(hintBtnText.classList.contains('hidden-active')){
    hintBtnText.classList.remove('hidden-active');
  }else{
    hintBtnText.classList.add('hidden-active');
  }

  if (target.classList.contains("no-btn")) {
    hintOptionText.innerHTML = "";
    hintBtn.innerHTML = `Hint (One time usage)`;
  } else if (target.classList.contains("yes-btn")) {
    hintBtnContainer.innerHTML = `<h3 class="text">Well, too bad :)</h3>`;
    setTimeout(() => {
      laughTrack.style.display = "block";
      laughTrack.play();
    }, 2000);
    laughTrack.addEventListener("ended", function () {
      laughTrack.style.display = "none";
    });
    setTimeout(() => {
      hintBtnContainer.innerHTML = "";
    }, 2000);
  } else if (target.classList.contains("hint-button")) {
    hintOptionText.innerHTML = `
    <h2>Would you like a hint?</h2>
    <button class="yes-btn">Yes</button>
    <button class="no-btn">No</button>
  `;
  }
});


trashBtn.addEventListener("click", function () {
  input.value = "";
  letterBtns.forEach((btn) => {
    btn.classList.remove("pressed");
  });
});

deleteBtn.addEventListener("click", function () {
  console.log("presesed");
  input.value = input.value
    .split("")
    .slice(0, input.value.length - 1)
    .join("");
  letterBtns.forEach((btn) => {
    const btnLetter = btn.textContent;

    if (lettersUsedArray.includes(btnLetter)) {
      if (input.value.includes(btnLetter)) {
        btn.classList.add("pressed");
      } else {
        btn.classList.remove("pressed");
      }
    }
  });
});

navbarBtn.addEventListener("click", function () {
  navbar.classList.toggle("navbar-show");
});

input.addEventListener("keydown", function (e) {
  if (e.key === " ") {
    e.preventDefault();
  }
  if (e.key === "Enter") {
    if (input.value === "") {
      return;
    }
    if (level === 1) {
      if (checkAnswer()) {
        allThreeLetterWords.splice(
          allThreeLetterWords.indexOf(this.value.toLowerCase()),
          1
        );
        this.value = "";
        if (
          wordFound.currentTime > 0 &&
          !wordFound.paused &&
          !wordFound.ended
        ) {
          wordFound.currentTime = 0; // Rewind to the beginning
        } else {
          wordFound.play();
        }

        letterBtns.forEach((btn) => {
          btn.classList.remove("pressed");
        });
      } else if (
        checkWordInArr(allThreeLetterWords) &&
        checkLettersUsed(lettersUsedArray, input.value.toLowerCase())
      ) {
        console.log("another word found");
        allThreeLetterWords.splice(
          allThreeLetterWords.indexOf(this.value.toLowerCase()),
          1
        );
        wordFound.play();
        this.value = "";
        letterBtns.forEach((btn) => {
          btn.classList.remove("pressed");
        });

        fillMore();
      } else {
        this.value = "";
        letterBtns.forEach((btn) => {
          btn.classList.remove("pressed");
        });
      }
    } else if (level >= 2) {
      if (checkAnswer() || checkFourWords()) {
        letterBtns.forEach((btn) => {
          btn.classList.remove("pressed");
        });
        if (
          wordFound.currentTime > 0 &&
          !wordFound.paused &&
          !wordFound.ended
        ) {
          wordFound.currentTime = 0; // Rewind to the beginning
        } else {
          wordFound.play();
        }

        this.value = "";
      } else if (
        (checkWordInArr(allThreeLetterWords) &&
          checkLettersUsed(lettersUsedArray, input.value.toLowerCase())) ||
        (checkWordInArr(allFourLetterWords) &&
          checkLettersUsed(lettersUsedArray, input.value.toLowerCase()))
      ) {
        this.value = "";
        letterBtns.forEach((btn) => {
          btn.classList.remove("pressed");
        });
        allThreeLetterWords.splice(
          allThreeLetterWords.indexOf(this.value.toLowerCase()),
          1
        );
        allFourLetterWords.splice(
          allFourLetterWords.indexOf(this.value.toLowerCase()),
          1
        );
        wordFound.play();
        fillMore();
      } else {
        input.value = "";
        letterBtns.forEach((btn) => {
          btn.classList.remove("pressed");
        });
      }
    }
  }
});

function startTimer(time) {
  const startTime = Date.now();
  const updateInterval = 100;

  const updateElapsedTime = () => {
    const delta = Date.now() - startTime;
    const remainingSeconds = time - Math.floor(delta / 1000);
    const nonNegativeSeconds = Math.max(0, remainingSeconds);
    const minutes = Math.floor(nonNegativeSeconds / 60);
    const seconds = nonNegativeSeconds % 60;
    const formattedMinutes = String(Math.min(999, minutes)).padStart(1, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    timeContainer.textContent = `${formattedMinutes}:${formattedSeconds}`;
    if (timeContainer.textContent === '0:00') {
      input.disabled = true;
      clearInterval(timeInterval);
      isTimerRunning = false;
    }
  };

  timeInterval = setInterval(updateElapsedTime, updateInterval);
  timeIntervalArray.push(timeInterval);
  return timeInterval;
}