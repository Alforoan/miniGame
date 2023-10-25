let wordCount = 500;
let wordsArray = [];
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;
const wordsArraySpan = document.querySelector(".words-array");
const startBtn = document.querySelector(".start-btn");
const input = document.querySelector(".input");

startBtn.addEventListener("click", () => loadWords(20));

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

  //wordsArraySpan.textContent = randomWords.join(" ");
  randomWords
    .join(" ")
    .split("")
    .forEach((char) => {
      const charSpan = document.createElement("span");
      charSpan.innerText = char;
      wordsArraySpan.appendChild(charSpan);
    });

  input.value = "";
}

//below is the second best
input.addEventListener("input", function () {
  let randomWordsArray = wordsArraySpan.textContent;
  let characters = wordsArraySpan.querySelectorAll("span");
  let typedChar = input.value.split("");
  let mistakes = 0;

  for (let i = 0; i < characters.length; i++) {
    if (i < typedChar.length && typedChar[i] === randomWordsArray[i]) {
      characters[i].classList.add("highlight");
    } else if (i < typedChar.length && typedChar[i] !== randomWordsArray[i]) {
      characters[i].classList.add("mistake");
      mistakes++;
      console.log(mistakes);
    } else {
      characters[i].classList.remove("highlight");
    }
  }
});
