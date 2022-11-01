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
async function createReport(issueCategory, comment, person, room, device) {

  const title = issueCategory + ' / ' + room;
  const incident = {
    assignment_group: 'MeetingRoom',
    short_description: title,
    urgency: '2',
    impact: '2',
    description: `User Comment: ${comment} \nUser Name: ${person} \nRoom: ${room} \nDevice: ${device}`,
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
      console.error('Error:', res.text());
      return false;
    }
    const json = await res.json();
    const number = json?.result?.number;
    return number;
  }
  catch(e) {
    console.error('error', e);
    return false;
  }
}