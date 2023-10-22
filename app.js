const boxes = document.querySelectorAll(".box-container");
const startBtn = document.querySelector(".start-btn");
const scoreText = document.querySelector(".score");
const highScoreText = document.querySelector(".high-score");
let sequence = [];
let level = 1;
let sequenceRunning = false;
let score = 0;
let highScore = 0;

highScoreText.textContent = `High Score: ${level - 1}`;

startBtn.addEventListener("click", function () {
  this.disabled = true;
  this.style.cursor = "auto";
  startGame();
});

boxes.forEach((box) => {
  box.addEventListener("click", function (e) {
    if (!sequenceRunning && startBtn.disabled === true) {
      box.style.cursor = "pointer";
      let boxNumber = parseInt(e.target.getAttribute("data-id"));
      colorUserInputBox(boxNumber);
      let popped = sequence.shift();

      if (popped !== boxNumber) {
        gameOver();
        scoreText.textContent = `Score: ${level}`;
        return;
      }

      if (sequence.length === 0) {
        scoreText.textContent = `Score: ${level}`;
        playNextLevel();
      }
    }
  });
});
function colorUserInputBox(boxNumber) {
  const box = document.querySelector(`[data-id="${boxNumber}"]`);
  box.style.backgroundColor = "skyblue";
  setTimeout(() => {
    box.style.backgroundColor = "#f1f1f1";
  }, 120);
}
function playNextLevel() {
  level++;
  if (level === 6) {
    console.log("you have beaten the game!");
    gameOver();
    return;
  }
  generateSequence();
  setTimeout(() => {
    playSequence();
  }, 1000);
}

function startGame() {
  generateSequence();
  playSequence();
}

function gameOver() {
  level = 1;
  startBtn.disabled = false;
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
