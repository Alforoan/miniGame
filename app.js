const boxes = document.querySelectorAll(".box-container");
const startBtn = document.querySelector(".start-btn");
let sequence = [];
let level = 10;
let gameRunning = false;

startBtn.addEventListener("click", function () {
  this.disabled = true;
  this.style.cursor = "auto";
});

startBtn.addEventListener("click", function () {
  generateSequence();
  playSequence();
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
  console.log(sequence);
}

generateSequence();

function playSequence() {
  let i = 0;
  function coloNextBox() {
    if (i < sequence.length) {
      const box = document.getElementById(`box-${sequence[i]}`);
      box.style.backgroundColor = "blue";
      setTimeout(() => {
        box.style.backgroundColor = "#f1f1f1";
        i++;
        coloNextBox();
      }, 1000);
    }
  }
  coloNextBox();
}

// function colorBox() {
//   for (let i = 0; i < sequence.length; i++) {
//     box.style.backgroundColor = "blue";
//     setTimeout(() => {
//       box.style.backgroundColor = "#f1f1f1";
//     }, 1000);
//   }
// }

// boxes.forEach((box) => {
//     box.addEventListener("click", function (e) {
//       const clickedBox = e.target;
//       while (box.disabled) {
//         let randomNumber = Math.floor(Math.random() * 5);
//         if (clickedBox.classList.contains(`box-${randomNumber}`)) {
//           console.log("correct");
//         } else {
//           console.log("incorrect");
//           startBtn.disabled = false;
//         }
//       }
//     });
//   });
