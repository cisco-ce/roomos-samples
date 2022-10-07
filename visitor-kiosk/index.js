
const dataModel = {
  page: 'home', // 'home', 'checkIn', 'findHost', 'checkOut', 'registered'
  name: '',
  email: '',
  host: '',
  date: 'October 6, 2022',
  time: '10:35 AM',

  init() {
    this.updateTimeAndDate();
    setInterval(() => this.updateTimeAndDate(), 30 * 1000);
  },

  home() {
    this.page = 'home';
  },

  get validForm() {
    // skip while developing
    // if (this.page === 'checkIn') {
    //   return this.name.trim().length && this.email.match(/\w+@\w+/);
    // }
    return true;
  },

  checkIn() {
    this.page = 'checkIn';
  },

  findHost() {
    this.page = 'findHost';
    console.log('register', this.name, this.email);
  },

  registered() {
    this.page = 'registered';
  },

  searchHost() {
    console.log('search for', this.host);
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


