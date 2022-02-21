
function setup() {

  Alpine.store('model', {
    currentPage: 'home', // 'home', 'service'
    currentLanguage: 'english',
    get page() {
      return this.currentPage;
    },
    set page(nextPage) {
      this.currentPage = nextPage;
    },
    currentLanguage: 'english',
    languages: ['english', 'norwegian'],
    get language() {
      return this.currentLanguage;
    },
    set language(current) {
      this.currentLanguage = current;
    },
    services: [
      { url: '20028162201@go.webex.com', name: 'Loan' },
      { url: 'erica.talking@ivr.vc', name: 'Advice' },
      { url: 'erica.talking@ivr.vc', name: 'Credit' },
    ],
  });

}

document.addEventListener('alpine:init', setup);

