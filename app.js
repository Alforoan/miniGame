const box = document.getElementById(`box-1`);
const boxes = document.querySelectorAll(".box-container");
const startBtn = document.querySelector(".start-btn");
let sequence = [];
let level = 1;
let gameRunning = false;

startBtn.addEventListener("click", function () {
  this.disabled = true;
  this.style.cursor = "auto";
});

startBtn.addEventListener("click", function () {
  startGame();
});

function generateSequence() {
  sequence = [];
  for (let i = 0; i < level; i++) {
    sequence.push(Math.floor(Math.random() * 5));
  }
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
