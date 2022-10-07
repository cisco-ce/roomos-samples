const hostMessage = `Hello! A visitor has just arrived in the reception, and registered you as their host.

Details:

* Name: **$name**
* Email: **$email**
`;

const dataModel = {
  page: 'home', // 'home', 'checkIn', 'findHost', 'checkOut', 'registered'
  name: '',
  email: '',
  host: '',
  date: 'October 6, 2022',
  time: '10:35 AM',
  foundHosts: [],

  init() {
    this.updateTimeAndDate();
    setInterval(() => this.updateTimeAndDate(), 30 * 1000);
  },

  home() {
    this.page = 'home';
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

  registered() {
    this.page = 'registered';
    const msg = hostMessage
      .replace('$name', this.name.trim())
      .replace('$email', this.email.trim());
    const email = this.host.emails[0];
    const token = this.getToken();

    sendMessage(token, email, null, msg)
      .catch(e => {
        console.warn(e);
        alert('We were not able to send a message to the host at this time.');
    });
  },

  selectHost(host) {
    this.host = host;
    this.registered();
  },

  getToken() {
    // TODO perhaps use localStorage intead?
    return new URLSearchParams(location.search).get('token');
  },

  searchHost() {
    const word = this.host.trim();

    const token = this.getToken();
    if (!token) {
      alert('Kiosk does not have bot token to search for people');
      return;
    }

    if (word.length > 3) {
      searchPerson(word, token, list => this.foundHosts = list);
    }
  },

  getAvatar(person) {
    const { avatar } = person;
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


