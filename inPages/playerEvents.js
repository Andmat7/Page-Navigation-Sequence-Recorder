class PlayerEvents {
    constructor() {
        chrome.runtime.onConnect.addListener(function (send_action) {
            this.port = send_action;
            if (send_action.name == "send_action") {
                send_action.onMessage.addListener(this.receivingRequest.bind(this));
            }
        }.bind(this));
        var message = { ready: true, url: document.URL };
        var player_to_back = chrome.runtime.connect({ name: "player_to_back" });
        console.group("Reload Page", document.URL)
        player_to_back.postMessage(message);
        console.groupEnd();

    }
    receivingRequest(request) {
        var action = request.action;
        console.groupCollapsed(request.index + " " + action.action + " " + action.path.slice(-10) + " " + action.url.substring(0, 30) + " " + document.URL.substring(0, 30));
        console.log(" received action", request);
        let equalUrl = (action.url.split(/[?#]/)[0] == document.URL.split(/[?#]/)[0])
        if (request.type == "action" && equalUrl) {
            this.execute(action);
        }
        console.groupEnd();
    }
    execute(action) {
        var message = {
            action: action,
            received: false,
        }
        if (action.action == "redirect") {
            this.endExecution({ ready: false });
            window.location.href = $(action.path).attr('href');
            return true
        }
        if (action.action == "redirect_javascript") {
            this.endExecution({ ready: false });
            window.location.href = $(action.path).attr('href');
            return true
        }
        if (action.action == "change") {
            var $input = $(action.path);
            if (action.data == "java") {
                debugger;
            }
            $input.focus();
            $input.val(action.data);
            $input.change();
            this.endExecution({ ready: true });
        }
        if (action.action == "click") {
            var $input = $(action.path);
            $input.click();
            this.endExecution({ ready: true });

        }
        if (action.action == "submit") {
            var $input = $(action.path);
            $input.click();
            this.endExecution({ ready: true });

        }
        if (action.action == "text") {
            alert('text');
            this.endExecution({ ready: true });
        }
    }
    endExecution(message) {
        this.port.postMessage(message);
        return true
    }

}
var player_events = new PlayerEvents();