const box1 = document.getElementById("box-1");
const boxes = document.querySelectorAll(".box-container");
const startBtn = document.querySelector(".start-btn");

// boxes.forEach((box) => {
//   box.addEventListener("click", (e) => {
//     if (startBtn.disabled) {

//     }
//   });
// });

startBtn.addEventListener("click", function () {
  this.disabled = true;
  this.style.cursor = "auto";
});
