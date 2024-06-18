const boxes = document.querySelectorAll(".box-container");
const startBtn = document.querySelector(".start-btn");
const startBtnHard = document.querySelector(".start-btn-hard");
const scoreText = document.querySelector(".score");
const highScoreText = document.querySelector(".high-score");
const navbarBtn = document.querySelector(".navbar-btn");
const navbar = document.querySelector(".navbar");
const lightBoxSound = document.getElementById("box-light");
const error = document.getElementById("error");
const normalBtn = document.querySelector(".normal-btn");
const hardBtn = document.querySelector(".hard-btn");
const boxContainer2 = document.querySelector(".box-container2");
const boxContainer = document.querySelector(".box-container");
const normalContainer = document.querySelector(".normal-container");
const hardContainer = document.querySelector(".hard-container");
const boxesHard = document.querySelectorAll(".box2");
const scoreHard = document.querySelector(".score-hard");
const highScoreHard = document.querySelector(".high-score-hard");

let sequence = [];
let sequenceHard = [];
let level = 1;
let sequenceRunning = false;
let currentHighScore = 0;
let maxHighScore = 0;
let maxHighScoreHard = 0;
error.volume = 0.3;
lightBoxSound.volume = 0.5;

highScoreText.textContent = `High Score: ${level - 1}`;

if (localStorage.getItem("highScore") !== null) {
  maxHighScore = parseInt(localStorage.getItem("highScore"));
  highScoreText.textContent = `High Score: ${maxHighScore}`;
}

if (localStorage.getItem("highScoreHard") !== null) {
  maxHighScoreHard = parseInt(localStorage.getItem("highScoreHard"));
  highScoreHard.textContent = `High Score: ${maxHighScoreHard}`;
} else {
  console.log("is null");
  highScoreHard.textContent = "High Score: 0";
}

navbarBtn.addEventListener("click", function () {
  navbar.classList.toggle("navbar-show");
});

startBtn.addEventListener("click", function () {
  console.log("start btn clicked");
  this.disabled = true;
  this.style.cursor = "auto";
  startGame();
});

startBtnHard.addEventListener("click", function () {
  this.disabled = true;
  this.style.cursor = "auto";
  startGameHard();
});

hardBtn.addEventListener("click", function () {
  console.log("hard btn was clicked");
  hardContainer.classList.remove("box-hidden");
  normalContainer.classList.add("box-hidden");
  sequence = [];
  sequenceHard = [];
  level = 1;
  sequenceRunning = false;
  currentHighScore = 0;
  gameOver();
});

normalBtn.addEventListener("click", function () {
  normalContainer.classList.remove("box-hidden");
  hardContainer.classList.add("box-hidden");
  sequence = [];
  sequenceHard = [];
  level = 1;
  sequenceRunning = false;
  currentHighScore = 0;
  gameOverHard();
});

boxesHard.forEach((box) => {
  box.addEventListener("click", function (e) {
    console.log(sequenceRunning);
    if (!sequenceRunning && startBtnHard.disabled === true) {
      box.style.cursor = "pointer";
      let boxNumber = parseInt(e.target.getAttribute("data-id"));
      console.log({ boxNumber });
      let popped = sequenceHard.shift();
      console.log({ popped });
      if (popped !== boxNumber) {
        selectWrongBoxHard(e);
        return;
      } else {
        selectCorrectBoxHard(e);
      }

      if (sequenceHard.length === 0) {
        scoreHard.textContent = `Score: ${level}`;
        currentHighScore = level;
        if (currentHighScore > maxHighScoreHard) {
          maxHighScoreHard = currentHighScore;
          highScoreHard.textContent = `High Score: ${maxHighScoreHard}`;

          localStorage.setItem("highScoreHard", maxHighScoreHard.toString());
          console.log("level passed");
        }

        playNextLevelHard();
      }
    }
  });
});

boxes.forEach((box) => {
  box.addEventListener("click", function (e) {
    if (!sequenceRunning && startBtn.disabled === true) {
      box.style.cursor = "pointer";
      let boxNumber = parseInt(e.target.getAttribute("data-id"));

      //colorUserInputBox(boxNumber);
      let popped = sequence.shift();

      if (popped !== boxNumber) {
        selectWrongBox(e);
        return;
      } else {
        selectCorrectBox(e);
      }

      if (sequence.length === 0) {
        scoreText.textContent = `Score: ${level}`;
        currentHighScore = level;
        if (currentHighScore > maxHighScore) {
          maxHighScore = currentHighScore;
          highScoreText.textContent = `High Score: ${maxHighScore}`;

          localStorage.setItem("highScore", maxHighScore.toString());
          console.log("level passed");
        }

        playNextLevel();
      }
    }
  });
});

function selectWrongBox(e) {
  e.target.classList.add("shake");
  setTimeout(() => {
    e.target.classList.remove("shake");
  }, 500);
  e.target.style.backgroundColor = "red";
  setTimeout(() => {
    e.target.style.backgroundColor = "#f1f1f1";
  }, 120);
  error.currentTime = 0.7 / 1000;
  error.play();

  gameOver();
  scoreText.textContent = `Score: ${level - 1}`;
}

function selectWrongBoxHard(e) {
  e.target.classList.add("shake");
  setTimeout(() => {
    e.target.classList.remove("shake");
  }, 500);
  e.target.style.backgroundColor = "red";
  setTimeout(() => {
    e.target.style.backgroundColor = "#f1f1f1";
  }, 120);
  error.currentTime = 0.7 / 1000;
  error.play();

  gameOverHard();
  scoreHard.textContent = `Score: ${level - 1}`;
}

function selectCorrectBox(e) {
  e.target.style.backgroundColor = "skyblue";
  setTimeout(() => {
    e.target.style.backgroundColor = "#f1f1f1";
  }, 120);
}

function selectCorrectBoxHard(e) {
  e.target.style.backgroundColor = "skyblue";
  setTimeout(() => {
    e.target.style.backgroundColor = "#f1f1f1";
  }, 120);
}

function colorUserInputBox(boxNumber) {
  const box = document.querySelector(`[data-id="${boxNumber}"]`);
  box.style.backgroundColor = "skyblue";
  setTimeout(() => {
    box.style.backgroundColor = "#f1f1f1";
  }, 120);
}

function playNextLevel() {
  level++;

  generateSequence();
  setTimeout(() => {
    playSequence();
  }, 1000);
}

function playNextLevelHard() {
  level++;

  generateSequenceHard();
  setTimeout(() => {
    playSequenceHard();
  }, 1000);
}

function startGame() {
  generateSequence();
  playSequence();
}

function startGameHard() {
  generateSequenceHard();
  playSequenceHard();
}

function gameOver() {
  level = 1;
  startBtn.disabled = false;
}

function gameOverHard() {
  level = 1;
  startBtnHard.disabled = false;
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

function generateSequenceHard() {
  sequenceHard = [];
  for (let i = 0; i < level; i++) {
    while (true) {
      let randomNumber = Math.floor(Math.random() * 9);
      if (sequenceHard.length >= 1) {
        if (randomNumber !== sequenceHard[sequenceHard.length - 1]) {
          sequenceHard.push(randomNumber);
          break;
        }
      } else {
        sequenceHard.push(randomNumber);
        break;
      }
    }
  }
}

function playSequenceHard() {
  sequenceRunning = true;
  let i = 0;
  function colorNextBoxHard() {
    if (i < sequenceHard.length) {
      const box = document.getElementById(`box-0${sequenceHard[i]}`);

      box.style.backgroundColor = "blue";
      if (
        lightBoxSound.currentTime > 0 &&
        !lightBoxSound.paused &&
        !lightBoxSound.ended
      ) {
        lightBoxSound.currentTime = 0;
      } else {
        lightBoxSound.play();
      }
      setTimeout(() => {
        //lightBoxSound.play();
        box.style.backgroundColor = "#f1f1f1";
        i++;
        colorNextBoxHard();
      }, 1000);
    } else {
      sequenceRunning = false;
    }
  }
  colorNextBoxHard();
}

function playSequence() {
  sequenceRunning = true;
  let i = 0;
  function colorNextBox() {
    if (i < sequence.length) {
      const box = document.getElementById(`box-${sequence[i]}`);

      box.style.backgroundColor = "blue";
      if (
        lightBoxSound.currentTime > 0 &&
        !lightBoxSound.paused &&
        !lightBoxSound.ended
      ) {
        lightBoxSound.currentTime = 0;
      } else {
        lightBoxSound.play();
      }
      setTimeout(() => {
        //lightBoxSound.play();
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
