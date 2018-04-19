class Player {
    constructor() {
        this.counter = 0;
    }
    listener(request) {
        debugger;
        if (request.ready) {
            this.checkLastAction(request.action)
        }
    }
    checkLastAction(action) {
        let actualAction = this.actions[0];
        if (actualAction.path == action.path) {
            this.endAction();
        } else {
            alert('error');
        }
    }
    after_initialize() {
        var EventsController = new Events();
        this.actions = EventsController.getActions();
        this.counter = 0;
        this.sendAction();
    }
    playing() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                this.player_connect = chrome.tabs.connect(tabs[0].id, { name: "player_connect" });
                this.player_connect.onMessage.addListener(this.listener);
                this.after_initialize();
            } else {
            }
        }.bind(this));


    }
    endAction() {

        //events.updateStateAction(this.counter, '✓');
        this.counter++;
        this.actions.shift();
        if (this.actions.length == 0) {
            mainController.stop();
            alert("finish");
        } else {
            this.sendAction();
        }
    }
    sendAction() {
        debugger;
        let action = this.actions[0];
        this.player_connect.postMessage({ action: action, type: "action" });
    }
    updatePopUpaction(index,simbol){
        this.popup_player = chrome.runtime.connect({name: "popup_player"});
        this.popup_player.postMessage({action: "updateAction",index:index,simbol:simbol});
    }
    clearPopUpActions(){
        this.popup_player = chrome.runtime.connect({name: "popup_player"});
        this.popup_player.postMessage({action: "clearActions"});
    }
}