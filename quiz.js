// Links to the JSON files so they can be implemented into the quiz selector:
// https://raw.githubusercontent.com/guythomas27/QuizApp/refs/heads/main/history.json - History Topic
// https://raw.githubusercontent.com/guythomas27/QuizApp/refs/heads/main/math.json - Math Topic
// https://raw.githubusercontent.com/guythomas27/QuizApp/refs/heads/main/science.json - Science Topic

// All DOM Elements - Variable Names Match MCQ.HTML
// The document.getElementById function is used to select elements from the HTML document, looking for the given name
const timerElement = document.getElementById("timer"); // Timer display element - Pulled from HTML file
const questionEl = document.getElementById('question-text'); // Question text element - Pulled from HTML file
const optionsForm = document.getElementById('options-form'); // Options form element - Pulled from HTML file
const submitBtn = document.getElementById('submit-btn'); // Submit button element - Pulled from HTML file

// Countdown timer variables from Cameron's code
let totalTime = 600; // Total time in seconds
let remainingTime = totalTime; // Time left in seconds (Initialized as totalTime)
let countdown; // Timer countdown variable

// Variable to keep track of score
let currentScore = 0; // Initial score of the user is 0
let currentQuestionIndex = 0;

// Timer Logic Cameron Wrote From Timer.js
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60); // Get minutes
  const secs = seconds % 60; // Get seconds
  return `${mins}:${secs.toString().padStart(2, '0')}`; // Format time as mm:ss
}

// Function to start the timer at the beginning of quiz
function startTimer()
{
    // Clear any existing timer before starting a new one
    clearInterval(countdown); // Clear Interval Function sets variable to null
    // Use SetInterval to create a countdown
    // setInterval() is a built in JavaScript function that repeatedly calls a function with a fixed time
    // delay between each call. The delay is at the bottom
    countdown = setInterval(() => {
    remainingTime--; // Decrement remaining time by 1 (Each 1 is a second)
    timerElement.textContent = formatTime(remainingTime); // Update timer display with correct time by calling formatTime
    // When the timer reaches 0
    if (remainingTime <= 0) {
        clearInterval(countdown); // Clear Interval Function sets variable to null
        timerElement.textContent = "00:00"; // Display 00:00 when time is up
        handleSubmission(); // Call the submission handler to close the quiz early
    }
  }, 1000); // 1000 milliseconds = 1 second so the timer will update every second (JS works in milliseconds)
}

// Function to initialize the quiz (Resets after a new quiz is started)
function initQuiz() {
    // Reset User's Score to 0 at the start of each quiz
    currentScore = 0;
    // Reset Timer Variables
    remainingTime = totalTime; // Reset remaining time to total time
    timerElement.textContent = formatTime(remainingTime); // Update timer display with correct time by calling formatTime
    // Reset UI Elements
    document.getElementById('result-container').classList.add('hidden'); // Hide result container (Which is shown after a quiz is completed)
    submitBtn.disabled = true; // Disable submit button (Prevents submission before answering)
    // Load the first question by calling loadQuestion
    loadQuestion();
}

// Question Loader Function - Loads the question and options into the UI (HTML)
function loadQuestion() {
    const data = quizData[0]; // Get the first question from quizData
    questionEl.textContent = data.question; // Set the question text
    optionsForm.innerHTML = ''; // Clear previous options
    // Create radio button options for each answer choice
    // .forEach is a function that executes a provided function once for each array element
    data.options.forEach(option => {
        const label = document.createElement('label'); // Create a label element for each option - HTML
        label.className = 'option-label'; // Set the class name for styling - CSS
        label.innerHTML = `<input type="radio" name="quiz-option" value="${option}"> ${option}`; // Create radio button for each option
        optionsForm.appendChild(label); // Append the label to the options form
    });

    // Listen for changes on the options form
    optionsForm.onchange = () => {
        // Deselect all option labels
        // .querySelectorAll is a function that returns all elements that match a specified CSS selector
        document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
        // .querySelector is a function that returns the first element that matches a specified CSS selector
        const selected = document.querySelector('input[name="quiz-option"]:checked');
        // Once an option is selected
        if (selected) {
            selected.parentElement.classList.add('selected'); // Highlight the selected option
            submitBtn.disabled = false; // Enable the submit button
        }
    };

    startTimer(); // Start the timer
}

// Score Calculation Function and Submission Handler
// Runs between question submissions
function handleSubmission()
{
    clearInterval(countdown); // Stop the timer when the question is submitted
    const selected = document.querySelector('input[name="quiz-option"]:checked'); // Get the selected option
    const feedback = document.getElementById('feedback-message'); // Get the feedback message element
    // If the selected option is correct
    if (selected && selected.value === quizData[0].answer)
    {
        currentScore++; // Increment score for correct answer
        feedback.textContent = "Correct!"; // Provide feedback for correct answer
        feedback.className = "correct"; // Set class for correct feedback
    }
    // If the selected option is incorrect
    else
    {
        // No changes needed to score
        feedback.textContent = "Incorrect!"; // Provide feedback for incorrect answer
        feedback.className = "incorrect"; // Set class for incorrect feedback
    }
    // Hide question elements
    document.querySelector('.quiz-header').classList.add('hidden'); // Hides the quiz header (question)
    document.getElementById('options-form').classList.add('hidden'); // Hides the options form (answers)
    document.querySelector('.quiz-footer').classList.add('hidden'); // Hides the quiz footer (submission button)

    // Show result container (which is still inside the quiz-container)
    document.getElementById('result-container').classList.remove('hidden'); // Shows the result container
    document.getElementById('final-score').textContent = `Final Score: ${currentScore}/1`; // Display final score (Currently hardcoded to 1 question, will be updated with dynamic question loading)
}

// Event Listeners
submitBtn.addEventListener('click', handleSubmission); // Handle question submission

// Start the quiz
initQuiz(); // Call the initialization function to set up the quiz

// NEED TO DO:
// Incorporate a function / button to load the next question. Need to add new containers to HTML, update the JS Logic,
//      load the next question's data, and update CSS. JS Logic will need to account for multiple questions, have a currentIndex
//      variable to increment, and keep track of the user's answers.
// Incorporate a function to handle the end of the quiz. - IF currentQuestionIndex < quizData.length (Incorporated with JSON files)
//      When the above condition isnt met - show final results and hide quiz container
// Incorporate JSON (github or prewritten)
