var cookie = {
	set: function(key, value, days) {
		document.cookie = 'clear_' + key + '=' + value + '; expires=' +
			(new Date(new Date().getTime() + ((days ? days : 14) * 86400000))).toUTCString() + '; path=/';
	},

	get: function(key) {
		var r = ('; ' + document.cookie + ';').match('; clear_' + key + '=(.*?);');
		return r ? r[1] : null;
	},

	unset: function(key) {
		document.cookie = 'clear_' + key + '=; expires=' +
			(new Date(1)).toUTCString() + '; path=/';
	}
};

var doc = {
	W: function(d) { document.write(d); },
	C: function(e) { return document.createElement(e); },
	E: function(e) { return (typeof(e) == 'string') ? document.getElementById(e) : e; },
	N: function(e) { return (typeof(e) == 'string') ? document.getElementsByName(e) : e; },
	assign: function(id, htm) { this.E(id).innerHTML = (typeof(htm)!="undefined"?htm:""); }
};

var finder = {
	F_TR: function(e)
	{
		return elem.findElem(e, 'TR');	
	},
	
	F_TABLE: function(e)
	{
		return elem.findElem(e, 'TABLE').gridObj;
	}	
};

var _winHeight=-1; 
function MainTblHeightResize() {
    // Workaround multiple resize event in IE
    if (window._winHeight == $(window).height()) 
        return;
    window._winHeight = $(window).height();
	
    var h;
    if ($.browser.msie) {
        h = document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
    } else {
        h = self.innerHeight;
    }

    if (h < 600) h=600;
    $("#maintbl").height(h);
    if ($.browser.msie) {
        var diff = doc.E("maintbl").clientHeight - h;
        if (diff > 0) {
            $("#maintbl").height(h - diff);
        }
    }
}

function browser_workaround() {
	// Fix background PNGs in IE6
	if (navigator.appVersion.match(/MSIE [0-6]\./)) {
		$('.png').each(function () {
			if (this.currentStyle.backgroundImage != 'none') {
				var image = this.currentStyle.backgroundImage;
				image = this.currentStyle.backgroundImage.substring(5, image.length - 2);
				$(this).css({
				  'backgroundImage': 'none',
				  'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
				});
			}
		});
	}
}

function append_sid_to_url(url) 
{
	if (typeof(top.window.sidKey) != "undefined" && top.window.sidKey != "") {
		url += (url.indexOf("?")>0 ? "&":"?");
		url += "SID="+top.window.sidKey;
	}
	return url;
}

function link_to(url)
{
	window.location = append_sid_to_url(url);
}

function field_is_checked(field_id)
{
	return (doc.E(field_id).className.indexOf("checked") >= 0);
}

function set_field_checked(field_id, checked)
{
	if (field_is_checked(field_id) && !checked) {
		doc.E(field_id).className = doc.E(field_id).className.replace(/\s*checked/, "");
	} else if (!field_is_checked(field_id) && checked) {
		doc.E(field_id).className += " checked";
	}
}

function GetScript(url, errTolarence)
{
	jStats={};
	$.ajax({
	  url: url,
	  dataType: 'script',
	  success: function() {
		refresh();
		jStats=null;
	  },
	  error: function() {
		if (errTolarence > 0) {
			setTimeout("GetScript('" + url + "'," + (errTolarence-1) + ")",1000);
		}
	  },
	  timeout:1000
	});
}

function SendPostRequest(url, data)
{
	var retVal = false;
	jStats={};
	$.ajax({
		type: 'POST',
		async: false,
		cache: false,	  
		url: url,
		data: data,
		success:function(data, txtStats) {
			retVal = data;
    	},
		timeout:1000
	});
	return retVal;
}

function SendGetRequest(url, data)
{
	var retVal = false;
	$.ajax({
		type: 'GET',
		async: false,
		cache: false,	  
		url: url,
		data: data,
		success:function(data, txtStats) {
			retVal = true;
    	},
		timeout:1000
	});
	return retVal;
}

function zeroPad(num, digits)
{
	var retNum = num + "";
	while (retNum.length < digits)
		retNum = "0" + retNum;
	return retNum;
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return "";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)));
    return Math.round(bytes / Math.pow(1000, i)*100)/100 + ' ' + sizes[i];
};

function request(paras){
	var url = location.href;
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
	var paraObj = {}
	for (i=0; j=paraString[i]; i++){
		paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
	}
	var returnValue = paraObj[paras.toLowerCase()];
	if(typeof(returnValue)=="undefined"){
		return "";
	}
	return returnValue;
}

////////////////////////////////////////////////
// Web Usr Key
////////////////////////////////////////////////
var gWebCfgAry = new Array();

var WEB_CONFIG_INDEX =[
"show_conn_tmr",
"msg_mode"
];

function init_web_conf(webCfg) 
{
	gWebCfgAry = webCfg.split(";");
}

function read_web_conf(keyStr)
{
	for (idx in WEB_CONFIG_INDEX) {
		if (WEB_CONFIG_INDEX[idx] == keyStr) {
			if (undefined == gWebCfgAry[idx]) {
				return "";
			} else {
				return gWebCfgAry[idx];
			}
		}
	}

	return "";
}

function set_web_conf()
{
	var retVal = false;

	$.ajax({
		async: false,
		cache: false,
		url: "/set_usrkey.cgi",
		type: "GET",
		data: { REDIRECT:"/", FRM_D2:"WEB_CLEAR_CFG", FRM_D1:gWebCfgAry.join(";") },
		success:function(text) {
			retVal = true;
    	},
		timeout:10000
	}); 

	return retVal;
}

function write_web_conf(keyStr, valStr)
{
	var isFound = false;
	
	for (idx in WEB_CONFIG_INDEX) {
		if (WEB_CONFIG_INDEX[idx] == keyStr) {
			gWebCfgAry[idx] = valStr;
			isFound = true;
			break;
		}
	}
	
	if (isFound) {
		return set_web_conf();
	}
	
	return false;
}

init_web_conf("<@ GetUsrKeyValue WEB_CLEAR_CFG @>");


function get_checked_radio(radioObj) {
	if(!radioObj)
		return "";
	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}

function set_checked_radio(radioObj, newValue) {
	if(!radioObj)
		return;
	var radioLength = radioObj.length;
	if(radioLength == undefined) {
		radioObj.checked = (radioObj.value == newValue.toString());
		return;
	}
	for(var i = 0; i < radioLength; i++) {
		radioObj[i].checked = false;
		if(radioObj[i].value == newValue.toString()) {
			radioObj[i].checked = true;
		}
	}
}

function is_defined(obj) {
	return (typeof(obj) != "undefined");
}