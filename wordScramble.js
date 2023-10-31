const firstRowContainer = document.querySelector(".first-row-container");
const lettersCotainer = document.querySelector(".letters-container");
const enterBtn = document.querySelector(".enter");
const input = document.querySelector(".input");
const shuffleBtn = document.querySelector(".shuffle-btn");
const progressBtn = document.querySelector(".progress-btn");
let progressPercent;
let hiddenWord;
let hiddenLetter;
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
      //allThreeLetterWords = [...wordsList];
      let generatedWords = generateThreeWordsArray(wordsList);
      threeLetterWordsArray = [...generatedWords];
      let lettersUsed = showLettersUsed(generatedWords);

      //console.log("letters used before if block", lettersUsed);
      if (lettersUsed.length <= 7) {
        addLettersUsed(lettersUsed);

        addThreeLetterWords(generatedWords);
        hiddenWord = document.querySelectorAll(".hidden");
        hiddenLetter = document.querySelectorAll(".hidden-span");
      } else {
        while (lettersUsed.length > 7) {
          let generatedWords = generateThreeWordsArray(wordsList);
          lettersUsed = showLettersUsed(generatedWords);
          threeLetterWordsArray = [...generatedWords];
          if (lettersUsed.length <= 7) {
            addLettersUsed(lettersUsed);
            addThreeLetterWords(generatedWords);
            hiddenWord = document.querySelectorAll(".hidden");
            hiddenLetter = document.querySelectorAll(".hidden-span");

            break;
          }
        }
      }

      lettersUsedArray = [...lettersUsed];
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
fetchthreeLetterWordsData();

function generateThreeWordsArray(wordsArray) {
  let attempts = 0;
  let newArr = [];
  while (newArr.length < 3 && attempts < wordsArray.length) {
    let randomIndex = randomNumberGenerator(wordsArray.length);

    newArr.push(wordsArray[randomIndex].toUpperCase());
    attempts++;
  }
  return newArr;
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

function addThreeLetterWords(arr) {
  for (let i = 0; i < arr.length; i++) {
    const wordDiv = document.createElement("div");
    const word = arr[i];
    wordDiv.classList.add("hidden");
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const charSpan = document.createElement("span");
      charSpan.innerHTML = char;
      charSpan.classList.add("hidden-span");
      wordDiv.appendChild(charSpan);
    }
    firstRowContainer.appendChild(wordDiv);
  }
}

function addLettersUsed(arr) {
  arr = arr.join("");
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

function randomNumberGenerator(num) {
  let randomNumber = Math.floor(Math.random() * num);
  return randomNumber;
}

function showLettersUsed(arr) {
  const combinedWord = arr.join("");
  const letterSet = new Set(combinedWord);
  return [...letterSet];
}

function checkAnswer() {
  let isMatching = false;
  for (let i = 0; i < threeLetterWordsArray.length; i++) {
    const word = threeLetterWordsArray[i];

    if (input.value === word) {
      progressPercent = fillMore();

      hiddenWord.forEach((element) => {
        if (element.textContent === word) {
          element.style.opacity = "1";
          element.classList.remove("hidden");
          let hiddenLetterSpans = element.querySelectorAll(".hidden-span");
          hiddenLetterSpans.forEach((span) => {
            span.style.transition = "all 2s";
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
            hiddenLetterSpans[randomNum].style.transition = "all 2s";
            hiddenLetterSpans[randomNum].classList.remove("hidden-span");
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
  if (e.key === "Enter") {
    if (checkAnswer()) {
      this.value = "";
      letterBtns.forEach((btn) => {
        btn.classList.remove("pressed");
      });
    } else if (!checkAnswer() && allThreeLetterWords.includes(this.value)) {
      console.log("+1");
      letterBtns.forEach((btn) => {
        btn.classList.remove("pressed");
      });
      //add progress bar thing

      this.value = "";
    } else {
      letterBtns.forEach((btn) => {
        btn.classList.remove("pressed");
      });
      this.value = "";
    }
  }
});

progressBtn.addEventListener("click", () => {
  let progress = fillMore();
  if (progress === 100) {
    let randomNum = randomNumberGenerator(3);
    console.log({ randomNum });
    hiddenWord.forEach((element) => {
      if (!element.classList.contains("hidden")) {
        // hiddenLetter[randomNum].classList.remove("hidden-span");
        console.log(hiddenLetter);
        console.log(hiddenLetter[randomNum]);
      }
    });
  }
});

function fillMore() {
  let progressBar = document.querySelector(".progress");
  let progressPercentage;
  if (progressBar.style.width === "0%" || progressBar.style.width === "") {
    progressBar.style.width = "50%";
  } else if (progressBar.style.width === "50%") {
    progressBar.style.width = "100%";
    progressPercentage = 100;
    setTimeout(() => {
      progressBar.style.transition = "none";
    }, 260);

    setTimeout(() => {
      progressBar.style.width = "0";
    }, 500);
  } else {
    progressBar.style.transition = "all 0.3s";
    progressBar.style.width = "0%";
  }
  return progressPercentage;
}
