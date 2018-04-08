var back = chrome.extension.getBackgroundPage();
var port = chrome.extension.connect({name: "reloadTable"});
reloadTable();
port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg);
    reloadTable();
});
document.getElementById("reload").onclick=function(){
    reloadTable();
}

document.getElementById("record").onclick=function(){
    back.record();
}
document.getElementById("stop").onclick=function(){
    back.stop();
}
document.getElementById("clear").onclick=function(){
    localStorage.removeItem("RecordBrowser");
    reloadTable();
}
function reloadTable() {
    var old_tbody = document.getElementById('project');
    var new_tbody = document.createElement('tbody');
    new_tbody.id='project';
    populate_with_new_rows(new_tbody);
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
}

function populate_with_new_rows(tbody) {
    var project=getActualProject();
    project.actions
    project.actions.forEach(element => {
        console.log(element);
        var tr = document.createElement("tr");

        var td = document.createElement("td");
        var txt = document.createTextNode(0);
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var txt = document.createTextNode(element.action);
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var input = document.createElement("input");
        input.type = "text";
        input.value = element.path
        input.disabled = true;
        td.appendChild(input);
        tr.appendChild(td);

        var td = document.createElement("td");
        var input = document.createElement("input");
        input.type = "text";
        td.appendChild(input);
        tr.appendChild(td);
        
        tbody.appendChild(tr);
    });
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
