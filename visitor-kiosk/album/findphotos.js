// add bot token here
const token = null;

const fetch = require('node-fetch');
const fs = require('fs');

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function downloadFile (url, name) {
  console.log('save', name);

  const headers = {
    'Authorization': 'Bearer ' + token,
  };
  const res = await fetch(url, { headers });
  const fileStream = fs.createWriteStream(name);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
}

async function searchSpace(roomId) {
  // console.log('search space', roomId);
  const url = 'https://webexapis.com/v1/messages?max=999&roomId=' + roomId;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
  };
  const res = await fetch(url, { headers });
  const list = await res.json();
  for (let msg of list.items) {
    // console.log(msg);
    const search = msg.html?.match(/Name: <strong>(.*?)<\/strong>/);
    const name = search ? search[1] : 'unknown';
    const date = msg.created;
    // console.log('name', name);
    if (msg.files?.length) {
      const url = msg.files[0];
      const safeName = name.replace(/\W/g, '_');
      const file = date + '-' + safeName + '.jpg';
      const path = 'photos/' + file;
      await downloadFile(url, path);
    }
  }
}

async function findRooms() {
  const url = 'https://webexapis.com/v1/memberships?max=999';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
  };
  const res = await fetch(url, { headers });

  const list = await res.json();

  // if more than max number of spaces, this url contains next page:
  // console.log('link', res.headers.get('Link'));

  for (let space of list.items) {
    searchSpace(space.roomId);
    await sleep(1000);
  }
}

findRooms();
