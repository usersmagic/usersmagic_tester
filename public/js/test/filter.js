let questions = [], submition, answers = {};
let question_types = {
  short_text: '', long_text: '', range: '', radio: '', checked: ''
};
let yourAnswer, other;
let unknownErrorTitle, tryAgainLaterText, okayText, confirmText, cancelText, required, clearAnswers, areYouSureTitle, noUpdateAfterSubmitText;

function createProgressBar(index) {
  const questionWrapper = document.querySelector('.question-wrapper');
  const questionProgressBar = document.createElement('div');
  questionProgressBar.classList.add('question-progress-bar');
  questionWrapper.appendChild(questionProgressBar);

  const questionProgressBarInnerLine = document.createElement('div');
  questionProgressBarInnerLine.classList.add('question-progress-bar-inner-line');
  questionProgressBarInnerLine.style.width = ((index * questionProgressBar.offsetWidth) / (questions.length-1)) + 'px';
  questionProgressBar.appendChild(questionProgressBarInnerLine);
}

function createOtherOptionInput(wrapper, type, value) {
  const eachQuestionOtherOptionInputWrapper = document.createElement('div');
  eachQuestionOtherOptionInputWrapper.classList.add('each-question-other-option-input-wrapper');

  if (type == 'radio') {
    const radioChoiceWrapper = document.createElement('div');
    radioChoiceWrapper.classList.add('radio-choice-wrapper');
    if (value.length)
      radioChoiceWrapper.classList.add('selected-choice');
    const radioChoiceIcon = document.createElement('div');
    radioChoiceIcon.classList.add('radio-choice-icon');
    radioChoiceWrapper.appendChild(radioChoiceIcon);
    eachQuestionOtherOptionInputWrapper.appendChild(radioChoiceWrapper);
  } else if (type == 'checked') {
    const checkedChoiceWrapper = document.createElement('div');
    checkedChoiceWrapper.classList.add('checked-choice-wrapper');
    if (value.length)
      checkedChoiceWrapper.classList.add('selected-choice');
    const checkedChoiceIcon = document.createElement('div');
    checkedChoiceIcon.classList.add('checked-choice-icon');
    checkedChoiceIcon.classList.add('fas');
    checkedChoiceIcon.classList.add('fa-check');
    checkedChoiceWrapper.appendChild(checkedChoiceIcon);
    eachQuestionOtherOptionInputWrapper.appendChild(checkedChoiceWrapper);
  } else {
    return;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;
  input.placeholder = other;
  eachQuestionOtherOptionInputWrapper.appendChild(input);

  wrapper.appendChild(eachQuestionOtherOptionInputWrapper);
}

function createQuestion(question, answer, index) {
  const questionWrapper = document.querySelector('.question-wrapper');
  questionWrapper.innerHTML = '';
  createProgressBar(index);

  const questionInfoWrapper = document.createElement('div');
  questionInfoWrapper.classList.add('question-info-wrapper');

  const questionType = document.createElement('span');
  questionType.classList.add('question-type');
  questionType.innerHTML = question_types[question.type];
  questionInfoWrapper.appendChild(questionType);

  const questionRequired = document.createElement('span');
  questionRequired.classList.add('question-required');
  questionRequired.innerHTML = required;
  questionInfoWrapper.appendChild(questionRequired);

  questionWrapper.appendChild(questionInfoWrapper);

  const questionText = document.createElement('span');
  questionText.classList.add('question-text');
  questionText.innerHTML = question.text;
  questionWrapper.appendChild(questionText);
  
  if (question.type == 'short_text') {
    const input = document.createElement('input');
    input.classList.add('general-input-with-border');
    input.classList.add('answer-input'); // For DOM selection, not styling
    input.placeholder = yourAnswer;
    input.value = answer;
    questionWrapper.appendChild(input);
  } else if (question.type == 'long_text') {
    const inputLong = document.createElement('textarea');
    inputLong.classList.add('general-input-with-border-long');
    inputLong.classList.add('answer-input'); // For DOM selection, not styling
    inputLong.placeholder = yourAnswer;
    inputLong.value = answer;
    questionWrapper.appendChild(inputLong);
  } else if (question.type == 'range') {
    const opinionOuterWrapper = document.createElement('div');
    opinionOuterWrapper.classList.add('each-question-opinion-outer-wrapper');

    const opinionScaleWrapper = document.createElement('div');
    opinionScaleWrapper.classList.add('each-question-opinion-scale-wrapper');
    for (let i = question.min_value; i <= question.max_value; i++) {
      if (i != question.min_value) {
        const eachEmptyScale = document.createElement('div');
        eachEmptyScale.classList.add('each-question-empty-scale');
        opinionScaleWrapper.appendChild(eachEmptyScale);
      }
      const eachScale = document.createElement('span');
      eachScale.classList.add('each-question-each-scale');
      if (answer == i)
        eachScale.classList.add('each-question-selected-scale');
      eachScale.innerHTML = i;
      opinionScaleWrapper.appendChild(eachScale);
    }
    opinionOuterWrapper.appendChild(opinionScaleWrapper);

    const opinionLine = document.createElement('div');
    opinionLine.classList.add('each-question-opinion-line');
    for (let i = 0; i < 3; i++) {
      const eachOpinionLine = document.createElement('div');
      eachOpinionLine.classList.add('each-question-opinion-line-item');
      opinionLine.appendChild(eachOpinionLine);
    }
    opinionOuterWrapper.appendChild(opinionLine);

    const opinionTextWrapper = document.createElement('div');
    opinionTextWrapper.classList.add('each-question-opinion-text-wrapper');
    const leftOpinionText = document.createElement('span');
    leftOpinionText.classList.add('each-question-opinion-text-left');
    leftOpinionText.innerHTML = question.min_explanation;
    opinionTextWrapper.appendChild(leftOpinionText);
    const middleOpinionText = document.createElement('span');
    middleOpinionText.classList.add('each-question-opinion-text-middle');
    middleOpinionText.innerHTML = '';
    opinionTextWrapper.appendChild(middleOpinionText);
    const rightOpinionText = document.createElement('span');
    rightOpinionText.classList.add('each-question-opinion-text-right');
    rightOpinionText.innerHTML = question.max_explanation;
    opinionTextWrapper.appendChild(rightOpinionText);
    opinionOuterWrapper.appendChild(opinionTextWrapper);

    questionWrapper.appendChild(opinionOuterWrapper);
  } else if (question.type == 'radio' || question.type == 'checked') {
    question.choices.forEach(choice => {
      const eachQuestionChoice = document.createElement('div');
      eachQuestionChoice.classList.add('each-question-choice');
      if (question.type == 'radio') {
        eachQuestionChoice.classList.add('each-question-choice-radio');
        const radioChoiceWrapper = document.createElement('div');
        radioChoiceWrapper.classList.add('radio-choice-wrapper');
        if (choice == answer)
          radioChoiceWrapper.classList.add('selected-choice');
        const radioChoiceIcon = document.createElement('div');
        radioChoiceIcon.classList.add('radio-choice-icon');
        radioChoiceWrapper.appendChild(radioChoiceIcon);
        eachQuestionChoice.appendChild(radioChoiceWrapper);
      } else {
        eachQuestionChoice.classList.add('each-question-choice-checked');
        const checkedChoiceWrapper = document.createElement('div');
        checkedChoiceWrapper.classList.add('checked-choice-wrapper');
        if (answer.includes(choice))
          checkedChoiceWrapper.classList.add('selected-choice');
        const checkedChoiceIcon = document.createElement('div');
        checkedChoiceIcon.classList.add('checked-choice-icon');
        checkedChoiceIcon.classList.add('fas');
        checkedChoiceIcon.classList.add('fa-check');
        checkedChoiceWrapper.appendChild(checkedChoiceIcon);
        eachQuestionChoice.appendChild(checkedChoiceWrapper);
      }
      const span = document.createElement('span');
      span.innerHTML = choice;
      eachQuestionChoice.appendChild(span);
      questionWrapper.appendChild(eachQuestionChoice);
    });
    if (question.other_option) {
      if (question.type == 'radio') {
        if (question.choices.includes(answer))
          createOtherOptionInput(questionWrapper, question.type, '');
        else
          createOtherOptionInput(questionWrapper, question.type, answer);
      } else {
        if (answer.find(ans => !question.choices.includes(ans)))
          createOtherOptionInput(questionWrapper, question.type, answer.find(ans => !question.choices.includes(ans)));
        else
          createOtherOptionInput(questionWrapper, question.type, '');
      }
    }
  }

  const clearQuestionButton = document.createElement('span');
  clearQuestionButton.classList.add('clear-question-button');
  clearQuestionButton.innerHTML = clearAnswers;
  questionWrapper.appendChild(clearQuestionButton);

  if (!answer || !answer.length)
    document.querySelector('.next-button').style.cursor = 'not-allowed';
  else
    document.querySelector('.next-button').style.cursor = 'pointer';
}

function createFinishPageQuestionsWrapperContent() {
  const questionsWrapper = document.querySelector('.finish-page-questions-wrapper');
  questionsWrapper.innerHTML = '';

  questions.forEach((question, i) => {
    const eachQuestion = document.createElement('div');
    eachQuestion.classList.add('finish-page-each-question-wrapper');
    if (i == 0)
      eachQuestion.style.paddingTop = '0px';

    const eachQuestionText = document.createElement('span');
    eachQuestionText.classList.add('finish-page-each-question-text');
    eachQuestionText.innerHTML = (i+1) + '. ' + question.question.text;
    eachQuestion.appendChild(eachQuestionText);

    if (question.question.type != 'checked') {
      const eachAnswer = document.createElement('span');
      eachAnswer.classList.add('finish-page-each-question-answer');
      eachAnswer.innerHTML = question.answer;
      eachQuestion.appendChild(eachAnswer);
    } else {
      question.answer.forEach(answer => {
        const eachAnswer = document.createElement('span');
        eachAnswer.classList.add('finish-page-each-question-answer');
        eachAnswer.innerHTML = '- ' + answer;
        eachQuestion.appendChild(eachAnswer);
      });
    }

    questionsWrapper.appendChild(eachQuestion);
  });
}

function createAllWrapperContent() {
  const last_question = submition.last_question;

  const welcomePageOuterWrapper = document.querySelector('.welcome-page-outer-wrapper');
  const questionOuterWrapper = document.querySelector('.question-outer-wrapper');
  const finishPageOuterWrapper = document.querySelector('.finish-page-outer-wrapper');

  welcomePageOuterWrapper.style.display = questionOuterWrapper.style.display = finishPageOuterWrapper.style.display = 'none';

  if (last_question == -1) {
    welcomePageOuterWrapper.style.display = 'flex';
  } else if (last_question == questions.length) {
    finishPageOuterWrapper.style.display = 'flex';
    createFinishPageQuestionsWrapperContent();
  } else {
    questionOuterWrapper.style.display = 'flex';
    createQuestion(questions[last_question].question, questions[last_question].answer, last_question);
  }
}

function saveAnswers(callback) {
  serverRequest('/test/filter/save?id=' + submition._id, 'POST', {
    last_question: submition.last_question,
    answers // Save the current answers
  }, res => {
    if (!res.success) {
      createConfirm({
        title: unknownErrorTitle,
        text: tryAgainLaterText,
        reject: confirmText
      }, res => { return callback(false); });
    } else {
      if (submition.last_question > -1 && submition.last_question < questions.length) {
        if (answers[questions[submition.last_question].question._id] && answers[questions[submition.last_question].question._id].length)
          document.querySelector('.next-button').style.cursor = 'pointer';
        else
          document.querySelector('.next-button').style.cursor = 'not-allowed';
      }
      callback(true);
    }
  });
}

function submitAnswers(callback) {
  serverRequest('/test/filter/submit?id=' + submition._id, 'GET', {}, res => {
    if (!res.success) {
      createConfirm({
        title: unknownErrorTitle,
        text: tryAgainLaterText,
        reject: confirmText
      }, res => { return callback(false); });
    } else {
      callback(true);
    }
  });
}

window.onload = () => {
  const allWrapper = document.querySelector('.all-wrapper');

  unknownErrorTitle = document.querySelector('.unknown-error-title').innerHTML;
  tryAgainLaterText = document.querySelector('.try-again-later-text').innerHTML;
  okayText = document.querySelector('.okay-text').innerHTML;
  confirmText = document.querySelector('.confirm-text').innerHTML;
  cancelText = document.querySelector('.cancel-text').innerHTML;
  required = document.querySelector('.required').innerHTML;
  clearAnswers = document.querySelector('.clear-answers').innerHTML;
  areYouSureTitle = document.querySelector('.are-you-sure-title').innerHTML;
  noUpdateAfterSubmitText = document.querySelector('.no-update-after-submit-text').innerHTML;

  questions = JSON.parse(document.getElementById('questions').value);
  submition = JSON.parse(document.getElementById('submition').value);

  question_types.short_text = document.querySelector('.short-text-type').innerHTML;
  question_types.long_text = document.querySelector('.long-text-type').innerHTML;
  question_types.range = document.querySelector('.range-type').innerHTML;
  question_types.radio = document.querySelector('.radio-type').innerHTML;
  question_types.checked = document.querySelector('.checked-type').innerHTML;

  yourAnswer = document.querySelector('.your-answer').innerHTML;
  other = document.querySelector('.other').innerHTML;

  for (let i = 0; i < questions.length; i++)
    answers[questions[i].question._id] = Array.isArray(questions[i].answer) ? questions[i].answer.map(answer => answer) : questions[i].answer; // Duplicate the array to avoid pointer errors

  document.addEventListener('click', event => {
    // Go instructions buttons is clicked
    if (event.target.classList.contains('go-instructions-button') || event.target.parentNode.classList.contains('go-instructions-button')) {
      allWrapper.childNodes[0].childNodes[0].style.display = 'none';
      allWrapper.childNodes[0].childNodes[1].style.display = 'flex';
    }

    // Start test button is clicked, create the first question content
    if (event.target.classList.contains('start-test-button') || event.target.parentNode.classList.contains('start-test-button')) {
      submition.last_question++;
      saveAnswers(res => {
        if (res) createAllWrapperContent();
      });
    }

    // Next button is clicked
    if (event.target.classList.contains('next-button') || event.target.parentNode.classList.contains('next-button')) {
      if (!questions[submition.last_question].answer || !questions[submition.last_question].answer.length)
        return;
      
      submition.last_question++;
      saveAnswers(res => {
        if (res) createAllWrapperContent();
      });
    }

    // Back button is clicked
    if (event.target.classList.contains('back-button') || event.target.parentNode.classList.contains('back-button')) {
      submition.last_question--;
      saveAnswers(res => {
        if (res) createAllWrapperContent();
      });
    }

    // Back button in finish page is clicked, create the last question content
    if (event.target.classList.contains('finish-page-back-button') || event.target.parentNode.classList.contains('finish-page-back-button')) {
      submition.last_question--;
      createAllWrapperContent();
    }

    // Submit test button is clicked
    if (event.target.classList.contains('finish-page-submit-button') || event.target.parentNode.classList.contains('finish-page-submit-button')) {
      createConfirm({
        title: areYouSureTitle,
        text: noUpdateAfterSubmitText,
        reject: cancelText,
        accept: confirmText
      }, res => {
        if (!res) return;

        submitAnswers(res => {
          if (res) return window.location = '/waiting';
        });
      });
    }

    // Range question clicked
    if (event.target.classList.contains('each-question-each-scale')) {
      questions[submition.last_question].answer = event.target.innerHTML;
      answers[questions[submition.last_question].question._id] = event.target.innerHTML;
      if (document.querySelector('.each-question-selected-scale'))
        document.querySelector('.each-question-selected-scale').classList.remove('each-question-selected-scale');
      event.target.classList.add('each-question-selected-scale');
      saveAnswers(res => { return });
    }

    // Radio choice clicked
    if (event.target.classList.contains('each-question-choice-radio')) {
      const target = event.target;
      questions[submition.last_question].answer = target.childNodes[1].innerHTML;
      answers[questions[submition.last_question].question._id] = target.childNodes[1].innerHTML;
      if (document.querySelector('.selected-choice'))
        document.querySelector('.selected-choice').classList.remove('selected-choice');
      target.childNodes[0].classList.add('selected-choice');
      saveAnswers(res => { return });
    } else if (event.target.parentNode.classList.contains('each-question-choice-radio')) {
      const target = event.target.parentNode;
      questions[submition.last_question].answer = target.childNodes[1].innerHTML;
      answers[questions[submition.last_question].question._id] = target.childNodes[1].innerHTML;
      if (document.querySelector('.selected-choice'))
        document.querySelector('.selected-choice').classList.remove('selected-choice');
      target.childNodes[0].classList.add('selected-choice');
      saveAnswers(res => { return });
    } else if (event.target.parentNode.parentNode.classList.contains('each-question-choice-radio')) {
      const target = event.target.parentNode;
      questions[submition.last_question].answer = target.childNodes[1].innerHTML;
      answers[questions[submition.last_question].question._id] = target.childNodes[1].innerHTML;
      if (document.querySelector('.selected-choice'))
        document.querySelector('.selected-choice').classList.remove('selected-choice');
      target.childNodes[0].classList.add('selected-choice');
      saveAnswers(res => { return });
    }

    // Checked choice clicked
    if (event.target.classList.contains('each-question-choice-checked')) {
      const target = event.target;
      if (target.childNodes[0].classList.contains('selected-choice')) {
        questions[submition.last_question].answer = questions[submition.last_question].answer.filter(choice => choice != target.childNodes[1].innerHTML);
        answers[questions[submition.last_question].question._id] = answers[questions[submition.last_question].question._id].filter(choice => choice != target.childNodes[1].innerHTML);
        target.childNodes[0].classList.remove('selected-choice');
        saveAnswers(res => { return });
      } else {
        questions[submition.last_question].answer.push(target.childNodes[1].innerHTML);
        answers[questions[submition.last_question].question._id].push(target.childNodes[1].innerHTML);
        target.childNodes[0].classList.add('selected-choice');
        saveAnswers(res => { return });
      }
    } else if (event.target.parentNode.classList.contains('each-question-choice-checked')) {
      target = event.target.parentNode;
      if (target.childNodes[0].classList.contains('selected-choice')) {
        questions[submition.last_question].answer = questions[submition.last_question].answer.filter(choice => choice != target.childNodes[1].innerHTML);
        answers[questions[submition.last_question].question._id] = answers[questions[submition.last_question].question._id].filter(choice => choice != target.childNodes[1].innerHTML);
        target.childNodes[0].classList.remove('selected-choice');
        saveAnswers(res => { return });
      } else {
        questions[submition.last_question].answer.push(target.childNodes[1].innerHTML);
        answers[questions[submition.last_question].question._id].push(target.childNodes[1].innerHTML);
        target.childNodes[0].classList.add('selected-choice');
        saveAnswers(res => { return });
      }
    } else if (event.target.parentNode.parentNode.classList.contains('each-question-choice-checked')) {
      target = event.target.parentNode.parentNode;
      if (target.childNodes[0].classList.contains('selected-choice')) {
        questions[submition.last_question].answer = questions[submition.last_question].answer.filter(choice => choice != target.childNodes[1].innerHTML);
        answers[questions[submition.last_question].question._id] = answers[questions[submition.last_question].question._id].filter(choice => choice != target.childNodes[1].innerHTML);
        target.childNodes[0].classList.remove('selected-choice');
        saveAnswers(res => { return });
      } else {
        questions[submition.last_question].answer.push(target.childNodes[1].innerHTML);
        answers[questions[submition.last_question].question._id].push(target.childNodes[1].innerHTML);
        target.childNodes[0].classList.add('selected-choice');
        saveAnswers(res => { return });
      }
    }

    // Clear answers
    if (event.target.classList.contains('clear-question-button')) {
      if (Array.isArray(questions[submition.last_question].answer)) {
        questions[submition.last_question].answer = [];
        answers[questions[submition.last_question].question._id] = [];
      } else {
        questions[submition.last_question].answer = '';
        answers[questions[submition.last_question].question._id] = '';
      }

      if (document.querySelector('.answer-input'))
        document.querySelector('.answer-input').value = '';
      if (document.querySelector('.each-question-selected-scale'))
        document.querySelector('.each-question-selected-scale').classList.remove('each-question-selected-scale');
      const allClickedChoices = document.querySelectorAll('.selected-choice');
      allClickedChoices.forEach(choice => {
        choice.classList.remove('selected-choice');
      });
      if (document.querySelector('.each-question-other-option-input-wrapper'))
        document.querySelector('.each-question-other-option-input-wrapper').childNodes[1].value = '';

      document.querySelector('.next-button').style.cursor = 'not-allowed';
    }
  });

  document.addEventListener('input', event => {
    // Listen for short_text or long_text answers
    if (event.target.classList.contains('answer-input')) {
      questions[submition.last_question].answer = event.target.value;
      answers[questions[submition.last_question].question._id] = event.target.value;
      saveAnswers(res => { return });
    }

    // Listen for other_option on radio and checked choices
    if (event.target.parentNode.classList.contains('each-question-other-option-input-wrapper')) {
      const question = questions[submition.last_question].question;

      if (question.type == 'radio') {
        if (document.querySelector('.selected-choice'))
          document.querySelector('.selected-choice').classList.remove('selected-choice');
        questions[submition.last_question].answer = '';
        answers[questions[submition.last_question].question._id] = '';
        
        if (event.target.value.length) {
          event.target.parentNode.childNodes[0].classList.add('selected-choice');
          questions[submition.last_question].answer = event.target.value;
          answers[questions[submition.last_question].question._id] = event.target.value;
        }
      } else if (question.type == 'checked') {
        if (event.target.value.length) {
          event.target.parentNode.childNodes[0].classList.add('selected-choice');

          // Delete old custom choices
          questions[submition.last_question].answer = questions[submition.last_question].answer.filter(choice => question.choices.includes(choice));
          answers[questions[submition.last_question].question._id] = answers[questions[submition.last_question].question._id].filter(choice => question.choices.includes(choice));
          
          // Push new choices
          questions[submition.last_question].answer.push(event.target.value);
          answers[questions[submition.last_question].question._id].push(event.target.value);
        } else {
          event.target.parentNode.childNodes[0].classList.remove('selected-choice');
          questions[submition.last_question].answer = questions[submition.last_question].answer.filter(choice => question.choices.includes(choice));
          answers[questions[submition.last_question].question._id] = answers[questions[submition.last_question].question._id].filter(choice => question.choices.includes(choice));
        }
      } else {
        return;
      }

      saveAnswers(res => { return });
    }
  });
}
