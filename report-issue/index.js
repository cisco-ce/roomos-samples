const dataModel = {
  theme: 'disney',
  step: 'start',
  answers: {
    comments: '',
    name: '',
  },
  createIncident: false,
  incidentNumber: false,
  roomName: 'Unknown room',
  showQr: false,

  init() {
    const params = new URLSearchParams(location.search);
    const askRating = params.get('askrating');
    this.step = askRating ? 'start' : 'whatwaswrong';
    this.theme = params.get('theme') || '';
    this.roomName = params.get('roomname');
    this.device = params.get('device');
    this.createQrCode();
  },

  createQrCode() {
    const url = location.href;
    new QRCode(document.getElementById("qr-code"), url);
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

  async submit() {
    const { whatwaswrong, comments, name } = this.answers;
    const { roomName, device } = this;
    this.createIncident = true;
    this.incidentNumber = await createReport(whatwaswrong, comments, name, roomName, device);
    console.log('created', this.incidentNumber);
    this.step = 'done';
  },
}