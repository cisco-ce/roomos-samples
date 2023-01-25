const hostMessage = `Hello! A visitor has just arrived in the reception, and registered you as their host.

Details:

* Name: **$name**
* Email: **$email**
`;

const dataModel = {
// home > checkIn > findHost > confirmHost > photo > confim > registered | checkOut > checkOutResult
  page: 'home',
  name: '',
  email: '',
  hostSearch: '',
  currentHost: null,
  date: 'October 6, 2022',
  time: '10:35 AM',
  foundHosts: [],
  searchStatus: '',
  photo: null,
  photoTimer: 0,
  photoTime: 0,
  videoStream: null,
  phoneNumber: '',
  taxiNumber: '',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37964.479957946394!2d-121.95893677399364!3d37.41713987799405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fc911562d481f%3A0xd3d896b473be003!2sCisco%20Systems%20Building%2012!5e0!3m2!1sen!2sno!4v1674211511880!5m2!1sen!2sno',

  init() {
    this.updateTimeAndDate();
    setInterval(() => this.updateTimeAndDate(), 30 * 1000);
    const params = new URLSearchParams(location.search);
    this.mapUrl = params.get('map') || this.mapUrl;
    this.theme = params.get('theme');

    if (this.theme) {
      // <link href="styles/theme-night.css" rel="stylesheet">
      const head = document.getElementsByTagName("head")[0];
      head.insertAdjacentHTML(
        "beforeend",
        `<link rel="stylesheet" href="styles/theme-cisco.css" />`);
    }
    // quick jump to photo page for dev:
    // this.showPhotoPage();
    // this.name = 'Tore Bjolseth';
    // this.email = 'tbjolset@cisco.com';
    // this.currentHost = { displayName: 'Anna Gjerlaug' };
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
    this.phoneNumber = '';
    clearInterval(this.photoTimer);
  },

  call() {
    const defaultNumber = 'erica.talking@ivr.vc';
    const number = new URLSearchParams(location.search).get('reception') || defaultNumber;
    location.href = `sip:${number}`;
  },

  get validForm() {
    const emailPattern = /\w+@\w+/;
    if (this.page === 'checkIn') {
      return this.name.trim().length && this.email.match(emailPattern);
    }
    else if (this.page === 'checkOut') {
      return this.email.match(emailPattern);
    }
    else if (this.page === 'taxi') {
      return this.phoneNumber.length > 3;
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
    if (!this.currentHost) {
      return;
    }

    const email = this.currentHost.emails[0];
    const token = this.getToken();

    if (!token) {
      return;
    }
    sendMessage(token, email, msg, this.photo)
      .catch(e => {
        console.warn(e);
        alert('We were not able to send a message to the host at this time.');
      });
   },

  selectHost(host) {
    this.currentHost = host;
    this.hostSearch = '';
    this.searchStatus = '';
    this.foundHosts = [];
    this.next();
  },

  getToken() {
    // TODO perhaps use localStorage intead?
    return new URLSearchParams(location.search).get('token');
  },

  next() {
    // home > checkIn > findHost > photo > confim > registered
    const { page } = this;

    if (page === 'home') {
      this.checkIn();
    }
    else if (page === 'checkIn') {
      this.findHost();
    }
    else if (page === 'findHost') {
      this.confirmHost();
    }
    else if (page === 'confirmHost') {
      this.showPhotoPage();
    }
    else if (page === 'photo') {
      this.showConfirmation();
    }
    else if (page === 'confirm') {
      this.register();
    }
    else if (page === 'checkOut') {
      this.page = 'checkOutResult';
    }
    else if (page === 'taxi') {
      this.taxiNumber = Math.ceil(Math.random() * 10000);
      this.page = 'taxiConfirmed';
    }

    else {
      console.error('unknown next page');
    }
  },

  back() {
    // home > checkIn > findHost > photo > confim > registered | checkOut
    const { page } = this;
    if (page === 'checkIn') {
      this.home();
    }
    else if (page === 'findHost') {
      this.checkIn();
    }
    else if (page === 'confirmHost') {
      this.findHost();
    }
    else if (page === 'photo') {
      this.confirmHost();
    }
    else if (page === 'confirm') {
      this.showPhotoPage();
    }
    else {
      console.error('unknown previous page');
    }

  },

  showConfirmation() {
    this.stopCamera();
    this.page = 'confirm';
  },

  checkout() {
    this.page = 'checkOutResult';
  },

  async showPhotoPage() {
    this.page = 'photo';
    try {
      if (navigator.mediaDevices.getUserMedia) {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.querySelector('.webcam');
        video.srcObject = this.videoStream;
      }
    }
    catch(e) {
      console.error('not able to get video', e);
    }
  },

  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => {
        track.stop();
      });
    }
  },

  takePhotoCountdown() {
    this.photo = null;
    document.querySelector('.photo-flash').classList.remove('blink');
    clearInterval(this.photoTimer);
    this.photoTime = 3;
    this.photoTimer = setInterval(() => {
      this.photoTime -= 1;
      if (this.photoTime < 1) {
        clearInterval(this.photoTimer);
        this.takePhoto();
      }
    }, 1000);
  },

  takePhoto() {
    // user has navigated away, skip
    if (this.page !== 'photo') {
      return;
    }

    document.querySelector('#shutter-sound').play();
    document.querySelector('.photo-flash').classList.add('blink');

    const w = 600;
    const h = 337;
    const canvas = document.querySelector('.photo');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);

    const video = document.querySelector('.webcam');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 600, 337);
    // this.photo = canvas.toDataURL('image/jpeg');

    const format = 'jpeg';
    this.photo = canvas.toBlob(photo => {
      this.photo = new File([photo], this.name + '.' + format, { type: "image/" + format, });
    }, 'image/' + format);

    // to compress for jpeg for webex cards, look at:
    // https://github.com/jpeg-js/jpeg-js/blob/master/lib/encoder.js
  },

  searchHost() {
    const word = this.hostSearch.trim();

    const token = this.getToken();

    if (word.length > 2) {
      this.searchStatus = 'Searching...';
      searchPerson(word, token, list => {
        this.foundHosts = list;
        this.searchStatus= 'Found: ' + list.length;
      });
    }
    else {
      this.foundHosts = [];
      this.searchStatus = '';
    }
  },

  confirmHost() {
    this.page = 'confirmHost';
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
  },

  // create img data url from blob
  photoSrc() {
    if (!this.photo) return;
    const url = window.URL.createObjectURL(this.photo);
    console.log('created', url);
    return url;
  }
};


