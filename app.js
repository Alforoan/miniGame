const boxes = document.querySelectorAll(".box-container");
const startBtn = document.querySelector(".start-btn");
let sequence = [];
let playerSequence = [];
let level = 10;
let sequenceRunning = false;

startBtn.addEventListener("click", function () {
  this.disabled = true;
  this.style.cursor = "auto";
});

startBtn.addEventListener("click", function () {
  generateSequence();
  playSequence();
});

boxes.forEach((box) => {
  box.addEventListener("click", function (e) {
    let clickedBox = e.target;
    if (!sequenceRunning) {
      playerSequence.push(parseInt(clickedBox.classList[1]));
      console.log(playerSequence);
    }

    // if (e.target.classList.contains(sequence[0].toString())) {
    //   console.log("correct");
    // } else {
    //   console.log("incorrect");
    // }
  });
});

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
