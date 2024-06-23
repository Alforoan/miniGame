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
const difficultySelector = document.querySelector(".difficulty-selector");
const gameContainer = document.querySelector(".game-container");
const box0 = document.getElementById('box-0');
const box1 = document.getElementById('box-1');
const box2 = document.getElementById('box-2');
const box3 = document.getElementById('box-3');
const box4 = document.getElementById('box-4');
const urlToChange = 'http://127.0.0.1:8000';

let clickedBoxes = [];
let sequence = [];
let sequenceHard = [];
let level = 1;
let sequenceLength = level;
let sequenceLengthHard = level;
let sequenceRunning = false;
let highScoreToSave = 0;
let currentHighScore = 0;
let maxHighScore = 0;
let maxHighScoreHard = 0;
let username = '';
let highScore = 0;
let normalScore = 0;
let hardScore = 0;
let isUserExists = false;
error.volume = 0.2;
lightBoxSound.volume = 0.3;

highScoreText.textContent = `High Score: ${level - 1}`;

async function getScoreNormal(){
  try {
    const response = await fetch(`${urlToChange}/recall_it/api/score/get/normal`);
    if (!response.ok) {
      throw new Error('Network response was not ok'+ response.statusText);
    }
    const data = await response.json();
    normalScore = data?.score;
    username = data?.user;

    if (username !== '' && username !== undefined && username !== null) {
      isUserExists = true;
    }
    if(normalScore >= 0){
      console.log("something goes here");
      highScoreText.textContent = `High Score: ${normalScore}`;
    }
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

async function getScoreHard() {
  try {
    const response = await fetch(
      `${urlToChange}/recall_it/api/score/get/hard`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    const data = await response.json();
    hardScore = data?.score;
    username = data?.user;
    if (username !== '' && username !== undefined && username !== null) {
      isUserExists = true;
    }
    if (hardScore >= 0) {
      highScoreHard.textContent = `High Score: ${hardScore}`;
    }
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

getScoreNormal();
getScoreHard();

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function updateScoreNormal(score) {
  try {
    const csrftoken = getCookie('csrftoken');
    const response = await fetch(
      `${urlToChange}/recall_it/api/score/set/normal/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ score: score }),
        credentials: 'include',
      }
    );
    console.log('updating high score', response);
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

async function updateScoreHard(score) {
  try {
    const csrftoken = getCookie('csrftoken');
    const response = await fetch(
      `${urlToChange}/recall_it/api/score/set/hard/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ score: score }),
        credentials: 'include',
      }
    );
    console.log('updating high score', response);
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

async function updateHighScore(score) {
  try {
    const csrftoken = getCookie('csrftoken');
    const response = await fetch(
      `${urlToChange}/recall_it/api/score/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken, 
        },
        body: JSON.stringify({ score: score }),
        credentials: 'include'
      }
    );
    console.log('updating high score',response);
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

if(!isUserExists){
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
}

navbarBtn.addEventListener("click", function () {
  navbar.classList.toggle("navbar-show");
});

startBtn.addEventListener("click", function () {
  this.disabled = true;
  
  startGame();
});

startBtnHard.addEventListener("click", function () {
  this.disabled = true;
  
  startGameHard();
});

hardBtn.addEventListener("click", function () {
  startBtn.style.display = 'none';
  //gameContainer.style.height = '100vh';
  hardContainer.classList.remove("box-hidden");
  normalContainer.classList.add("box-hidden");
  startBtnHard.style.display = 'inline-block';
  
  sequence = [];
  sequenceHard = [];
  level = 1;
  sequenceRunning = false;
  currentHighScore = 0;
  gameOver();
});

normalBtn.addEventListener("click", function () {
  normalContainer.classList.remove("box-hidden");
  startBtnHard.style.display = 'none';
  startBtn.style.display = 'inline-block';
  hardContainer.classList.add("box-hidden");
  //gameContainer.style.height = '80vh';
  //difficultySelector.style.marginBottom = '3rem';
  //startBtn.style.display = 'inline-block';
  sequence = [];
  sequenceHard = [];
  level = 1;
  sequenceRunning = false;
  currentHighScore = 0;
  gameOverHard();
});

boxesHard.forEach((box) => {
  box.addEventListener("click", function (e) {
    if (!sequenceRunning && startBtnHard.disabled === true) {
      box.style.cursor = "pointer";
      let boxNumber = parseInt(e.target.getAttribute("data-id"));
      let popped = sequenceHard.shift();
      if (popped !== boxNumber) {
        selectWrongBoxHard(e);
        return;
      } else {
        selectCorrectBoxHard(e);
      }

      if (sequenceHard.length === 0) {
        scoreHard.textContent = `Score: ${level}`;
        currentHighScore = level;
        if(isUserExists && currentHighScore > hardScore){
          updateScoreHard(currentHighScore);
          highScoreHard.textContent = `High Score: ${currentHighScore}`;
          let scoreToSave = Math.max(currentHighScore, hardScore);
          scoreToSave = Math.max(currentHighScore, normalScore);
          console.log('HARD SCORE', scoreToSave);
          updateHighScore(scoreToSave);
        }else if (currentHighScore > maxHighScoreHard) {
          maxHighScoreHard = currentHighScore;
          highScoreHard.textContent = `High Score: ${maxHighScoreHard}`;
          localStorage.setItem("highScoreHard", maxHighScoreHard.toString());
          
        }

        playNextLevelHard();
      }
    }
  });
});


//individual boxes
box0.addEventListener('click', function handleClick(e) {
  handleBoxClick(box0, e);
});

box1.addEventListener('click', function handleClick(e) {
  handleBoxClick(box1, e);
});

box2.addEventListener('click', function handleClick(e) {
  handleBoxClick(box2, e);
});

box3.addEventListener('click', function handleClick(e) {
  handleBoxClick(box3, e);
});
box4.addEventListener('click', function handleClick(e) {
  handleBoxClick(box4, e);
});

function handleBoxClick(box, e) {
  if (!sequenceRunning && startBtn.disabled === true) {
    if (clickedBoxes.length === sequenceLength) {
      console.log("box length exceeded");
      return;
    }

    box.style.cursor = 'pointer';
    let boxNumber = parseInt(e.target.getAttribute('data-id'));
    clickedBoxes.push(boxNumber);

    let popped = sequence.shift();

    if (boxNumber !== popped) {
      selectWrongBox(e);
      gameOver();
      clickedBoxes = [];
    } else {
      selectCorrectBox(e);
      if (sequence.length === 0) {
        scoreText.textContent = `Score: ${level}`;
        currentHighScore = level;
        if(currentHighScore > normalScore){
          console.log({ currentHighScore });
          console.log({ normalScore });
        }
        if (isUserExists && currentHighScore > normalScore) {
          console.log({currentHighScore});
          console.log({normalScore});
          if (currentHighScore > normalScore) {

            updateScoreNormal(currentHighScore);
            highScoreText.textContent = `High Score: ${level}`;
            let scoreToSave = Math.max(currentHighScore, normalScore);
            scoreToSave = Math.max(currentHighScore, hardScore);
            console.log('NORMAL SCORE', scoreToSave);
            updateHighScore(scoreToSave);
          }
        } else {
          if (currentHighScore > maxHighScore) {
            maxHighScore = currentHighScore;
            highScoreText.textContent = `High Score: ${maxHighScore}`;
            localStorage.setItem('highScore', maxHighScore.toString());
          }
          clickedBoxes = [];
        }
        playNextLevel();
      }
    }
  }
}


// boxes.forEach((box) => {
  
//   box.addEventListener("click", function (e) {
//     if (!sequenceRunning && startBtn.disabled === true) {
       
//         if(clickedBoxes.length === sequence.length){
//           return;
//         }
      
//       box.style.cursor = "pointer";
//       let boxNumber = parseInt(e.target.getAttribute("data-id"));
      
//       //colorUserInputBox(boxNumber);
      
//       clickedBoxes.push(boxNumber);
//       let popped = sequence.shift();
//       console.log("CLICKED NUMBERS",popped);
      
//       if (popped !== boxNumber) {
//         console.log('wrong box number');
//         console.log({clickedBoxes});
//         selectWrongBox(e);
//         gameOver();
//         clickedBoxes = [];
//         return;
//       } else {
//         selectCorrectBox(e);
//       }

//       if (sequence.length === 0) {
//         scoreText.textContent = `Score: ${level}`;
//         currentHighScore = level;
//         if (currentHighScore > maxHighScore) {
//           maxHighScore = currentHighScore;
//           highScoreText.textContent = `High Score: ${maxHighScore}`;

//           localStorage.setItem("highScore", maxHighScore.toString());
//           console.log("level passed");
//         }

//         playNextLevel();
//       }
//     }
//   });
// });

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
  startBtn.style = 'pointer';
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
  sequenceRunning = true;
  sequenceLength = level;
  generateSequence();
  setTimeout(() => {
    playSequence();
  }, 500);
  clickedBoxes = [];
}

function playNextLevelHard() {
  level++;
  sequenceRunning = true;
  sequenceLengthHard = level;
  generateSequenceHard();
  setTimeout(() => {
    playSequenceHard();
  }, 500);
  clickedBoxes = [];
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
