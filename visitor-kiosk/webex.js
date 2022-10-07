let currentSearchNumber = 0;

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
