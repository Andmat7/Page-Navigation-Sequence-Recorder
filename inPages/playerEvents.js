
class PlayerEvents {
    constructor() {
        chrome.runtime.onConnect.addListener(function (port) {
            debugger;
            this.port = port;
            console.assert(port.name == "player_connect");
            port.onMessage.addListener(this.listener);

        }.bind(this));
        if (this.getLastAction()) {
            var action = this.getLastAction();
            //this.port.postMessage({ ready: true });
            //chrome.runtime.sendMessage({ type: "reload_page" }, function () { });
        }
        
    }
    listener(request) {
        debugger;
        if (request.type == "action") {
            var action = request.action;
            var message = {
                action: action,
                received: false,
            }
            if (action.action == "redirect") {
                window.location.href = $(action.path).attr('href');
                message.received = true;
                this.setLastAction(action);
                port.postMessage({ ready: false });
            }
            if (action.action == "change") {
                var $input = $(action.path);
                $input.focus();
                $input.val(action.data);
                $input.change();
                port.postMessage({ ready: true });
            }
            if (action.action == "click") {
                var $input = $(action.path);
                $input.click();
                port.postMessage({ ready: true });
            }
            if (action.action == "submit") {
                var $input = $(action.path);
                $input.click();
                port.postMessage({ ready: false });

            }
            if (action.action == "text") {
                alert('text');
                port.postMessage({ ready: true });
            }
        }
    }

    setLastAction(event) {
        localStorage.setItem("LastEvent", JSON.stringify(event));
    }

    getLastAction() {
        if (localStorage.getItem("LastEvent")) {
            return JSON.parse(localStorage.getItem("LastEvent"));
        }
        return false;
    }
}
var player_events = new PlayerEvents();