// written by Guy Cordell

// function to load the quizzes
let quizData = [];

async function loadQuiz(file = "phase-1.json")
{
    const response = await fetch(file);
    const data = await response.json();
    return data;
}

// function to show a barebones topic selector
async function topicSelector()
{

   // load the manifest data
    const manifest = await loadQuiz();

    // creates the drop down menu for selecting topics
    const selectorDiv = document.createElement('div');
    selectorDiv.style.textAlign = 'center';
    selectorDiv.style.margin = '20px';

    const select = document.createElement('select');
    select.id = "topic-dropdown";

    // placeholder option for none.
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "-- Choose a Topic --";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // loop to go through all topics in the json.
    manifest.quizzes.forEach(quiz => 
        {
        const option = document.createElement('option');

        // pulls file name, and subject name for the quiz
        option.value = quiz.file;
        option.textContent = quiz.name;

        // makes it an option
        select.appendChild(option);
    });

    // slection handler
    select.addEventListener('change', async (event) => 
    {
        const selectedFile = event.target.value;
        
        // fetches the specific topic questions
        const specificQuizData = await loadQuiz(selectedFile);
        
        // updates quiz data
        quizData = specificQuizData.questions;

        // reset logic
        currentQuestionIndex = 0;
        currentScore = 0;
        
        initQuiz();
    });

    selectorDiv.appendChild(select);
    document.body.prepend(selectorDiv);
}

// blew up the selector. Kablam.


// run on start
topicSelector();

// end



// written by Johnathan

// review page javascript example
const container = document.getElementById("review-container");

if (container) {
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
}
