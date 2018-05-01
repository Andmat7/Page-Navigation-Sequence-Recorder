var back = chrome.extension.getBackgroundPage();
var port = chrome.extension.connect({ name: "reloadTable" });
port.onMessage.addListener(function (msg) {
    reloadTable();
});
class PopUP {
    constructor() {
        this.AddOnClicks();
        this.reloadTable();
        chrome.runtime.onConnect.addListener(function (port) {
            if (port.name == "popup_player") {
                if (port.name == "popup_player") {
                    port.onMessage.addListener(function (message) {
                        if (message.action == "updateAction")
                            this.updateIndexEvent(message.index, message.simbol);
                        if (message.action == "clearActions")
                            this.reloadTable();
                        if (message.action == "closePopUp")
                            window.close();
                    }.bind(this));
                }
            }

        }.bind(this));
    }
    updateIndexEvent(index, simbol) {
        document.getElementById("index_" + index).innerHTML = simbol;
    }

    AddOnClicks() {
        document.getElementById("reload").onclick = function () {
            this.reloadTable();
        }.bind(this);

        document.getElementById("record").onclick = function () {
            back.mainController.record();
        }.bind(this)
        document.getElementById("stop").onclick = function () {
            back.mainController.stop();
        }
        document.getElementById("play").onclick = function () {
            back.mainController.play();
        }
        document.getElementById("send").onclick = function () {
            back.mainController.send();
        }
        document.getElementById("download").onclick = function () {
            this.downloadJSON();
        }.bind(this);
        document.getElementById("clear").onclick = function () {
            localStorage.removeItem("RecordBrowser");
            this.reloadTable();
        }.bind(this);
        document.getElementById("secuencia").onchange = this.saveSecuencia.bind(this);
        document.getElementById("SelectText").onclick = function () {
            back.mainController.detectText();
        }.bind(this);
    }
    downloadJSON() {
        var project = this.getActualProject();
        var projectString = JSON.stringify(project, null, 4);
        var Blobfile = new Blob([projectString], { type: "octet/stream" });
        var file_name = project.nombre + '.json';
        var url = window.URL.createObjectURL(Blobfile);
        chrome.downloads.download({
            filename: file_name,
            url: url
        });
    }
    saveSecuencia(changeEvent) {
        var project = this.getActualProject();
        project.nombre = changeEvent.target.value;
        this.saveActualProject(project);
    }
    reloadTable() {
        var old_tbody = document.getElementById('project');
        var new_tbody = document.createElement('tbody');
        new_tbody.id = 'project';
        this.populate_with_new_rows(new_tbody);
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
    }
    populate_with_new_rows(tbody) {
        var project = this.getActualProject();
        debugger;
        document.getElementById('url_input').value = project.url;
        project.actions.forEach(function (element, index) {

            back.mainController.state == "play"

            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.id = "index_" + index;
            td.className = "player_action"
            var intext = index;
            if (back.mainController.state == "play") {
                if (back.player.counter > index) {
                    intext = "✓"
                } else {
                    if (back.player.counter == index)
                        intext = 'exec'
                }

            }
            var txt = document.createTextNode(intext);


            td.appendChild(txt);
            tr.appendChild(td);

            var td = document.createElement("td");
            var txt = document.createTextNode(element.action);
            td.appendChild(txt);
            tr.appendChild(td);

            var td = document.createElement("td");
            var input = document.createElement("input");
            input.type = "text";
            input.value = element.path;
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
            input.index = index;
            if (element.comment) {
                input.value = element.comment
            }
            input.id = "commentary_" + index;
            input.onchange = this.updateComment.bind(this);
            td.appendChild(input);
            tr.appendChild(td);

            tbody.appendChild(tr);
        }.bind(this));

    }
    updateComment(input) {
        var index = input.target.index
        var value = input.target.value
        var project = this.getActualProject();
        project.actions[index].comment = value;
        this.saveActualProject(project);
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
}

let popup = new PopUP();