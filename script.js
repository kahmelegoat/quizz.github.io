let currentIndex = 0;
let score = 0;
let quizData = [];

const flagImg = document.getElementById("flag-img");
const optionsContainer = document.getElementById("options");
const questionBox = document.getElementById("question-box");
const resultBox = document.getElementById("result-box");
const scoreText = document.getElementById("score");
const totalText = document.getElementById("total");
const restartBtn = document.getElementById("restart");

async function fetchCountries() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();

    // On garde seulement les pays avec nom et drapeau
    const validCountries = data.filter(
      c => c.name && c.name.common && c.flags && c.flags.png && c.translations && c.translations.fra
    );

    generateQuizData(validCountries);
  } catch (error) {
    optionsContainer.innerHTML = `<p>Erreur de chargement des pays...</p>`;
  }
}

function generateQuizData(countries) {
  const shuffled = countries.sort(() => Math.random() - 0.5);
  const questionCount = 10;

  for (let i = 0; i < questionCount; i++) {
    const correct = shuffled[i];
    const wrongOptions = [];

    // Choisir 3 autres pays aléatoires pour mauvaises réponses
    while (wrongOptions.length < 3) {
      const candidate = shuffled[Math.floor(Math.random() * shuffled.length)];
      if (
        candidate.name.common !== correct.name.common &&
        !wrongOptions.some(c => c.name.common === candidate.name.common)
      ) {
        wrongOptions.push(candidate);
      }
    }

    const options = [
      ...wrongOptions.map(c => c.translations.fra.common), // Utilise la traduction en français pour les mauvaises réponses
      correct.translations.fra.common // Utilise la traduction en français pour la bonne réponse
    ].sort(() => Math.random() - 0.5);

    quizData.push({
      image: correct.flags.png,
      options,
      answer: correct.translations.fra.common // Utilise la traduction en français pour la bonne réponse
    });
  }

  loadQuestion();
}

function loadQuestion() {
  const current = quizData[currentIndex];
  flagImg.src = current.image;
  optionsContainer.innerHTML = "";
  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "option-btn";
    btn.onclick = () => handleAnswer(option);
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selected) {
  if (selected === quizData[currentIndex].answer) {
    score++;
  }
  currentIndex++;
  if (currentIndex < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  questionBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreText.textContent = score;
  totalText.textContent = quizData.length;
}

restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  score = 0;
  quizData = [];
  questionBox.classList.remove("hidden");
  resultBox.classList.add("hidden");
  fetchCountries();
});

// Lancer le jeu
fetchCountries();
