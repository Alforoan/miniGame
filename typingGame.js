let wordCount = 500;
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;
const wordsArray = [];

fetch(url)
  .then((data) => data.json())
  .then((data) => {
    const filteredData = data.filter((word) => {
      return word.length < 7;
    });
    return filteredData;
  })
  .then((filteredData) => {
    wordsArrayDiv.textContent = filteredData.join(" ");
    //console.log(filteredData);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const wordsArrayDiv = document.querySelector(".words-array");
const input = document.querySelector(".input");
input.addEventListener("input", function () {
  console.log(this.value);
});
