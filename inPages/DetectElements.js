window.browser = (function () {
    return window.msBrowser ||
      window.browser ||
      window.chrome;
  })();
var connect = browser.runtime.connect({ name: "storeEvent" });
$(document).click(function (clickEvent) {
    let tag = $(clickEvent.target).prop("tagName").toLowerCase();
    let event = {};
    event.url = document.URL;
    event.path = cssRoute(clickEvent.target);
    event.domPath = getDomPath(clickEvent.target);
    if (tag == 'a') {
    }else{
        if (tag == 'input') {
            if (clickEvent.target.type == 'submit') {
                event.action = "submit-click";
                storeEvent(event)
            } else {
                event.action = "click";
            }

        }else{
            event.action = "click";
            storeEvent(event)
        }
    }

    event.data = $(clickEvent.target).text();
    storeText(event)
 });
document.body.addEventListener('click', function (ClickEvent) {
    let event = {};
    let tag = ClickEvent.target.nodeName.toLowerCase();
    event.url = document.URL;
    event.path = cssRoute(ClickEvent.target);
    event.domPath = getDomPath(ClickEvent.target);
    if (tag == 'a') {
        event.data = ClickEvent.target.href
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

}, true);
$(document).submit(function (submitEvent) {
    let event = {};
    event.action = "submit";
    event.data = submitEvent.target.action
    event.url = submitEvent.target.action
    event.path = cssRoute(submitEvent.target);
    storeEvent(event)
});
document.body.addEventListener('change', function (changeEvent) {
    var event = {}
    event.path = cssRoute(changeEvent.target);
    event.domPath = getDomPath(changeEvent.target);
    event.data = changeEvent.target.value;
    event.action = "change";
    event.url = document.URL;
    storeEvent(event);
})
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
        if (this.className && (typeof element.className === 'string' || element.className instanceof String)) {
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
    if (element.className != "" && (typeof element.className === 'string' || element.className instanceof String)) {
        path = path + "." + element.className.replace(/ /g, ".");
    }
    if (element.id != "") {
        path = "#" + element.id;
    }
    return path;
}
function getDomPath(element) {
    var stack = [];
    while (element.parentNode != null) {
        var sibCount = 0;
        var sibIndex = 0;
        for (var i = 0; i < element.parentNode.childNodes.length; i++) {
            var sib = element.parentNode.childNodes[i];
            if (sib.nodeName == element.nodeName) {
                if (sib === element) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        if (element.hasAttribute('id') && element.id != '') {
            stack.unshift(element.nodeName.toLowerCase() + '#' + element.id);
        } else if (sibCount > 1) {
            stack.unshift(element.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
        } else {
            stack.unshift(element.nodeName.toLowerCase());
        }
        element = element.parentNode;
    }

    return stack.slice(1).join(' > '); // removes the html element
}