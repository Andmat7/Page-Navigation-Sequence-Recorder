class Player {
    constructor() {
        this.counter = 0;
        chrome.runtime.onConnect.addListener(function (player_to_back) {
            //console.log({ player_to_back_onConnect: player_to_back })
            if (player_to_back.name == "player_to_back") {

                player_to_back.onMessage.addListener(function (request) {

                    console.log({ player_to_back_onMessage: request })
                    var isCorrect = this.checkLastAction(request);
                    console.log({ player_to_back_postMessage: { isCorrect: isCorrect } })
                    //player_to_back.postMessage({ isCorrect: isCorrect });
                }.bind(this));
            }

        }.bind(this));
    }
    playing() {
        var EventsController = new Events();
        this.actions = EventsController.getActions();
        this.counter = 0;
        this.sendAction();
    }
    sendAction() {
        this.updatePopUpaction(this.counter, 'exec');
        let action = this.actions[0];
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                this.connectAndSend(tabs[0].id, action);
            } else {
                chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {
                    if (tabs[0]) {
                        this.connectAndSend(tabs[0].id, action);

                    } else {
                        alert('se jodio');
                    }
                });
            }
        }.bind(this));

    }
    connectAndSend(tabid, action) {
        var send_action = chrome.tabs.connect(tabid, { name: "send_action" });
        var algo = send_action.postMessage({ action: action, type: "action" });
        console.log({ send_action: action.action })
        send_action.onMessage.addListener(function (request) {
            console.log({ send_action_listener: request })
            if (request.ready) {
                this.endAction();
            }
        }.bind(this));
    }
    checkLastAction(request) {
        if (request.ready) {
            if (this.actions) {
                if (this.actions.length > 1) {
                    let nextAction = this.actions[1];
                    if (nextAction.action == "redirect") {
                        if (request.url == nextAction.url) {
                            this.endAction();
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        this.endAction();
                        return true;
                    }

                } else {
                    this.endAction();
                    return true;
                }
            } else {
                return true;
            }

        }
    }
    endAction() {
        this.updatePopUpaction(this.counter, '✓');
        this.counter++;
        this.actions.shift();
        console.log("endaction")
        if (this.actions.length == 0) {
            mainController.stop();
            //this.clearPopUpActions()
            //alert("finish");
        } else {
            this.sendAction();
        }
    }

    updatePopUpaction(index, simbol) {
        this.popup_player = chrome.runtime.connect({ name: "popup_player" });
        this.popup_player.postMessage({ action: "updateAction", index: index, simbol: simbol });
    }
    clearPopUpActions() {
        this.popup_player = chrome.runtime.connect({ name: "popup_player" });
        this.popup_player.postMessage({ action: "clearActions" });
    }
}