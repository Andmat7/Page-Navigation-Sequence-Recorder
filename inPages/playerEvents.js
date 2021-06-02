class PlayerEvents {
  constructor() {
    chrome.runtime.onConnect.addListener(
      function (send_action) {
        this.port = send_action;
        if (send_action.name == "send_action") {
          send_action.onMessage.addListener(this.receivingRequest.bind(this));
        }
      }.bind(this)
    );
    var message = { ready: true, url: document.URL };
    var player_to_back = chrome.runtime.connect({ name: "player_to_back" });
    console.group("Reload Page", document.URL);
    player_to_back.postMessage(message);
    console.groupEnd();
  }
  receivingRequest(request) {
    var action = request.action;
    console.groupCollapsed(
      request.index +
        " " +
        action.action +
        " " +
        action.path.slice(-10) +
        " " +
        action.url.substring(0, 30) +
        " " +
        document.URL.substring(0, 30)
    );
    console.log(" received action", request);

    let equalUrl = action.url.split(/[?#]/)[0] == document.URL.split(/[?#]/)[0];
    console.log("verify equal", equalUrl);
    if (request.type == "action" && equalUrl) {
      this.execute(action);
    } else {
    }
    console.groupEnd();
  }
  execute(action) {
    var message = {
      action: action,
      received: false,
    };
    if (action.action == "redirect") {
      this.endExecution({ ready: false });
      window.location.href = $(action.path).attr("href");
      return true;
    }
    if (action.action == "redirect_javascript") {
      this.endExecution({ ready: false });
      window.location.href = $(action.path).attr("href");
      return true;
    }
    if (action.action == "change") {
      var $input = $(action.path);
      var ready = false;
      if ($input.length > 0) {
        ready = true;
        $input.focus();
        $input.val(action.data);
        $input.change();
      } else {
        var newPath = this.simplyPath(action.path);
        $input = $(newPath);
      }
      if ($input.length > 0) {
        ready = true;
        $input.focus();
        $input.val(action.data);
        $input.change();
      }
      this.endExecution({ ready: ready });
    }
    if (action.action == "focus") {
      var $input = $(action.path);
      if ($input.length > 0) {
        setTimeout(
          function () {
            console.log("set");
            $input.triggerHandler("focus");
            this.endExecution(
              {
                ready: true,
              },
              500
            );
          }.bind(this)
        );
      }
    }
    if (action.action == "click") {
      var $input = $(action.path);
      var ready;
      if ($input.length > 0) {
        $input.click();
        ready = true;
      } else {
        var newPath = this.simplyPath(action.path);
        $input = $(newPath);
        if ($input.length > 0) {
          $input.click();
          ready = true;
        } else {
          ready = false;
        }
      }

      this.endExecution({ ready: ready });
    }
    if (action.action == "submit-click") {
      var $input = $(action.path);
      $input.click();
      this.endExecution({ ready: false });
    }
    if (action.action == "text") {
      var $input = $(action.path);
      var ready = false;
      if ($input.length > 0 && action.data == $input.text()) {
        ready = true;
      }

      this.endExecution({ ready: true });
    }
  }
  endExecution(message) {
    message.url = document.URL;
    console.log("endExecution", message);
    this.port.postMessage(message);
    return true;
  }
  simplyPath(path) {
    var newPath = "";
    var cssClasses = path.split(" ");
    cssClasses.forEach(function (cssClass, index, arr) {
      var newClass = cssClass.split(".");
      if (index == arr.length - 1) {
        newPath = newPath + " " + cssClass;
      } else {
        newPath = newPath + " " + newClass[0];
      }
    });
    console.log(newPath);
    return newPath;
  }
}
var player_events = new PlayerEvents();
