class Player {
  constructor() {
    this.counter = 0;
    chrome.runtime.onConnect.addListener(
      function (player_to_back) {
        if (
          player_to_back.name == "player_to_back" &&
          mainController.state == "play"
        ) {
          player_to_back.onMessage.addListener(
            function (request) {
              console.group("ReloadPage", request);
              var isCorrect = this.checkLastAction(request);
              console.log("IsCorrect", isCorrect);
              console.groupEnd();
              if (isCorrect) {
                this.endAction();
              }
            }.bind(this)
          );
        }
      }.bind(this)
    );
  }
  playing() {
    console.clear();
    //this.closePopUp()
    var EventsController = new Events();
    this.actions = EventsController.getActions();
    this.counter = 0;
    this.sendAction();
  }
  sendAction() {
    this.updatePopUpaction(this.counter, "exec");
    let action = this.actions[0];
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs) {
        if (tabs[0]) {
          this.connectAndSend(tabs[0].id, action);
        } else {
          chrome.tabs.query(
            { active: true, lastFocusedWindow: true },
            function (tabs) {
              if (tabs[0]) {
                this.connectAndSend(tabs[0].id, action);
              } else {
                alert("bug");
              }
            }
          );
        }
      }.bind(this)
    );
  }
  connectAndSend(tabid, action) {
    var send_action = chrome.tabs.connect(tabid, { name: "send_action" });
    var Message = { action: action, type: "action", index: this.counter };
    send_action.postMessage(Message);
    console.groupCollapsed(
      this.counter +
        " " +
        action.action +
        " " +
        action.path.slice(-10) +
        " " +
        action.url.substring(0, 30)
    );
    console.group("send_action", Message);
    send_action.onMessage.addListener(
      function (request) {
        console.log("Message from page", request);
        console.groupEnd();
        if (request.ready) {
          this.endAction();
        }
      }.bind(this)
    );
  }
  checkLastAction(request) {
    if (request.ready) {
      if (this.actions) {
        if (this.actions.length > 1) {
          let nextAction = this.actions[1];
          console.log("CheckLastAction", nextAction, request);
          console.log(
            "equals ",
            request.url.split(/[?#]/)[0] == nextAction.url.split(/[?#]/)[0]
          );
          if (nextAction.action == "redirect_javascript") {
            return true;
          } else {
            // get url without get params
            if (
              request.url.split(/[?#]/)[0] == nextAction.url.split(/[?#]/)[0]
            ) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }
  endAction() {
    this.updatePopUpaction(this.counter, "✓");
    this.counter++;
    this.actions.shift();
    console.log("f endaction");
    console.groupEnd();
    if (this.actions.length == 0) {
      mainController.stop();
      //alert("finish");
    } else {
      this.sendAction();
    }
  }

  updatePopUpaction(index, simbol) {
    this.popup_player = chrome.runtime.connect({ name: "popup_player" });
    this.popup_player.postMessage({
      action: "updateAction",
      index: index,
      simbol: simbol,
    });
  }
  clearPopUpActions() {
    this.popup_player = chrome.runtime.connect({ name: "popup_player" });
    this.popup_player.postMessage({ action: "clearActions" });
  }
  closePopUp() {
    this.popup_player = chrome.runtime.connect({ name: "popup_player" });
    this.popup_player.postMessage({ action: "closePopUp" });
  }
}
