const randomNumber = Math.floor(Math.random() * 5);
const box = document.getElementById(`box-${randomNumber}`);
const boxes = document.querySelectorAll(".box-container");
const startBtn = document.querySelector(".start-btn");
let boxesArray = [];

startBtn.addEventListener("click", function () {
  this.disabled = true;
  this.style.cursor = "auto";
});

startBtn.addEventListener("click", function () {
  startGame();

  boxes.forEach((box) => {
    box.addEventListener("click", function (e) {
      if (e.target.classList.contains(`box-${randomNumber}`)) {
        console.log("correct");
      } else {
        startBtn.disabled = false;
      }
    });
  });
});

function startGame() {
  if (startBtn.disabled) {
    box.style.background = "blue";
  }
  setTimeout(() => {
    box.style.background = "#f1f1f1";
  }, 1000);
  boxesArray.push(randomNumber);
}
