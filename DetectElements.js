var connect = chrome.extension.connect({name: "storeEvent"});
$('a').on('click', function(action){
    var aLink = this;
    var href=aLink.href;
    var event={}
    event.path=cssRoute(aLink);
    if ( href=="" || href=="#" || href==null ) {
        event.action="click";
    }else{
        event.action="redirect";
    }
    storeEvent(event)
})
function storeEvent(event){
	connect.postMessage(event);
}

function cssRoute(element) {
	var ListRoutes = [];
    $(element).parents().not('html').each(function() {
        var route = this.tagName.toLowerCase();
        if (this.className) {
            route += "." + this.className.replace(/ /g, '.');
        }
        else if(this.id) {
        	route += "#"+this.id;
        	ListRoutes.push(route);
        	return false;
        }
        ListRoutes.push(route);
    });
    return onelineCss(ListRoutes, element);
}
function onelineCss(ListRoutes, element) {
	ListRoutes.reverse();
    var path = ListRoutes.join(" ")+" "+element.tagName;  
    if(element.className!="") { 
    	path = path+"."+element.className.replace(/ /g, ".");
    }
    if(element.id!="") {
    	path = "#"+element.id;
    }
    return path;
}