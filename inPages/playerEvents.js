chrome.runtime.sendMessage({type: "onStart"}, function(response) {});
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == "action") {
            var action=request.action;
            window.location.href = $(action.path).attr('href');
            sendResponse({ farewell: "goodbye" });
        }
    }
);