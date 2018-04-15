chrome.runtime.sendMessage({type: "onStart"}, function(response) {});
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == "action") {
            
            var action=request.action;
            if (action.action=="redirect") {
                window.location.href = $(action.path).attr('href');
                sendResponse({ ready: false });
                return true;
            }
            if (action.action=="change") {
                var $input=$(action.path);
                $input.focus();
                $input.val(action.data);
                $input.change();
                sendResponse({ ready: true });
                return true;
            }
        }
    }
);