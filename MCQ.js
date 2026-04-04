// function to load the quizzes
async function loadQuiz()
{
    // reaaches out to the json to get the quizzes and waits til its done
    const response = await fetch("phase-1.json");

    // turn that data into usable form and return
    const data = await response.json();
    return data;
}

// Function to show a barebones topic selector
async function topicSelector()
{
    // loads quiz data
    const quizData = await loadQuiz();

    // TODO : CREATE LOOP TO GO THROUGH JSON FOR ALL QUIZ TOPICS AND QUESTIONS
}

// adds selector to page
document.body.prepend(selectorDiv);


// run on start
topicSelector();



// review page javascript example
const container = document.getElementById("review-container");

// Load saved quizzes
const pastResults = JSON.parse(localStorage.getItem("quizResults")) || [];

if (pastResults.length === 0) {
    container.innerHTML = "<p>No past quizzes yet.</p>";
} else {
    pastResults.forEach((quiz, index) => {
        const quizDiv = document.createElement("div");
        quizDiv.classList.add("review-quiz");

        quizDiv.innerHTML = `
            <h3>${quiz.topic} - ${quiz.date}</h3>
        `;

        quiz.questions.forEach(q => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("review-question");

            const isCorrect = q.userAnswer === q.correctAnswer;

            questionDiv.innerHTML = `
                <p><strong>${q.question}</strong></p>
                <p>Your answer: 
                    <span class="${isCorrect ? 'correct' : 'incorrect'}">
                        ${q.choices[q.userAnswer]}
                    </span>
                </p>
                ${!isCorrect ? `
                    <p>Correct answer: 
                        <span class="correct">
                            ${q.choices[q.correctAnswer]}
                        </span>
                    </p>
                ` : ""}
            `;

            quizDiv.appendChild(questionDiv);
        });

        container.appendChild(quizDiv);
    });
}