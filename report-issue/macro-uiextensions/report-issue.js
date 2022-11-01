import xapi from 'xapi';


/** Fill this out yourself: */
const serviceNow = {
  instance: '',
  username: 'admin',
  password: '',
};
const theme = '';


/** No need to touch */

const surveyUrl = 'https://cisco-ce.github.io/roomos-samples/report-issue/';

async function getSystemInfo() {
  const device = await xapi.Status.SystemUnit.ProductId.get();
  const serialNumber = await xapi.Status.SystemUnit.Hardware.Module.SerialNumber.get();
  const software = await xapi.Status.SystemUnit.Software.DisplayName.get();
  const date = await xapi.Status.SystemUnit.Software.ReleaseDate.get();
  return `Type: ${device} Serial: ${serialNumber} Software: ${software} (${date})`;
}

async function getUrl() {
  const room = await xapi.Status.UserInterface.ContactInfo.Name.get();
  const device = await getSystemInfo();

  let url = surveyUrl;
  url += `?i=${serviceNow.instance}`;
  url += `&u=${serviceNow.username}`;
  url += `&p=${serviceNow.password}`;
  url += `&theme=${theme}`;
  url += `&roomname=${room}`;
  url += `&device=${device}`;
  return url;
}

async function showSurvey() {
  const url = await getUrl();
  console.log('open', url);
  xapi.Command.UserInterface.WebView.Display({
    Url: url,
    Target: 'Controller',
    Mode: 'Modal',
  });
}

function init() {
  xapi.Event.UserInterface.Extensions.Panel.Clicked.on(e => {
    if (e.PanelId === 'report_issue') {
      showSurvey();
    }
  })
}

init();
