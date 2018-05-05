class Events {
  constructor(){
    this.connect = browser.runtime.connect({ name: "reloadTable" });
  }
  getActions() {
    var RecordBrowser = JSON.parse(localStorage.getItem("RecordBrowser"));
    if (!RecordBrowser) {
      RecordBrowser = {
        projects: [
          {
            id: 0,
            nombre: "secuencia",
            actions: [],
          }
        ]
      }
    }
    return RecordBrowser.projects[0].actions;
  }
  storeEvent(event) {
    if (mainController.state == "record" && event.action!="text") {
      var project = this.getActualProject();
      project.actions.push(event);
      this.saveActualProject(project);
    }else{
      if (mainController.state == "text") {
        if (event.action=="text") {
          alert('texto guardado:'+event.data);
          var project = this.getActualProject();
          project.actions.push(event);
          this.saveActualProject(project);
          mainController.stop();
        }
  
      }
    }
  }
  getActualProject() {
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
  saveActualProject(project) {
    var RecordBrowser = JSON.parse(localStorage.getItem("RecordBrowser"));
    if (!RecordBrowser) {
      RecordBrowser = {
        projects: []
      }
    }
    RecordBrowser.projects[0] = project;
    localStorage.setItem("RecordBrowser", JSON.stringify(RecordBrowser));
  }
  saveURL() {

    //  browser.tabs.getSelected(null, function (tab) {
    //   browser.tabs.query({active: true}){
    //   var project = this.getActualProject();
    //   if(!project.url){
    //     project.url = tab.url;
    //   }
    //   this.saveActualProject(project);
    // }.bind(this));
    function logTabs(tabs) {
      
      for (let tab of tabs) {
        var project = this.getActualProject();
        if(!project.url){
          project.url = tab.url;
        }
        this.saveActualProject(project);
        // tab.url requires the `tabs` permission
        console.log(tab.url);
      }
    }
    
    function onError(error) {
      console.log(`Error: ${error}`);
    }
    
    var querying = browser.tabs.query({active: true},logTabs.bind(this));
    //querying.then(logTabs.bind(this), onError);


  }
}