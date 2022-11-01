const dataModel = {
  theme: 'disney',
  step: 'start',
  answers: {
    comments: '',
    name: '',
  },
  createIncident: false,
  incidentNumber: false,

  init() {
    const params = new URLSearchParams(location.search);
    const askRating = params.get('askrating');
    this.step = askRating ? 'start' : 'whatwaswrong';
    this.theme = params.get('theme') || '';
  },

  answer(step, choice) {
    this.answers[step] = choice;
    if (step === 'start') {
      if (choice === 'notgood') {
        this.step = 'whatwaswrong';
        this.createIncident = true;
      }
      else {
        this.step = 'done';
      }
    }
    else if (step === 'whatwaswrong') {
      this.step = 'moreinfo';
    }
  },

  async submit() {
    const { whatwaswrong, comments, name } = this.answers;
    this.incidentNumber = await createReport(whatwaswrong, comments, name);
    this.step = 'done';
  },
}