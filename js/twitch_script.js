var rawData = null;
var channelLink = "http://player.twitch.tv/?channel=";
var urlAux = "";
var searchLink = "https://api.twitch.tv/kraken/search/streams";
var clientID = "q9k2mh6i7wxofogt73wr69eihx41ft7";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  console.log("readystatechange");
  console.log("status:" + this.status);
  console.log("readyState:" + this.readyState);
  if (this.readyState === 4 && this.status==200) {
    console.log(this.responseText);
	rawData = this.responseText;
	consumeResult(rawData);
  }
});

function consumeResult(rawData){
	var result = "";
	//var status = document.getElementById('txtStatus');
	//status.value = rawData;
	
	var data = null;
	if(rawData != ''){
		data = JSON.parse(rawData);
		
		var divRec = document.getElementById('divRecords');
		var total = Number(data['_total']);
		if(total == 0){
			result = "<br><br><h4 id=\"divResultsHeader\" class=\"alert alert-info col-md-4\"><strong>Info!</strong> Records NOT found!</h4>";			
		}else{
		
			var strAux = "";		
			var channelPreviewLink = "";
			var numViewers = "";
			var numViews = "";
			var channelDisplayName = "";
			var channelName = "";
			var channelUpdateDate = "";
			var channelStatus = "";
			
			for (var i = 0; i < data.streams.length; i++)
			{
				channelPreviewLink = data.streams[i]['preview']['small'];
				numViewers = data.streams[i]['viewers'];
				numViews = data.streams[i]['channel']['views'];
				channelName = data.streams[i]['channel']['name'];
				channelDisplayName = data.streams[i]['channel']['display_name'];
				channelUpdateDate = data.streams[i]['channel']['updated_at'].replace('T',' ').replace('Z','');
				channelStatus = data.streams[i]['channel']['status'];
				if(channelStatus.length > 80){
					channelStatus = channelStatus.substring(1,80) + " [...]";
				}
				
				strAux = 	"	<a href=\"#myModal\" class=\"list-group-item col-md-5\" style=\"height:180px\" data-toggle=\"modal\" onclick=\"javascript:openSelectedChannel('" + channelName + "','" + channelDisplayName + "','" + channelStatus + "')\">" +
							"		<div class=\"container\">" +
							"		<div class=\"col-sm-1\"><small><strong>Viewers:</strong><br>" + numViewers +"</small></div><img src=\"" + channelPreviewLink + "\" class=\"img-thumbnail\" alt=\"" + channelDisplayName + "\" >"+
							"		<small><small><h4 style=\"color:blue\">" + channelDisplayName + "</h4>" +
							"		<p><strong>Updated:</strong> " + channelUpdateDate + "</p>" +
							"		<p style=\"max-width:190px\">" + channelStatus + "</p></small></small>" +
							"		</div>" +
							"	</a>"
							;
				
				result += strAux;
			//	status.value += strAux;
			}
			result = "<br><br><div class=\"list-group row\" style=\"max-width:700px\">" +
					 result +
					 "</div>";
		}
		
		divRec.innerHTML = result;
		document.getElementById('loader').style.display = "none";
	}
}
function searchTwitchStreams(){
	document.getElementById('divRecords').innerHTML = "";
	//document.getElementById('txtStatus').value = "";
	
	console.log("searchTwitchStreams()");
	var search = document.getElementById('txtSearch').value;
	
	console.log("search:" + search);
	if(search != ''){
		document.getElementById('loader').style.display = "block";
	
		var link = "";
		link = searchLink;
		link += '?q=' + encodeURI(search);
		
		console.log("link:" + link);

		xhr.open("GET", link);
		xhr.setRequestHeader("Client-ID", clientID);
		xhr.send(rawData);
	}
}

function openSelectedChannel(channelName, channelDisplayName, channelStatus){
	urlAux = channelLink + channelName;
	console.log("urlAux:" + urlAux);
	
	var el = document.getElementById('lblStreamDisplayName');
	el.innerHTML = channelDisplayName;
	document.getElementById('lblStatus').innerHTML = channelStatus;
	document.getElementById('lblChannelName').innerHTML = channelName;
}

function clearChannelName(){
	document.getElementById('lblChannelName').innerHTML = "";
}
