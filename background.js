chrome.extension.onConnect.addListener(function(port) {
    console.assert(port.name == "storeEvent");
    port.onMessage.addListener(function(event) {
      storeEvent(event)
    });
});
function storeEvent(event) {
  var project=getActualProject();
  project.actions.push(event);
  saveActualProject(project);
}
function getActualProject() {
  var RecordBrowser=JSON.parse(localStorage.getItem("RecordBrowser"));
  if(!RecordBrowser){
    RecordBrowser={
      projects:[
        {
          id:0,
          nombre:"un nombre",
          actions:[],
        }
      ]
    }
  }
  return RecordBrowser.projects[0];
}
function saveActualProject(project){
  var RecordBrowser=JSON.parse(localStorage.getItem("RecordBrowser"));
  if(!RecordBrowser){
    RecordBrowser={
      projects:[]
    }
  }
  RecordBrowser.projects[0]=project;
  localStorage.setItem("RecordBrowser", JSON.stringify(RecordBrowser));
}
