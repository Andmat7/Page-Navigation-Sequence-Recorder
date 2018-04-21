var player = new Player();
var events = new Events();
var mainController = new MainController();
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name == "storeEvent") {
    port.onMessage.addListener(function (event) {
      events.storeEvent(event)
      port.postMessage("reloadTable");
    });
  }
});

