var connect = chrome.extension.connect({ name: "storeEvent" });
$(document).click(function (clickEvent) {
    let tag = $(clickEvent.target).prop("tagName").toLowerCase();
    let event = {};
    event.url = document.URL;
    event.path = cssRoute(clickEvent.target);
    if (tag == 'a') {
        event.data = clickEvent.target.href
        var href = event.data
        if (href == "" || href == "#" || href == null) {
            event.action = "click";
        } else {
            if (href.startsWith("javascript")) {
                event.action = "redirect_javascript";
            } else {

                event.action = "redirect";
            }
        }
        storeEvent(event)
    }
    if (tag == 'input') {
        if (clickEvent.target.type == 'submit') {
            event.action = "submit-click";
            storeEvent(event)
        } else {
            event.action = "click";
            storeEvent(event)
        }

    }
    if (tag == 'button') {
        event.action = "click";
        storeEvent(event)
    }
    event.data = $(clickEvent.target).text();
    storeText(event)
});
$(document).submit(function (submitEvent) {
    let event = {};
    event.action = "submit";
    event.data = submitEvent.target.action
    event.url = submitEvent.target.action
    event.path = cssRoute(submitEvent.target);
    storeEvent(event)
});
$(document).on('focus click', 'input', function (focusEvent) {
    let event = {};
    event.action = "focus";
    event.data = ''
    event.url = document.URL;
    event.path = cssRoute(focusEvent.target);
    storeEvent(event)
});
$("input[type=text], input[type=password], textarea, select").on('change', function (action) {
    var event = {}
    event.path = cssRoute(this);
    event.data = this.value;
    event.action = "change";
    event.url = document.URL;
    storeEvent(event);
});
function storeEvent(event) {
    connect.postMessage(event);
}
function storeText(event) {
    event.action = 'text';
    connect.postMessage(event);
}
function cssRoute(element) {
    var ListRoutes = [];
    $(element).parents().not('html').each(function () {
        var route = this.tagName.toLowerCase();
        if (this.className) {
            route += "." + this.className.replace(/ /g, '.');
        }
        else if (this.id) {
            route += "#" + this.id;
            ListRoutes.push(route);
            return false;
        }
        ListRoutes.push(route);
    });
    return onelineCss(ListRoutes, element);
}
function onelineCss(ListRoutes, element) {
    ListRoutes.reverse();
    var path = ListRoutes.join(" ") + " " + element.tagName;
    if (element.className != "") {
        path = path + "." + element.className.replace(/ /g, ".");
    }
    if (element.id != "") {
        path = "#" + element.id;
    }
    return path;
}