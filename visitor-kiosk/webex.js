let currentSearchNumber = 0;

const webexMsgUrl = 'https://webexapis.com/v1/messages';

async function get(url, token) {
  if (!token) throw(new Error('No webex token specified'));

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  try {
    const data = await fetch(url, options);
    const json = await data.json();
    return json.items || null;
  }
  catch(e) {
    console.log('not able to fetch');
    return null;
  }
}

function sendMessage(token, toPersonEmail, roomId, markdown) {
  const body = Object.assign({ markdown }, toPersonEmail ? { toPersonEmail } : { roomId });
  // console.log('send', { token, toPersonEmail, markdown });
  const options = {
    headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(body),
    method: 'POST'
  };

  return fetch(webexMsgUrl, options);
}

async function searchPerson(keyword, token, callback) {
  if (!keyword) return;

  currentSearchNumber++;
  const id = currentSearchNumber; // avoid closure
  const url = `https://webexapis.com/v1/people?displayName=${keyword}`;
  const result = await get(url, token);

  // a newer search has been requested, discard this one
  if (id < currentSearchNumber) {
    console.log('skipping search', currentSearchNumber);
    return;
  }

  callback(result);
}
