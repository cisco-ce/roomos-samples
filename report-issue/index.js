const params = new URLSearchParams(window.location.search);

const servicenow = {
  instance: params.get('i'),
  username: params.get('u'),
  password: params.get('p'),
};

function basicAuth(user, password) {
  return "Basic " + btoa(user + ":" + password);
}

// Prepares the incident report
async function createReport(issueCategory, comment, person) {

  const incident = {
    assignment_group: 'MeetingRoom',
    short_description: issueCategory,
    urgency: '2',
    impact: '2',
    description: `User Comment: ${comment}
      User Name: ${person}
    `,
  };

  const { instance, username, password } = servicenow;

  // Send the incident payload to ServiceNow
  const url = `https://${instance}.service-now.com/api/now/table/incident`;
  const body = JSON.stringify(incident);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': basicAuth(username, password),
  }

  const options = {
    headers,
    method: 'POST',
    body,
  };

  if (!instance || !username || !password) {
    alert('Missing ServiceNow instance, username or password');
    return;
  }

  console.log('servicenow:', instance, username, password);

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      alert('Sory, unable to create incident on ServiceNow at the moment.')
    }
    const json = await res.json();
    const number = json?.result?.number;
    alert('Created incident at ServiceNow. Number: ' + number);
  }
  catch(e) {
    console.error('error', e)
    alert('Sorry, not able to send the report at the moment. Perhaps the ServiceNow instance is not available?');
  }

}

const dataModel = {
  theme: 'disney',
  step: 'start',
  answers: {
    comments: '',
    name: '',
  },

  init() {
    const params = new URLSearchParams(location.search);
    this.theme = params.get('theme') || '';
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
    const { whatwaswrong, comments, name } = this.answers;
    console.log('submit', this.answers);
    createReport(whatwaswrong, comments, name);
    this.step = 'done';
  },
}