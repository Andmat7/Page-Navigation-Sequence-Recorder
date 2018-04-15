var back = chrome.extension.getBackgroundPage();
var port = chrome.extension.connect({name: "reloadTable"});
port.onMessage.addListener(function(msg) {
    reloadTable();
});
class PopUP {
    constructor(){
        document.getElementById("reload").onclick=function(){
            this.reloadTable();
        }.bind(this);
        
        document.getElementById("record").onclick=function(){
            back.mainController.record();
        }
        document.getElementById("stop").onclick=function(){
            back.mainController.stop();
        }
        document.getElementById("play").onclick=function(){
            back.mainController.play();
        }
        document.getElementById("clear").onclick=function(){
            localStorage.removeItem("RecordBrowser");
            this.reloadTable();
        }.bind(this);
        this.reloadTable();
    }
    reloadTable(){
        var old_tbody = document.getElementById('project');
        var new_tbody = document.createElement('tbody');
        new_tbody.id='project';
        this.populate_with_new_rows(new_tbody);
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
    }
    populate_with_new_rows(tbody){
        var project=this.getActualProject();
        project.actions.forEach(element => {
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
            input.value = element.data
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
    getActualProject(){
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
}

let popup=new PopUP(); 
//popup.reloadTable();