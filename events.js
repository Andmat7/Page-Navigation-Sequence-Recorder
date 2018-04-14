class Events {
    getActions() {
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
        return RecordBrowser.projects[0].actions;
    }
}