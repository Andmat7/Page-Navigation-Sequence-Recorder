class MainController {
    constructor() {
      this.enableRecord = false;
      this.recordingText = false;
    }
    stop() {
      this.enableRecord = false;
      this.recordingText = false;
      this.state =null;
      chrome.browserAction.setBadgeText({ "text": "" });
      var back = chrome.extension.getBackgroundPage();
    }
    play() {
        player.playing();
        this.state = "play";
        chrome.browserAction.setBadgeText({ "text": "Play" });
    }
    record() {
        this.state = "record";
        events.saveURL();
        chrome.browserAction.setBadgeText({ "text": "rec" });
    }
    detectText(){
        this.state = "text";
        chrome.browserAction.setBadgeText({ "text": "text" });
    }
}