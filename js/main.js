const shuffleOptions = function (array) {
  const newArr = [...array];
  newArr.sort(() => Math.random() - 0.5);
  return newArr;
};

const updateUI = function (question, answers) {
  document.querySelector(".game__question").innerHTML = question;
  const shuffledAnswers = shuffleOptions(answers);
  document.querySelectorAll(".game__options>div").forEach((el, index) => {
    el.innerHTML = shuffledAnswers[index];
  });
};

const changeQuestions = function (questions, options, index) {
  const questionBar = document.querySelectorAll(".question__bar span");
  const questionNo = document.querySelector(".question__number");
  if (index == 10) return;
  updateUI(questions[index], options[index]);
  questionBar[index].classList.add("question--done");
  questionNo.innerHTML = index + 1;
  document
    .querySelectorAll(".game__options > div")
    .forEach((el) => (el.style.background = "#fff"));
};

const checkQuestions = function (questions, options) {
  const uiOptions = document.querySelectorAll(".game__options > div");
  const uiScore = document.querySelector(".game__score");

  let index = 0;
  let score = 0;
  uiOptions.forEach((el) => {
    el.addEventListener("click", function () {
      if (el.innerHTML == options[index][0]) {
        score += 10;
        uiScore.innerHTML = score;
      }

      el.style.background = "red";

      uiOptions.forEach((el) => {
        console.log(el.innerHTML);
        console.log(options[index][0]);
        if (el.innerHTML == options[index][0]) {
          el.style.background = "green";
        }
      });

      index++;

      if (index == 10) {
        uiOptions.forEach((el) => (el.style.pointerEvents = "none"));
        document.querySelector(".game__result span").innerHTML = score;
        setTimeout(function () {
          document.querySelector(".game__result").classList.remove("hidden");
        }, 800);
      }

      setTimeout(function () {
        changeQuestions(questions, options, index);
      }, 800);
    });
  });
};

const getData = async function (difficulty) {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=10&category=9&difficulty=${difficulty}&type=multiple`
  );
  const data = await res.json();

  const options = data.results.map((el) => {
    const correct = el.correct_answer
      .replace("&#039;", "'")
      .replace("&ouml;", "ö")
      .replace("&oacute", "ó");
    return [correct, ...el.incorrect_answers];
  });

  const questions = data.results.map((el) => el.question);
  updateUI(questions[0], options[0]);
  checkQuestions(questions, options);
};

const chooseDifficulty = function () {
  const difficultyModal = document.querySelector(".game__mode");
  difficultyModal.addEventListener("click", function (e) {
    const target = e.target.closest("button");
    if (!target) return;

    getData(target.id);
    difficultyModal.classList.add("hidden");
  });
};

const init = function () {
  chooseDifficulty();
};

init();
