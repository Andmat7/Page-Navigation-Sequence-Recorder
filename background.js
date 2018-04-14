var player = new Player();
var mainController = new MainController();

RecordOptions = {
  enableRecord: false,
  state: "nothing",
}


function record() {
  RecordOptions.enableRecord = true;
  chrome.browserAction.setBadgeText({ "text": "rec" });
}
function stop() {
  RecordOptions.enableRecord = false;
  chrome.browserAction.setBadgeText({ "text": "" });
}


chrome.extension.onConnect.addListener(function (port) {
  if (port.name == "storeEvent") {
    port.onMessage.addListener(function (event) {
      storeEvent(event)
      port.postMessage("reloadTable");
    });
  }

});
function storeEvent(event) {
  if (RecordOptions.enableRecord) {
    var project = getActualProject();
    project.actions.push(event);
    saveActualProject(project);
  }

}
function getActualProject() {
  var RecordBrowser = JSON.parse(localStorage.getItem("RecordBrowser"));
  if (!RecordBrowser) {
    RecordBrowser = {
      projects: [
        {
          id: 0,
          nombre: "un nombre",
          actions: [],
        }
      ]
    }
  }
  return RecordBrowser.projects[0];
}
function saveActualProject(project) {
  var RecordBrowser = JSON.parse(localStorage.getItem("RecordBrowser"));
  if (!RecordBrowser) {
    RecordBrowser = {
      projects: []
    }
  }
  RecordBrowser.projects[0] = project;
  localStorage.setItem("RecordBrowser", JSON.stringify(RecordBrowser));
}
