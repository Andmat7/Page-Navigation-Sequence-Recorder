class MainController {
    constructor() {
        this.enableRecord = false;
        this.recordingText = false;
    }
    stop() {
        this.enableRecord = false;
        this.recordingText = false;
        this.state = null;
        chrome.browserAction.setBadgeText({ "text": "" });
        var back = chrome.extension.getBackgroundPage();
    }
    play() {
        chrome.browserAction.setBadgeText({ "text": "Play" });
        player.playing();
        this.state = "play";   
    }
    record() {
        this.state = "record";
        events.saveURL();
        chrome.browserAction.setBadgeText({ "text": "rec" });
    }
    detectText() {
        this.state = "text";
        chrome.browserAction.setBadgeText({ "text": "text" });
    }
    send() {
        
        var xhr = new XMLHttpRequest();
        var url = "http://idolearning.test";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
            }
        };
        let project = events.getActualProject();
        xhr.send(JSON.stringify(project));
    }
}