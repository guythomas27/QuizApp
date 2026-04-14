// 10 minutes in total (if the you want to change the time it is counted in seconds so 60 = 1min and 600 = 10 min)
let totalTime = 70;
let remainingTime = totalTime;

const timerElement = document.getElementById("timer");

// Format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Start countdown
const countdown = setInterval(() => {
  remainingTime--;

  timerElement.textContent = formatTime(remainingTime);

  // Turns the timer red when the clock reaches 1 minute
  if (remainingTime <= 60) {
    timerElement.classList.add("warning");

  // Stop at 0
  if (remainingTime <= 0) {
    clearInterval(countdown);
    timerElement.textContent = "Time's up!";

  // code would likely look something like what is below but it is hard to implement without seeing the quiz submission code.  
  // formatTime.submit();

  }

  }
}, 1000);



