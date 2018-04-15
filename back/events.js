class Events {
  getActions() {
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
    return RecordBrowser.projects[0].actions;
  }
  storeEvent(event) {
    if (mainController.state == "record") {
      var project = this.getActualProject();
      project.actions.push(event);
      this.saveActualProject(project);
    }
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

    chrome.tabs.getSelected(null, function (tab) {
      var project = this.getActualProject();
      project.url = tab.url;
      this.saveActualProject(project);
    }.bind(this));


  }
}