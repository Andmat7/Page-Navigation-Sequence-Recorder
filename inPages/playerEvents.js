class PlayerEvents {
    constructor() {
        chrome.runtime.onConnect.addListener(function (send_action) {
            this.port = send_action;
            console.assert(send_action.name == "send_action");
            //console.log({ send_action_addListener: send_action })
            if (send_action.name == "send_action") {
                send_action.onMessage.addListener(this.listener.bind(this));
            }
        }
            .bind(this));
        var message = { ready: true, url: document.URL };
        var player_to_back = chrome.runtime.connect({ name: "player_to_back" });
        player_to_back.postMessage(message);
        console.log(document.URL)

    }
    listener(request) {
        console.log({ send_action_onMessage: request.action })
        if (request.type == "action") {
            var action = request.action;
            var message = {
                action: action,
                received: false,
            }
            if (action.action == "redirect") {
                //this.setLastAction(action);
                console.log({ send_action_postMessage: { ready: false } })
                this.port.postMessage({ ready: false });
                window.location.href = $(action.path).attr('href');
                return true
            }
            if (action.action == "redirect_javascript") {
                //this.setLastAction(action);
                console.log({ send_action_postMessage: { ready: false } })
                this.port.postMessage({ ready: false });
                window.location.href = $(action.path).attr('href');
                return true
            }
            if (action.action == "change") {
                var $input = $(action.path);
                $input.focus();
                $input.val(action.data);
                $input.change();
                this.port.postMessage({ ready: true });
            }
            if (action.action == "click") {
                var $input = $(action.path);
                $input.click();
                this.port.postMessage({ ready: true });
                return true
            }
            if (action.action == "submit") {
                var $input = $(action.path);
                $input.click();
                this.port.postMessage({ ready: false });

            }
            if (action.action == "text") {
                alert('text');
                this.port.postMessage({ ready: true });
            }
        }
    }

}
var player_events = new PlayerEvents();