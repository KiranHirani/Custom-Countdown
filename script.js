const inputContainer = document.getElementById("input-container"),
  countdownForm = document.getElementById("countdown-form"),
  dateElement = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownButton = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

let countdownTitle = "",
  countdownDate = "",
  countdownValue = new Date(),
  countdownActive;

let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

function updateDOM() {
  countdownActive = setInterval(calculateCountdownTime, second);
}

// Populate Countdown / UI
function calculateCountdownTime() {
  const now = new Date().getTime();
  const distance = countdownValue - now;

  const days = Math.floor(distance / day);
  const hours = Math.floor((distance % day) / hour);
  const minutes = Math.floor((distance % hour) / minute);
  const seconds = Math.floor((distance % minute) / second);

  //Hide Inpute
  inputContainer.hidden = true;

  // If the countdown has ended, we want to show complete
  if (distance < 0) {
    countdownEl.hidden = true;
    clearInterval(countdownActive);
    completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
    completeEl.hidden = false;
  } else {
    //Show the countdown in progress - Populating Countdown Values
    countdownElTitle.textContent = `${countdownTitle}`;

    // Assigning the value in span tags
    Array.from(timeElements).map((element, index) => {
      element.textContent = `${[days, hours, minutes, seconds][index]}`;
    });

    completeEl.hidden = true;

    // Show Countdown
    countdownEl.hidden = false;
  }
}

// Set Date Input Min with Today's date
const today = new Date().toISOString().split("T")[0];
dateElement.setAttribute("min", today);

function updateCountdown(event) {
  event.preventDefault();
  countdownTitle = event.srcElement[0].value;
  countdownDate = event.srcElement[1].value;

  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  localStorage.setItem("countdown", JSON.stringify(savedCountdown));

  //Check if date field has some value
  if (countdownDate === "") {
    alert("Please select a date for the countdown");
  } else {
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

function restorePreviousCountdown() {
  // Get the countdown from local storage if available
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Reset all values
function reset() {
  // Hide countdowns, Show input
  completeEl.hidden = true;
  countdownEl.hidden = true;
  inputContainer.hidden = false;
  // Clear Interval
  clearInterval(countdownActive);
  //   Reset Value
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownButton.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

// On Load
restorePreviousCountdown();
