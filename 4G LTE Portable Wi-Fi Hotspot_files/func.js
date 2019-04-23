
function setElementValue(name, value) {
    var obj = $("#" + name);
    if (obj.is("select")) {
        obj.val(value);
    } else if (obj.is("input:checkbox")) {
        obj.attr("checked", (value == "1") ? true : false);
    } else if (obj.is("input:radio")) {
        $("input[name="+name+"]").each( function() { 
            this.checked = (value == this.value);
        });
    } else if (obj.is("input")) {
        obj.attr("value", value);
    } else {
		var tmp = obj.get(0);
		var tagName;
		if(tmp != null){
           tagName = obj.get(0).tagName ;
        }
        if (tagName == "div");{
            obj.html(value);
        }
    }
}

function getElementValue(name, value) {
    var obj = $("#" + name);
        
    if (obj.is("select")) {
        return obj[0].value;
    } else if (obj.is("input:password")) {
        return obj.attr("value");
    } else if (obj.is("input:checkbox")) {
        return obj.attr("checked") ? "1" : "0";
    } else if (obj.is("input:radio")) {
        return $("input[name="+name+"]:checked").val();
    } else if (obj.is("input")) {
        return obj.attr("value");
    }
    return ""
}

function showMssageBox(name, msg) {
  var txt = window.lang.convert(msg, top.default_lang);    
  $("#"+name).html("<p lang='en'>"+txt+"</p>" + '<p><input lang="en" type="button" value="OK" class="button" onclick="$.colorbox.close()"/></p>');
  $.colorbox({inline:true, width:'60%', scrolling:false, overlayClose:false, opacity:0.4, href:'#'+name});
}

function showSplashWindow(msg) {
  var txt = window.lang.convert(msg, top.default_lang);
  $("#inline_msgbox").html("<p lang='en'>"+txt +"</p>");
  $.colorbox({inline:true, width:'60%', scrolling:false, overlayClose:false, opacity:0.4, href:'#inline_msgbox'});
  var mQueryTimer = setTimeout(function() {  $.colorbox.close(); }, (1* 1000));

}

function showDialog(name) {
  $.colorbox({inline:true, width:'60%', scrolling:false, overlayClose:false, opacity:0.4, href:'#'+name});
}

function showDialogEx(name, _width, _height) {
  $.colorbox({inline:true, width:_width, height:_height, scrolling:false, overlayClose:false, opacity:0.4, href:'#'+name});
}

function showDialogLogin(name, _width, _height) {  
  $.colorbox({inline:true, width:_width, height:_height, scrolling:false, overlayClose:false, opacity:0.4, href:'#'+name,onComplete:function() {$("#msl_login").focus();}});
}

function showDialogPinCode(name, _width, _height) {  
  $.colorbox({inline:true, width:_width, height:_height, scrolling:false, overlayClose:false, opacity:0.4, href:'#'+name, escKey:false,onComplete:function() {$("#msg_pincode").focus();}});
}

function showDialogPukCodeMain(name, _width, _height) {  
  $.colorbox({inline:true, width:_width, height:_height, scrolling:false, overlayClose:false, opacity:0.4, href:'#'+name,escKey:false, onComplete:function() {$("#main_puk_code").focus();}});
}
function showDialogPinCodeMain(name, _width, _height) {  
  $.colorbox({inline:true, width:_width, height:_height, scrolling:false, overlayClose:false, opacity:0.4, href:'#'+name,escKey:false, onComplete:function() {$("#main_pin_code").focus();}});
}

function showDialogPinBlock(name, _width, _height) {  
  $.colorbox({inline:true, width:_width, height:_height, scrolling:false, overlayClose:false, opacity:0.4, href:'#'+name,escKey:false});
}

function showDeviceResetDlg() {
  $.colorbox({width:"550", height:"230", overlayClose:false, opacity:0.4, iframe:true, href:"cdma_reset.asp"});
}

function showDsaResetDlg() {
  $.colorbox({width:"550", height:"230", overlayClose:false, opacity:0.4, iframe:true, href:"dsa_reset.asp"});
}

function showUpgradeDlg() {
  $.colorbox({width:"550", height:"240", overlayClose:false, opacity:0.4, iframe:true, href:"upgrade.htm"});
}

function getField() {
	var url_path = location.search;
	var field = "";
  
	if (url_path != "") {
	  url_path=url_path.substring(1);
		arg=url_path.split("&");
		for (var i=0 ; i<arg.length ; ++i) {
		  f=arg[i].split("=");
		  if (f[0] == "field") {
  		  field = f[1];
		  }
		}
	}
	
  return field;
}

function checkLoginResult() {
    var showFlag = '0';
    var _url = top.window.location.href;
    var u = _url.split('err=');
    if (u[1]!=null) {
        var v = u[1].split("&");
        showFlag = v[0];
    }
    if (showFlag == 1) {
        return "Your session may expired.<br>Please login again.";
    } else if (showFlag == 2 || showFlag == 3) {
        return "Sorry, the Administrator password is incorrect.<br>Please try again.";
    } else if (showFlag == 4) {
        return "Sorry, the web site is busy.<br>Please try again later.";
    } else if (showFlag == 5) {
        return "Sorry, there is already an online administrator.";
    } else if (showFlag == 6) {
        return "You have no authority, please login as an administrator.";
    } else if (showFlag == 7) {
        return "Sorry, there is already an online user from CLI.";
    }
    return "";
}

function moveScrollToField(name) {
    var obj=$("#"+name);
    if (obj) {
      obj.next().toggle("fast");
      var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
		      $body.animate({
			    scrollTop: (obj.offset().top-5)
		  }, 600);
    }
}
function hex2str(hex){
    var r="";
    var e=hex.length;
    var s;
    while(e>0){
        s=e-2;
        r=String.fromCharCode("0x"+hex.substring(s,e))+r;
        e=s;
    }
    return r;
}

function str2hex(str){
    var r="";
    var e=str.length;
    var c=0;
    var h;
    while(c<e){
        h=str.charCodeAt(c++).toString(16);
        while(h.length<2) h="0"+h;
        r+=h;
    }
    return r;
}

function isValidHex(str){
    var e=str.length;
    var c=0;
    var x;
    var hex_allow = "abcdefABCDEF0123456789";
    var r=0;

    for(var c=0; c<str.length;c++){
		x = str.substr(c,1);
	if (hex_allow.indexOf(x) == -1)
		r++;
    }
    return r;
}

function isValidAddr(str){
    var e=str.length;
    var c=0;
    var x;
    var hex_allow = "0123456789";
    var r=0;
	var nValue;

	if(str.length == 0)
			return 1;

    for(var c=0; c<str.length;c++){
		x = str.substr(c,1);
		if (hex_allow.indexOf(x) == -1)
			r++;
    }
	if(r == 0)
	{
		nValue = parseInt(str);
		if((nValue < 0) || (nValue >= 256))
			r++;
	}
    return r;
}

function isValidPort(str){
    var e=str.length;
    var c=0;
    var x;
    var hex_allow = "0123456789";
    var r=0;
	var nValue;

	if(str.length == 0)
			return 1;

    for(var c=0; c<str.length;c++){
		x = str.substr(c,1);
		if (hex_allow.indexOf(x) == -1)
			r++;
    }
	if(r == 0)
	{
		nValue = parseInt(str);
		if((nValue <= 0) || (nValue > 65535))
			r++;
	}
    return r;
}


function isInvalidStr(deny_str, str){
    var e=str.length;
    var c=0;
    var x;
    var r=0;
	var nValue;

    for(var c=0; c<str.length;c++){
		x = str.substr(c,1);
		if (deny_str.indexOf(x) != -1)
			r++;
    }

    return r;
}

function charByteSize(ch) {
	if (ch == null || ch.length == 0) {
		return 0;
	}

	var charCode = ch.charCodeAt(0);

	if (charCode <= 0x00007F) {
		return 1;
	} else if (charCode <= 0x0007FF) {
		return 2;
	} else if (charCode <= 0x00FFFF) {
		return 3;
	} else {
		return 4;
	}
}

function stringByteSize(str) {
	if (str == null || str.length == 0) {
		return 0;
	}

	var size = 0;
	for (var i = 0; i < str.length; i++) {
		size += charByteSize(str.charAt(i));
	}

	return size;
}

function htmlDecode(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
}

function htmlEncode(str) {
    return String(str)
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
}

