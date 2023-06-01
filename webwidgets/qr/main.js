const $ = selector => document.querySelector(selector);

const defaultUrl = 'https://cisco.com';
const params = new URLSearchParams(location.search);

const url = params.get('url') || defaultUrl;
const accent = params.get('accent') || 'black';
const background = params.get('background') || 'white';
const text = params.get('text') || '';
const title = params.get('title') || '';

if (title) {
  $('#title').innerHTML = title;
  $('#title').style.display = 'block';
}

if (text) {
  $('#text').innerHTML = text;
  $('#text').style.display = 'block';
}

const qrcode = new QRCode('qr-code', {
  text: url,
  width: 512,
  height: 512,
  colorDark: accent,
  colorLight: background,
  correctLevel : QRCode.CorrectLevel.H,
});
