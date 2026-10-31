// settings Game Name

let gameName = "Guess The Word";
document.title = gameName;
document.getElementsByTagName("h1")[0].innerText = gameName;
document.querySelector("footer").innerHTML = gameName;
const messagaArea = document.querySelector(".message");

// manage words
let wordToGuess = "";
const words = ["abdo", "shreif", "mohamed", "ahmed", "hamed", "mohsen"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
console.log(wordToGuess);
// settings game options
let numsOfTries = 5;
let numsOfLetters = wordToGuess.length;
let currentTry = 1;
let numsOfHints = 2;
document.querySelector(".hint span").innerHTML = numsOfHints;
const buttonHint = document.querySelector(".hint");

buttonHint.addEventListener("click", getHint);

function generateTries() {
  const triesContainer = document.querySelector(".inputs");

  for (let i = 1; i <= numsOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span> Try ${i} </span>`;
    if (i !== 1) tryDiv.classList.add("disabled");

    // generate inputs
    for (let j = 1; j <= numsOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.id = `try-${i}-letter-${j}`;
      tryDiv.appendChild(input);
    }
    triesContainer.appendChild(tryDiv);
  }
  triesContainer.children[0].children[1].focus();

  //disable all inputs except the first try
  const inputsDisabled = document.querySelectorAll(".disabled input");
  inputsDisabled.forEach((input) => (input.disabled = true));

  // convert to uppercase
  const inputs = document.querySelectorAll(".inputs input");
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = this.nextElementSibling;
      if (nextInput && nextInput.tagName === "INPUT") {
        nextInput.focus();
      }
    });
    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) {
          inputs[nextInput].focus();
        }
      }
      if (event.key === "Backspace") {
        event.preventDefault(); // Prevent the default backspace behavior
        input.value = "";
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) {
          inputs[prevInput].focus();
        }
          updateHintButton();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) {
          inputs[prevInput].focus();
        }
      }
    });
  });
}
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);
function handleGuesses() {
  let successGuess = true;
  const allInputsActive = document.querySelectorAll("input:not([disabled])");
  const allInputsEmpty = Array.from(allInputsActive).filter(
    (inputEmpty) => inputEmpty.value === "",
  );
  if (allInputsEmpty.length > 0) {
    console.log("Please Check Input");
    allInputsEmpty[0].focus();
    return;
  }

  for (let i = 1; i <= numsOfLetters; i++) {
    const inputField = document.querySelector(`#try-${currentTry}-letter-${i}`);
    const letter = inputField.value.toLowerCase();
    const actualLatter = wordToGuess[i - 1];

    // game logic

    if (letter === actualLatter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("wrong");
      successGuess = false;
    }
  }
  // check If user win or lose

  if (successGuess) {
    messagaArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;

    // Add Disabled Class On try Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled"));
    // disabled guess button
    guessButton.disabled = true;
    buttonHint.disabled = true;
  } else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled");
    const inputsCurrent = document.querySelectorAll(`.try-${currentTry} input`);
    inputsCurrent.forEach((input) => (input.disabled = true));

    currentTry++;

    const inputsNext = document.querySelectorAll(`.try-${currentTry} input`);
    inputsNext.forEach((input) => (input.disabled = false));
    let tryCurrent = document.querySelector(`.try-${currentTry}`);
    if (tryCurrent) {
      tryCurrent.classList.remove("disabled");
      tryCurrent.children[1].focus();
      updateHintButton();
    } else {
      // disabled guess button
      guessButton.disabled = true;
      buttonHint.disabled = true;
      messagaArea.innerHTML = `You Lose The Word Is <span> ${wordToGuess}  </span>`;
    }
  }
}
function updateHintButton() {
  const inputsEnable = document.querySelectorAll("input:not([disabled])");

  const emptyInputs = Array.from(inputsEnable).filter(
    (input) => input.value === "",
  );

  buttonHint.disabled = numsOfHints === 0 || emptyInputs.length === 0;
}
// function for hint
function getHint() {
  const inputsEnable = Array.from(document.querySelectorAll("input:not([disabled])"));
  const emptyInputsEnable = inputsEnable.filter(
    (input) => input.value === "",
  );
  if (emptyInputsEnable.length === 0 || numsOfHints === 0) {
    updateHintButton();
    return;
  }
  numsOfHints--;
  document.querySelector(".hint span").innerHTML = numsOfHints;

  const randomIndex = Math.floor(Math.random() * emptyInputsEnable.length);
  const randomInput = emptyInputsEnable[randomIndex];
  const inputIndex = Array.from(inputsEnable).indexOf(randomInput);

  randomInput.value = wordToGuess[inputIndex].toUpperCase();
  updateHintButton();
}
window.onload = function () {
  generateTries();
};
