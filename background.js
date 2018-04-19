var player = new Player();
var mainController = new MainController();
var events = new Events();

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name == "storeEvent") {
    port.onMessage.addListener(function (event) {
      events.storeEvent(event)
      port.postMessage("reloadTable");
    });
  }
});

