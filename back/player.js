
class Player {

    constructor() {
        //null waiting
        this.state = "null";
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.type == 'onStart') {
                    if (this.state == 'waiting') {
                        this.state = "null";
                        this.endAction();
                    }

                }
            }.bind(this));
    }
    playing() {
        var EventsController = new Events();
        this.actions = EventsController.getActions();
        this.sendAction();

    }
    endAction() {
        this.actions.shift();
        if (this.actions.length == 0) {
            mainController.stop();
        } else {
            this.sendAction();
        }
    }
    sendAction() {
        let action = this.actions[0];
        if (action.action == "redirect") {
            this.state = "waiting";
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: action, type: "action" }, function (response) {
                    if(response.hasOwnProperty('ready')){
                        if (response.ready) {
                            this.endAction();
                        }
                    }

                }.bind(this));
            } else {
                setTimeout(function () { this.sendAction() }.bind(this), 1000);
            }
        }.bind(this));
    }
}