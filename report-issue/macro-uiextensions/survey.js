import xapi from 'xapi';

// todo move to prod
const surveyUrl = 'http://10.228.101.190:8080';

function showSurvey() {
  xapi.Command.UserInterface.WebView.Display({
    Url: surveyUrl,
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
