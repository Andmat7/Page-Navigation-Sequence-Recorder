class MainController {
    constructor() {
      this.enableRecord = false;
      this.state = "nothing";
    }
    stop() {
      this.enableRecord = false;
      chrome.browserAction.setBadgeText({ "text": "" });
      var back = chrome.extension.getBackgroundPage();
    }
    play() {
        player.playing();
        this.state = "play";
        chrome.browserAction.setBadgeText({ "text": "Play" });
    }
    record() {
        //RecordOptions.enableRecord = true;
        this.state = "record";
        chrome.browserAction.setBadgeText({ "text": "rec" });
    }
}