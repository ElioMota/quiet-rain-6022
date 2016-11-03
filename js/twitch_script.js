var rawData = null;
var channelLink = "http://player.twitch.tv/?channel=";
var urlAux = "";
var searchLink = "https://api.twitch.tv/kraken/search/streams";
var clientID = "q9k2mh6i7wxofogt73wr69eihx41ft7";
var origin = "http://localhost/";

var xmlhttp;
function loadXMLDoc(url, onready, onerror){
	console.log("loadXMLDoc: ini")
   if (window.XMLHttpRequest){ // code for IE7+, Firefox, Chrome, Opera, Safari, etc.
	
	  console.log("loadXMLDoc: MOZILLA etc")
      xmlhttp = new XMLHttpRequest();
      xmlhttp.withCredentials = false;
	  
	  xmlhttp.onreadystatechange = onready;
	  xmlhttp.onerror = onerror;
	  
      xmlhttp.open("GET",url,true);
	  xmlhttp.setRequestHeader("Client-ID", clientID);
	  //xmlhttp.setRequestHeader("crossDomain", true);
	  //xmlhttp.setRequestHeader("permissions", "http://www.google.com");
	  //xmlhttp.setRequestHeader("Origin", origin);
	  
      xmlhttp.send(null);
   }else if (window.ActiveXObject){ //  code for IE6, IE5
	  console.log("loadXMLDoc: IE5_6")
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
      if (xmlhttp){
		xmlhttp.withCredentials = false;
	  
        xmlhttp.onreadystatechange = onready;
		xmlhttp.onerror = onerror;
        xmlhttp.open("GET",url,true);
		xmlhttp.setRequestHeader("Client-ID", clientID);
		//xmlhttp.setRequestHeader("crossDomain", true);
		//xmlhttp.setRequestHeader("permissions", "http://www.google.com");
		
        xmlhttp.send();
      }
   }
   console.log("loadXMLDoc: end")
}

function consumeResult(rawData){
	var result = "";
	
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
	
	console.log("searchTwitchStreams()");
	var search = document.getElementById('txtSearch').value;
	
	console.log("search:" + search);
	if(search != ''){
		document.getElementById('loader').style.display = "block";
	
		var link = "";
		link = searchLink;
		link += '?q=' + encodeURI(search);
		
		console.log("link:" + link);

		loadXMLDoc(link, xmlhttpOK, xmlhttpError);
		
		console.log("end searchTwitchStreams");

	}
}
function xmlhttpOK(){
  if (xmlhttp.readyState === 4 && xmlhttp.status==200) {
    console.log(xmlhttp.responseText);
	rawData = xmlhttp.responseText;
	consumeResult(rawData);
  }	
}
function xmlhttpError(){
	console.log("tratar erro: xmlhttpError");	
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
