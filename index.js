function renderStartPage() {
    const startPageHtml = $(`<div id="startpage">
    <div><button type="button" class="start">START</button></div>
    <div><p><span class="Blood">ARE YOU A TRUE FAN</span>?</p></div>
    </div>`);
    $('.startPage').html(startPageHtml);
    $('.quizPage').hide();
  }
  
  function startQuiz() {
    $('.startPage').on('click', '.start', function(event) {
      $('.startPage').hide();
      $('.quizPage').show();
      $('body').removeClass('startPgImg').addClass('questionsImg');
      renderQuestion();
      generateOptionsHtml();
      renderQuestionNumberAndScore();
    });
  }
  
  function renderQuestion() {
    let question = STORE.questions[STORE.currentQuestion]
    let questionHtml = $(`<form class='quiz'>
      <legend>${question.question}</legend>
      <div class='jsOptions'>${generateOptionsHtml()}</div>
      <button class='submit' type='submit'>SUBMIT</button>
      <button class='continue' type='button'>CONTINUE</button>
      </form>`);
    $('.quizPage').html(questionHtml);
    $('.continue').hide();
  }
  function generateOptionsHtml() {
    let question = STORE.questions[STORE.currentQuestion]
    let optionsHtml = ''
    for(let i=0; i<question.options.length; i++) {
      optionsHtml += `<div><input type='radio' name='option' value='${question.options[i]}'>
      <label for="${question.options[i]}">${question.options[i]}</label></div>`;
    }
    return optionsHtml;
  }
  
  function renderQuestionNumberAndScore() {
    $('.questionNumAndScore').html(`<div><p>Question ${STORE.currentQuestion+1}\/10</p><p>Answers Correct: ${STORE.correctAnswerCount}</p></div>`);
  }
  
  function handleFormSubmit() {
    $('.quizPage').on('submit', 'form', function(event) {
      event.preventDefault();
      let selectedAnswer = $('input[name=option]:checked').val();
      let correctAnswer = STORE.questions[STORE.currentQuestion].answer;
      if (!selectedAnswer) {
        alert ("You didn't select an answer!");
        return;
        }
        else if (selectedAnswer === correctAnswer) {
          $('input[name=option]:checked').siblings('label').append( `<span class="right"> &#10003 You're right!</span>`);
          //update correctAnswerCount
          STORE.correctAnswerCount ++;       
        }
        else {
          $('input[name=option]:checked').siblings('label').append(`<span class="wrong"> &#10007 Not quite.</span>`);
          $(`input[value="${correctAnswer}"]`).siblings('label').append(`<span class="correction"> &#9666 Duh!</span>`);
        }
        $('.submit').hide();
        $('.continue').show();
        $('input').prop('disabled', true);
        renderQuestionNumberAndScore();
    })
  }
  
  function nextQuestion() {
    $('.quizPage').on('click', '.continue', function(event) {
      //and add 1 to question number
      if (STORE.currentQuestion+1 === STORE.questions.length) {
        finishQuiz();
      } else {
        STORE.currentQuestion++;
        $('.submit').show();
        $('input').prop('disabled', false);
        renderQuestion();
        generateOptionsHtml();
        renderQuestionNumberAndScore();
      }
    })
  }
  
  function finishQuiz() {
    $('body').removeClass('questionsImg').addClass('resultsImg');
    $('.questionNumAndScore').hide();
    $('.quizPage').html(renderFeedbackPage());
  }
  
  function renderFeedbackPage() {
    return `<div class='score'>${STORE.correctAnswerCount * 10} %</div>
    <div class='feedback'>${renderAppropriateFeedback()}</div>
    <button class='restart' type='button'>RESTART</button>`;
  }
  
  function renderAppropriateFeedback() {
    let feedbackHtml = ''
    if (STORE.correctAnswerCount === 0) {
      feedbackHtml += `<p>ZERO?! Clearly NOT a fan.</p>`
    } else if (STORE.correctAnswerCount <= 4) {
      feedbackHtml += `<p>Shotty memory, not even 50%.</p>`;
    } else if (STORE.correctAnswerCount <= 7) {
      feedbackHtml += `<p>It did air a long time ago, you did ok.</p>`;
    } else if (STORE.correctAnswerCount <= 9) {
      feedbackHtml += `<p>Good job, almost got 'em all!</p>`;
    } else {
      feedbackHtml += `<p>Amazing! You are a <span class="True">True</span> <span class="Blood">fan</span>!</p>`;
    }
    return feedbackHtml;
  }
  
  function handleRestartButton() {
    $('.quizPage').on('click', '.restart', function (event) {
      STORE.currentQuestion = 0;
      STORE.correctAnswerCount = 0;
      $('body').removeClass('resultsImg').addClass('questionsImg');
      renderQuestion();
      generateOptionsHtml();
      renderQuestionNumberAndScore();
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