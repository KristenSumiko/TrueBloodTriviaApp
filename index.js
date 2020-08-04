function generateStartPageHtml() {
  const startPageHtml = $(`<div class="startPage">
    <div><button type="button" class="start">START</button></div>
    <div><p><span class="Blood">ARE YOU A TRUE FAN</span>?</p></div>
    </div>`);
  return startPageHtml;
}

function renderStartPage() {
  $('main').html(generateStartPageHtml());
}
  
function startQuiz() {
  $('main').on('click', '.start', function(event) {
    $('body').removeClass('startPgImg').addClass('questionsImg');
    renderQuizPage();
  });
}

function generateQuestion() {
  let question = STORE.questions[STORE.currentQuestion]
  let questionHtml = $(
    `<form class='quiz'>
    <legend>${question.question}</legend>
    <div class='jsOptions'>${generateOptionsHtml()}</div>
    <button class='submit' type='submit'>SUBMIT</button>
    <button class='continue' type='button'>CONTINUE</button>
    </form>
    <div class='questionNumAndScore'>${generateQuestionNumberAndScore()}</div>`);
  return questionHtml;
}

function generateOptionsHtml() {
  let question = STORE.questions[STORE.currentQuestion]
  let optionsHtml = ''
  for(let i=0; i<question.options.length; i++) {
    optionsHtml += `<div><label><input type='radio' name='option' value='${question.options[i]}'>
    ${question.options[i]}</label></div>`;
  }
  return optionsHtml;
}

function generateQuestionNumberAndScore() {
  return `<p>Question ${STORE.currentQuestion+1}\/10</p><p>Answers Correct: ${STORE.correctAnswerCount}</p>`;
}

function renderQuizPage() {
  $('main').html(generateQuestion(), generateOptionsHtml(), generateQuestionNumberAndScore());
  $('.continue').hide();
}

function generateRightAnswerFeedback() {
  return `<span class="right below"> &#10003 You're right!</span>`;
}
function generateWrongAnswerFeedback() {
  return `<span class="wrong below"> &#10007 Not quite.</span>`;
}
function generateAnswerCorrectionFeedback() {
  return `<span class="correction"> &#9666 Duh!</span>`;
}

function handleFormSubmit() {
  $('main').on('submit', 'form', function(event) {
    event.preventDefault();
    let selectedAnswer = $(`input[name=option]:checked`).val();
    let correctAnswer = STORE.questions[STORE.currentQuestion].answer;
    if (!selectedAnswer) {
      alert ("You didn't select an answer!");
    return;
    }
    else if (selectedAnswer === correctAnswer) {
      $(`input[name=option]:checked`).parent('label').append(generateRightAnswerFeedback());
      STORE.correctAnswerCount ++;       
    }
    else {
      $(`input[name=option]:checked`).parent('label').append(generateWrongAnswerFeedback());
      $(`input[value='${correctAnswer}']`).parent('label').append(generateAnswerCorrectionFeedback());
    }
    $('.submit').hide();
    $('.continue').show();
    $('input').prop('disabled', true);
    generateQuestionNumberAndScore();
  })
}

function nextQuestion() {
  $('main').on('click', '.continue', function(event) {
    if (STORE.currentQuestion+1 === STORE.questions.length) {
      finishQuiz();
    } else {
      STORE.currentQuestion++;
      $('.submit').show();
      $('input').prop('disabled', false);
      renderQuizPage();
    }
  })
}

function generateQuizResults() {
  let resultsHtml = ''
  if (STORE.correctAnswerCount === 0) {
    resultsHtml += `<p>ZERO?! Clearly NOT a fan.</p>`
  } else if (STORE.correctAnswerCount <= 4) {
    resultsHtml += `<p>Shotty memory, not even 50%.</p>`;
  } else if (STORE.correctAnswerCount <= 7) {
    resultsHtml += `<p>It did air a long time ago, you did ok.</p>`;
  } else if (STORE.correctAnswerCount <= 9) {
    resultsHtml += `<p>Good job, almost got 'em all!</p>`;
  } else {
    resultsHtml += `<p>Amazing! You are a TRUE FAN!</p>`;
  }
  return resultsHtml;
}

function finishQuiz() {
  $('body').removeClass('questionsImg').addClass('resultsImg');
  $('.questionNumAndScore').remove();
  $('main').html(renderFeedbackPage());
}

function renderFeedbackPage() {
  return `<div class='score'>${STORE.correctAnswerCount * 10}%</div>
  <div class='feedback'>${generateQuizResults()}</div>
  <button class='restart' type='button'>RESTART</button>`;
}

function handleRestartButton() {
  $('main').on('click', '.restart', function (event) {
    STORE.currentQuestion = 0;
    STORE.correctAnswerCount = 0;
    $('body').removeClass('resultsImg').addClass('questionsImg');
    renderQuizPage();
  })
}

function runQuizApp() {
  renderStartPage();
  startQuiz();
  handleFormSubmit();
  nextQuestion();
  handleRestartButton();
}

$(runQuizApp);