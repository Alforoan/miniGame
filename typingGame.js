let wordCount = 500;
let wordsArray = [];
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;
const wordsArraySpan = document.querySelector(".words-array");
const resetBtn = document.querySelector(".reset-btn");
const input = document.querySelector(".input");
const refreshBtn = document.querySelector(".fa-refresh");

loadWords(20);
resetBtn.addEventListener("click", () => loadWords(20));
resetBtn.addEventListener("click", () => {
  refreshBtn.classList.toggle("rotate");
});
input.addEventListener("input", startGame);

async function loadWords(numberOfWords) {
  inputArray = [];
  currentIndex = 0;
  wordsArraySpan.innerHTML = "";
  const randomWords = await fetch(url)
    .then((data) => data.json())
    .then((data) => {
      const filteredData = data.filter((word) => {
        return word.length < 8;
      });
      return filteredData.slice(0, numberOfWords);
    });

  randomWords
    .join(" ")
    .split("")
    .forEach((char) => {
      const charSpan = document.createElement("span");
      charSpan.innerText = char;
      wordsArraySpan.appendChild(charSpan);
    });

  input.value = "";
  let characters = wordsArraySpan.querySelectorAll("span");
  characters[0].classList.add("current-letter-highlight");
}

function startGame() {
  let randomWordsArray = wordsArraySpan.textContent;
  let characters = wordsArraySpan.querySelectorAll("span");
  let typedChar = input.value.split("");
  let mistakes = 0;
  characters[0].classList.remove("current-letter-highlight");
  for (let i = 0; i < characters.length; i++) {
    if (i === typedChar.length) {
      characters[i].classList.add("current-letter-highlight");
    } else {
      characters[i].classList.remove("current-letter-highlight");
    }
    if (i < typedChar.length && typedChar[i] === randomWordsArray[i]) {
      characters[i].classList.add("highlight");
    } else if (i < typedChar.length && typedChar[i] !== randomWordsArray[i]) {
      characters[i].classList.add("mistake");
      mistakes++;
    } else {
      characters[i].classList.remove("highlight");
    }
  }
}
