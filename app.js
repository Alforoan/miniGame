const boxes = document.querySelectorAll(".box-container");
const startBtn = document.querySelector(".start-btn");
let sequence = [];
let playerSequence = [];
let level = 1;
let sequenceRunning = false;

startBtn.addEventListener("click", function () {
  this.disabled = true;
  this.style.cursor = "auto";
  startGame();
});

boxes.forEach((box) => {
  box.addEventListener("click", function (e) {
    if (!sequenceRunning && startBtn.disabled === true) {
      let boxNumber = parseInt(e.target.getAttribute("data-id"));

      let popped = sequence.shift();

      if (popped !== boxNumber) {
        gameOver();
        return;
      }

      if (sequence.length === playerSequence.length) {
        level++;
        generateSequence();
        playSequence();
      }
    }
  });
});

function startGame() {
  playerSequence = [];
  generateSequence();
  playSequence();
}

function gameOver() {
  level = 1;
  startBtn.disabled = false;
  console.log("you suck try again");
}

function generateSequence() {
  sequence = [];
  for (let i = 0; i < level; i++) {
    while (true) {
      let randomNumber = Math.floor(Math.random() * 5);
      if (sequence.length >= 1) {
        if (randomNumber !== sequence[sequence.length - 1]) {
          sequence.push(randomNumber);
          break;
        }
      } else {
        sequence.push(randomNumber);
        break;
      }
    }
  }
}

function playSequence() {
  sequenceRunning = true;
  let i = 0;
  function colorNextBox() {
    if (i < sequence.length) {
      const box = document.getElementById(`box-${sequence[i]}`);
      box.style.backgroundColor = "blue";
      setTimeout(() => {
        box.style.backgroundColor = "#f1f1f1";
        i++;
        colorNextBox();
      }, 1000);
    } else {
      sequenceRunning = false;
    }
  }
  colorNextBox();
}
