
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
  busy: false,

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
    this.busy = true;
    this.incidentNumber = await createReport(whatwaswrong, comments, name, roomName, device);
    this.busy = false;
    console.log('created', this.incidentNumber);
    this.step = 'done';
    this.notifyWithWebex(this.incidentNumber, whatwaswrong, comments, name, roomName, device);
  },

  async notifyWithWebex(id, category, comments, name, roomName, device) {
    const params = new URLSearchParams(location.search);
    const bot = params.get('webextoken');
    const notify = params.get('notify');
    const instance = params.get('i');

    console.log({ bot, notify });
    const url = `${instance}.service-now.com`;
    let msg = `New ServiceNow incident created\n`;
    msg += `\n* Id: **${id}**`;
    msg += `\n* Category: **${category}**`;
    msg += `\n* comments: **${comments}**`;
    msg += `\n* Room: **${roomName}**`;
    msg += `\n* Device: **${device}**`;
    msg += `\n* Reporter: **${name}**`;
    msg += `\n\nYou can log in to [${url}](https://${url}) to view the details.`;

    if (bot && notify) {
      try {
        await sendMessage(bot, notify, msg);
      }
      catch(e) {
        alert('Unable to send Webex message to ' + notify);
        console.log(e);
      }
    }
  }
}