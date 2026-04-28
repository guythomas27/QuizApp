// Topic Selector (Guy)
let quizData = [];
async function loadQuizFile(file) {
    const response = await fetch(file);
    return await response.json();
}
// function to show a barebones topic selector
async function topicSelector()
{
    // load the manifest data
    const manifest = await loadQuizFile('topics.json');
    // creates the drop down menu for selecting topics
    const select = document.createElement('select');
    select.id = "topic-dropdown";
    select.innerHTML = `<option disabled selected>-- Choose a Topic --</option>`;
    // loop to go through all topics in the json.
    manifest.quizzes.forEach(quiz => {
        const option = document.createElement('option');
        // pulls file name, and subject name for the quiz
        option.value = quiz.file;
        option.textContent = quiz.name;
        // makes it an option
        select.appendChild(option);
    });
    // slection handler
    select.addEventListener('change', async (event) => {
        const selectedFile = event.target.value;
        // fetches the specific topic questions
        const specificQuizData = await loadQuizFile(selectedFile);
        // updates quiz data
        quizData = specificQuizData.questions;
        document.getElementById('quiz-container').classList.remove('hidden');
        initQuiz(); 
    });
    document.getElementById('selector-container').appendChild(select);
}

// blew up the selector. Kablam.

// Quiz Logic (Cameron and Johnathan)
const timerElement = document.getElementById("timer");
const questionEl = document.getElementById('question-text');
const optionsForm = document.getElementById('options-form');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');

let totalTime = 600; 
let remainingTime = totalTime;
let countdown;
let currentScore = 0;
let currentQuestionIndex = 0;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    clearInterval(countdown);
    countdown = setInterval(() => {
        remainingTime--;
        timerElement.textContent = formatTime(remainingTime);
        if (remainingTime <= 60) timerElement.classList.add("warning"); // Cameron's red alert
        if (remainingTime <= 0) {
            clearInterval(countdown);
            handleSubmission();
        }
    }, 1000);
}

function initQuiz() {
    currentScore = 0;
    currentQuestionIndex = 0;
    remainingTime = totalTime;
    timerElement.textContent = formatTime(remainingTime);
    timerElement.classList.remove("warning");
    startTimer();
    loadQuestion();
}

function loadQuestion() {
    const data = quizData[currentQuestionIndex];
    questionEl.textContent = data.question;
    optionsForm.innerHTML = '';
    optionsForm.classList.remove('hidden');
    document.getElementById('result-container').classList.add('hidden');
    document.querySelector('.quiz-header').classList.remove('hidden');
    document.querySelector('.quiz-footer').classList.remove('hidden');

    data.choices.forEach((option, index) => {
        const label = document.createElement('label');
        label.className = 'option-label';
        label.innerHTML = `<input type="radio" name="quiz-option" value="${index}"> ${option}`;
        optionsForm.appendChild(label);
    });

    optionsForm.onchange = () => {
        document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
        const selected = document.querySelector('input[name="quiz-option"]:checked');
        if (selected) {
            selected.parentElement.classList.add('selected');
            submitBtn.disabled = false;
        }
    };
}

function handleSubmission() {
    clearInterval(countdown);
    const selected = document.querySelector('input[name="quiz-option"]:checked');
    const feedback = document.getElementById('feedback-message');
    const correctIdx = quizData[currentQuestionIndex].correctAnswer;

    if (selected && parseInt(selected.value) === correctIdx) {
        currentScore++;
        feedback.textContent = "Correct!";
        feedback.className = "correct";
    } else {
        feedback.textContent = "Incorrect!";
        feedback.className = "incorrect";
    }

    // Hide and Show UI (Johnathan's Logic)
    document.querySelector('.quiz-header').classList.add('hidden');
    optionsForm.classList.add('hidden');
    document.querySelector('.quiz-footer').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');
    document.getElementById('final-score').textContent = `Current Score: ${currentScore}/${currentQuestionIndex + 1}`;
}

// Event Listeners
submitBtn.addEventListener('click', handleSubmission);
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        clearInterval(countdown);
        questionEl.textContent = "Quiz Complete!";
        document.getElementById('result-container').innerHTML = `<h3>Final Score: ${currentScore}/${quizData.length}</h3>`;
    }
});

// Run when page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    topicSelector();
});
