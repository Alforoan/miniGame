let wordCount = 500;
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;
let wordsArray = [];
const startBtn = document.querySelector(".start-btn");

startBtn.addEventListener("click", function () {
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      const filteredData = data.filter((word) => {
        return word.length < 7;
      });
      return filteredData;
    })
    .then((filteredData) => {
      wordsArray = filteredData.slice(0, 10);
      wordsArraySpan.textContent = wordsArray.join(" ");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
