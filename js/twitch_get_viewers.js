var rawDataViews = null;
var channelName = null; //"bPartGaming";
var channelLink = "https://api.twitch.tv/kraken/channels/";
var clientID = "q9k2mh6i7wxofogt73wr69eihx41ft7";

var xhrViews = new XMLHttpRequest();
xhrViews.withCredentials = false;

xhrViews.addEventListener("readystatechange", function () {
  if (this.readyState === 4 && this.status==200) {
	rawDataViews = this.responseText;
	consumeResult(rawDataViews);
  }
});

function consumeResult(rawDataViews){
	var data = "";
	if(rawDataViews != ""){
		data = JSON.parse(rawDataViews);
		
		document.getElementById('lblNumViews').innerHTML = "<strong>Views:</strong> " + Number(data['views']+"");
	}
}
function getTwitchChannel(){
	var aux = window.parent.document.getElementById('lblChannelName');
	if(aux != null && aux.innerHTML != ""){
		channelName = aux.innerHTML;
		
		var link = "";
		link = channelLink;
		link += channelName;
		
		console.log("getTwitchChannel link:" + link);

		xhrViews.open("GET", link);
		xhrViews.setRequestHeader("Client-ID", clientID);
		xhrViews.send(rawDataViews);	
	}
}
