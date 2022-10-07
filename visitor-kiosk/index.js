const hostMessage = `Hello! A visitor has just arrived in the reception, and registered you as their host.

Details:

* Name: **$name**
* Email: **$email**
`;

const dataModel = {
  page: 'home', // 'home', 'checkIn', 'findHost', 'checkOut', 'photo', 'confim', 'registered'
  name: '',
  email: '',
  hostSearch: '',
  currentHost: null,
  date: 'October 6, 2022',
  time: '10:35 AM',
  foundHosts: [],
  searchStatus: '',
  photo: null,

  init() {
    this.updateTimeAndDate();
    setInterval(() => this.updateTimeAndDate(), 30 * 1000);
  },

  home() {
    this.page = 'home';
    this.reset();
  },

  reset() {
    this.name = '';
    this.email = '';
    this.currentHost = null;
    this.foundHosts = [];
    this.searchStatus = '';
    this.photo = null;
  },

  get validForm() {
    if (this.page === 'checkIn') {
      return this.name.trim().length && this.email.match(/\w+@\w+/);
    }
    return true;
  },

  checkIn() {
    this.page = 'checkIn';
    this.focus('#name');
  },

  focus(id) {
    // need to wait for DOM to be updated
    setTimeout(() => {
      const firstInput = document.querySelector(id);
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);

  },

  findHost() {
    this.page = 'findHost';
    this.focus('#host');
  },

  register() {
    this.page = 'registered';
    const msg = hostMessage
      .replace('$name', this.name.trim())
      .replace('$email', this.email.trim());
    const email = this.currentHost.emails[0];
    const token = this.getToken();

    sendMessage(token, email, null, msg)
      .catch(e => {
        console.warn(e);
        alert('We were not able to send a message to the host at this time.');
    });
  },

  selectHost(host) {
    this.currentHost = host;
    this.hostSearch = '';
    this.foundHosts = [];
  },

  getToken() {
    // TODO perhaps use localStorage intead?
    return new URLSearchParams(location.search).get('token');
  },

  next() {
    const { page } = this;
    if (page === 'findHost') {
      this.showPhotoPage();
    }
    else if (page === 'photo') {
      this.showConfirmation();
    }
    else if (page === 'confirm') {
      this.register();
    }
    else {
      console.error('unknown next page');
    }
  },

  showConfirmation() {
    this.page = 'confirm';
  },

  async showPhotoPage() {
    this.page = 'photo';
    try {
      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.querySelector('.webcam');
        video.srcObject = stream;
      }
    }
    catch(e) {
      console.error('not able to get video', e);
    }
  },

  takePhoto() {
    const w = 600;
    const h = 337;
    const canvas = document.querySelector('.photo');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);

    const video = document.querySelector('.webcam');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 600, 337);
    this.photo = canvas.toDataURL('image/png');

    // to compress for jpeg for webex cards, look at:
    // https://github.com/jpeg-js/jpeg-js/blob/master/lib/encoder.js
  },

  searchHost() {
    const word = this.hostSearch.trim();

    const token = this.getToken();
    if (!token) {
      alert('Kiosk does not have bot token to search for people');
      return;
    }

    if (word.length > 2) {
      this.searchStatus = 'Searching...';
      searchPerson(word, token, list => {
        this.foundHosts = list;
        this.searchStatus= 'Found: ' + list.length;
      });
    }
  },

  getAvatar(person) {
    const { avatar } = person || {};
    return avatar
      ? { backgroundImage: `url(${avatar.replace('~1600', '~110')})` }
      : null;
  },

  checkOut() {
    this.page = 'checkOut';
  },


  updateTimeAndDate() {
    const now = new Date();
    this.date = now.format('mmmm d, yyyy');
    this.time = now.format('HH:MM');
  }
};


