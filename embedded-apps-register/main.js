  // curl --location --request PATCH 'https://webexapis.com/v1/applications/<yourappid>' --header 'Authorization: Bearer <yourpersonalbearertoken>' --header 'Content-Type: application/json' --data-raw '{"appContext": ["in_meeting_device", "in_meeting"]}'

const baseUrl = 'https://webexapis.com/v1/applications/';

function sendRequest(appId, bearerToken) {
  console.log('register', { appId, bearerToken });
  const url = baseUrl + appId;
  const headers = {
    Authorization: `Bearer ${bearerToken}`,
    'Content-Type': 'application/json'
  };
  const body = { appContext: ["in_meeting_device", "in_meeting"] };
  const method = 'PATCH';
  console.log('fetch', { url, headers, body, method });
  return fetch(url, { headers, method, body: JSON.stringify(body) });
}

const data = {
  token: '',
  appId: '',
  message: '',
  error: '',

  get url() {
    return `curl --location --request PATCH 'https://webexapis.com/v1/applications/${this.appId}' --header 'Authorization: Bearer ${this.token}' --header 'Content-Type: application/json' --data-raw '{"appContext": ["in_meeting_device", "in_meeting"]}'`
  },

  async register(appId, bearerToken) {
    this.error = '';
    this.message = '';
    try {
      const res = await sendRequest(this.appId, this.token);
      if (res.ok) {
        console.log('OK!');
        this.message = "App registered succesfully!";
      }
      else {
        const msg = await res.json();
        console.warn('FAIL', msg.message);
        this.error = msg.message;
      }
    }
    catch(e) {
      this.error = 'Network error';
    }
  },

  canSubmit() {
    return this.token.trim().length > 5 && this.appId.trim().length > 5;
  },
};
