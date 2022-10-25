const dataModel = {
  step: 'start',
  answers: {
    comments: '',
    name: '',
  },

  init() {
  },

  answer(step, choice) {
    this.answers[step] = choice;
    if (step === 'start') {
      if (choice === 'notgood') {
        this.step = 'whatwaswrong';
      }
      else {
        this.step = 'done';
      }
    }
    else if (step === 'whatwaswrong') {
      this.step = 'moreinfo';
    }
  },

  submit() {
    console.log('submit', this.answers);
    this.step = 'done';
  },
}