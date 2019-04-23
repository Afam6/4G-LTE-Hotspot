/* -------------------------- */
/*  Variables                 */
/* -------------------------- */
var gConnObj = null;
var gOMAStatusObj = null;
var gBootTime = "";
var gAutoRefresh = 0;
var gWan=0;
var gDatalinkLoginObj = null;
var gGpsNmeaObj = null;
var gApMode=0;
var gWorkMode=0;
var gAutoTemp=0;
var gDisplayActiveTabOnHOSvcCur="3g";
var gDisplayActiveTabOnHOSvcOld="3g";
var gSelectedCur="3g";
var gCallFailCnt = 0;
var gStatus_3g_prev = "";
var gAlertShown = 0;
var gRefurObj = null;
var gHFAcomplete = 0;
var gCIOMA_Obj = null;
var timer_count = new Array(0, 0);
var timer_time = new Array(-1, -1);
var timer_start = new Array(0, 0);
var gQueryTimerUpdateRpc = new RPC("cgi_query_timer_req");
var gQueryTimer = null;

var gUsimPinCodeObj = null;
var gAutoUpgradeObj = null;

var gOtaspManualActionObj = null;

var gSMSNewMsgObj = null;
var save3GLPM=0;

var mAutoChangeTimer = null;
var temp_AutoConn_mode  = 0;

/* -------------------------- */
/*  UI function               */
/* -------------------------- */
function doUpdateTimerCallBack(result, argv, error) {
    var rtc = result[0];
    var uptime_3gmodem = result[1];
    var lte_uptime = result[3];	

    if(gConnObj.mShowConnTime)
    {
        uptime_3gmodem = rtc - uptime_3gmodem;

        lte_uptime = rtc - lte_uptime;

        if(uptime_3gmodem == rtc )
        {
            uptime_3gmodem = 0;
        }

        if(lte_uptime == rtc )
        {
            lte_uptime = 0;
        }

        if((gConnObj.getPacketCallState() == 3) && (gConnObj.getSignal("3g") == 0)) //3g no service in dormant
        {
            uptime_3gmodem= -1;
        }
        if(gConnObj.getStatus("3g") != "Connected")
        {
            uptime_3gmodem= -1;
        }

        if(gConnObj.getStatus("LTE") != "Connected")
        {
            lte_uptime = -1;
        }
    }
    else
    {
        uptime_3gmodem = -1;

        lte_uptime = -1;
    }
    update_connection_time("3g", uptime_3gmodem); // 3G

    update_connection_time("LTE", lte_uptime); // LTE
    
    doRefreshTimer();
}

 function  doRefreshTimer()
{
    if (gQueryTimer) { clearTimeout(gQueryTimer); }
    gQueryTimer = setTimeout(function() { doTimerUpdate(); }, 500);
}

function doTimerUpdate() {
    var options = {
        successFn: doUpdateTimerCallBack,
        errorFn: function(textStatus) {doTimerUpdate(); },
        timeout: 1000,
        argv: { }
    };
    gQueryTimerUpdateRpc.reset();    
    gQueryTimerUpdateRpc.addFunction("fti_get_rtc_time","");
    //gQueryTimerUpdateRpc.addService("get_rtc_time");
    //gQueryTimerUpdateRpc.addGet("WAN_3gmodem_Uptime");
    //gQueryTimerUpdateRpc.addGet("WAN_wimax_Uptime");    
    
    gQueryTimerUpdateRpc.run(options);
}

function changePage(url, page_id) {
/*    
  if (page_id == "pg_account") {
    var status_3g = gConnObj.getStatus("3g");
    var status_4g = gConnObj.getStatus("4g");
    if (status_3g == "Connected" || status_4g == "Connected") {
      window.open("https://www.cspire.com");
      return;
    }
  }
*/  

  var menu_ids = ["pg_status", "pg_checkusage", "pg_wifi", "pg_settings", "pg_help"];
//  if(page_id!="pg_checkusage"){
      url_path = url + '?WWW_SID=' + sid;
      ifr.window.location = url_path;
  //}

   $("#connection_control").show();
   //$("#right_homebody").hide();
   $("#right_urlbody").show();  

  for(var i=0;i<5;i++){
    if(menu_ids[i]==page_id){
        $("#top_menu" +  i + "_on").show();
        $("#top_menu" +  i + "_off").hide();
    }else{
        $("#top_menu" +  i + "_off").show();
        $("#top_menu" +  i + "_on").hide();    
    }
  }
}

function getCurrentPage() {
  var url_path = location.search;
  var curr_page = "status.asp";
  var field = "";

  if (url_path != "") {
    url_path=url_path.substring(1);
    arg=url_path.split("&");
    for (var i=0 ; i<arg.length ; ++i) {
      f=arg[i].split("=");
      if (f[0] == "field") {
        field = f[1];
      } else if (f.length == 1) {
        curr_page = f[0];
      }
    }
  }

   $("#connection_control").show();
   //$("#right_homebody").hide();
   $("#right_urlbody").show();
    
  if (field == "") {
    return curr_page;
  } else {
    return curr_page + "?field=" + field;
  }
}

function update_connect_button_status(type, text) {
    if(type=='LTE')
    {
        $("#connectbtn" + type + "_" + "activate").hide();
        $("#connectbtn" + type + "_" + "no_activate").hide();
        $("#connectbtn" + type + "_" + "connect").hide();
        $("#connectbtn" + type + "_" + "no_connect").hide();
        $("#connectbtn" + type + "_" + "cancel").hide();
        $("#connectbtn" + type + "_" + "disconnect").hide();
        $("#connectbtn" + type + "_" + "disable").hide();
        $("#connectbtn" + type + "_" + "nosignal").hide();
        $("#connectbtn" + type + "_" + "airplane").hide();
        

        $("#connectbtn" + type + "_" + text).show();
    }
    else if(type=='3g')
    {
        $("#connectbtn" + type + "_" + "activate").hide();
        $("#connectbtn" + type + "_" + "no_activate").hide();
        $("#connectbtn" + type + "_" + "connect").hide();
        $("#connectbtn" + type + "_" + "no_connect").hide();
        $("#connectbtn" + type + "_" + "cancel").hide();
        $("#connectbtn" + type + "_" + "disconnect").hide();
        $("#connectbtn" + type + "_" + "disable").hide();
        $("#connectbtn" + type + "_" + "nosignal").hide();
        $("#connectbtn" + type + "_" + "airplane").hide();

        $("#connectbtn" + type + "_" + text).show();
    }
}

function update_switch_button_status(text) {
    $("#connectbtnSwitch_connect").hide();
    $("#connectbtnSwitch_no_connect").hide();
    $("#connectbtnSwitch_switch").hide();
    $("#connectbtnSwitch_no_activate").hide();
    $("#connectbtnSwitch_airplane").hide();
    
    $("#connectbtnSwitch_" + text).show();
}

function update_signal_status(type, signal, text) {
    var new_text='';
    var small_signal;
    var is3GLPM = gConnObj.Is3GLPM();
    var isApMode = gConnObj.IsAPMODE();
    var isAvailStatus = gConnObj.getSvcAvailable(type);
    var mainNetwork = gConnObj.getMainNetwork();
    var hoMode = gConnObj.getHOMode();
    var sys_mode = gConnObj.getSysMode();
    var pre_text = "3G";
    if(type=='3g')
    {
        if(hoMode == 11 && sys_mode == 0x04)
            pre_text = "2G";        
        else if(hoMode == 7)
            pre_text = "2G";
        
        //if(text=='No Signal' || text=='Radio off' ) new_text = '3G Unavailable';
        if(text=='Not Activated') new_text = 'Not Activated';
        else if(isAvailStatus == 0) new_text = pre_text + ' Unavailable';
        else if(isAvailStatus == 1){
            if(text=='Connecting') new_text = 'Connecting...';
            else if(text=='Connected') new_text = pre_text + ' Network';
            else if(text=='Disconnected' || text=='No Signal' ) new_text = pre_text + ' Available';
            else if(text=='Disconnecting') new_text = 'Disconnecting...';
            else if(text=='Radio off') new_text = pre_text + ' Unavailable';
        }
    }
    else if(type=='LTE')        
    {
        //if(text=='No Signal' || text=='Radio off' ) new_text = '4G LTE Unavailable';
        if(text=='Not Activated') new_text = 'Not Activated';
        else if(isAvailStatus == 0) new_text = '4G LTE Unavailable';
        else if(isAvailStatus == 1){
            if(text=='Connecting') new_text = 'Connecting...';
            else if(text=='Connected') new_text = '4G LTE Network';
            else if(text=='Disconnected' || text=='No Signal' ) new_text = '4G LTE Available';        
            else if(text=='Disconnecting') new_text = 'Disconnecting...'; 
            else if(text=='Radio off') new_text = '4G LTE Unavailable';
        }
    }


    if((new_text == '2G Available' || new_text == '3G Available'|| new_text == 'Connecting...')&& type!='LTE'){     
        signal = signal;
        small_signal = signal;
    }
    else if(new_text == '2G Unavailable' || new_text == '3G Unavailable'){        
        if(hoMode == 4 && (is3GLPM == 1 || mainNetwork == "LTE")){
            signal = 3;
            small_signal = 3;
        }
        else{
            signal = 0;
            small_signal = 0;
        }
    }else{
        small_signal = signal;
    }

    if(isApMode == 1){
        signal = 0;
        small_signal = 0;
    }

    for(var i=0;i<7;i++){            
        if(signal==i) {
            $("#signalbar" + type + signal + "_on").show();
        }
        else {
            $("#signalbar" + type + i + "_on").hide();
        }
    }

    for(var i=0;i<7;i++){            
        if(small_signal==i) {
            $("#signalbar" + type + small_signal + "_small_on").show();
        }
        else {
            $("#signalbar" + type + i + "_small_on").hide();
        }
    }
    
    var txt = window.lang.convert(new_text, top.default_lang);
    $("#left_signal" + type + "Status").html(txt);

    txt = window.lang.convert("Signal:", top.default_lang);
    $("#left_signal" + type + "Status").attr("title", txt + " " +signal);
    
}

function update_connect_button() 
{
    var wan = ["3g", "LTE"];
    var signal_3g = gConnObj.getSignal(wan[0]);
    var status_3g = gConnObj.getStatus(wan[0]);
    var signal_lte = gConnObj.getSignal(wan[1]);
    var status_lte = gConnObj.getStatus(wan[1]);
    var isActivated = gConnObj.IsActivated();
    
    var obj_3g = $("#btn3gConn");
    var obj_lte = $("#btnLTEConn");
    var obj_switch = $("#btnSwitch");
    var obj_3g_switch = $("#btn3gSwitch");

    var is3GLPM = gConnObj.Is3GLPM();
    var work_mode = gConnObj.getWorkMode();
    var HO_mode = gConnObj.getHOMode();
    var AP_mode = gConnObj.IsAPMODE(); /* airplane mode: default airplain mode - off*/
    //var datalink = gDatalinkLoginObj.getDatalinkStatus();
    var vpn = "";

    if(AP_mode == 1 && isActivated == 1) // If airplane mode 
    {
        obj_3g.attr("class", "connBtn_disable");
        //obj_3g.html('<img border="0" src="img/shape_btn_airplane.png">');
        update_connect_button_status("3g", "airplane");

        obj_lte.attr("class", "connBtn_disable");
        //obj_3g.html('<img border="0" src="img/shape_btn_airplane.png">');
        update_connect_button_status("LTE", "airplane");

        obj_switch.attr("class", "connBtn_disable");
        update_switch_button_status("airplane");
        return ;
    }

    save3GLPM=is3GLPM;

    if(HO_mode ==1){
        obj_switch.attr("class", "connBtn_disable");
        update_switch_button_status("no_connect");
    }else if(HO_mode ==2){
        obj_switch.attr("class", "connBtn_disable");
        update_switch_button_status("no_connect");
    }else if(status_3g == "Connected" || status_lte == "Connected"){
        obj_switch.attr("class", "connBtn_active");
        update_switch_button_status("switch");    
    }else if(status_3g == "Connecting" || status_lte == "Connecting"){
        update_switch_button_status("no_connect");    
        obj_switch.attr("class", "connBtn_disable");
    }else if(isActivated==0){
        obj_switch.attr("class", "connBtn_disable");
        update_switch_button_status("no_activate");            
    }else if(gOMAStatusObj.isOMADMrunning() == 1){
        obj_switch.attr("class", "connBtn_disable");
        update_switch_button_status("no_connect");
    }else{
        obj_switch.attr("class", "connBtn_active");
        update_switch_button_status("connect");
    }
 
    if (status_3g == "Disconnected"){
        
    }
    
    if (status_3g == "Disconnected") 
    {
        if(isActivated == 0)
        {
       	    if(gOMAStatusObj.getNumOfHFACompelete() > 0 && (gOMAStatusObj.isHFAfailOn() == 1|| gOMAStatusObj.isHFAOn() == 0))
       	 	{
		            obj_3g.attr("class", "connBtn_active");
		            //obj_3g.html('<img border="0" src="img/shape_btn_activate.png">');
		            update_connect_button_status("3g", "activate");
       	 	}
	        else
	        {
		            obj_3g.attr("class", "connBtn_disable");
		            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
		            update_connect_button_status("3g", "no_activate");
	        }
	        return ;
        }
        else if(gOMAStatusObj.isHFAOn()  == 1)
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
            update_connect_button_status("3g", "no_activate");
            return;
        }        
        else if(gOMAStatusObj.isOMADMrunning() == 1)
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_connect_disable.png">');
            update_connect_button_status("3g", "no_connect");
           // return;
        }
        else
        {
	        obj_3g.attr("class", "connBtn_active");
	        //obj_3g.html('<img border="0" src="img/shape_btn_connect.png">');
            update_connect_button_status("3g", "connect");
        }
    }
    else if (status_3g == "Radio off") 
    {
        if(gOMAStatusObj.isHFAOn()  == 1)
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
            update_connect_button_status("3g", "no_activate");
            return;
        }        
        else if(HO_mode == 2) // HO mode is 4G Only
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_3Gdisabled.png">');
            update_connect_button_status("3g", "disable");
        }
        else
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_connect_disable.png">');
            update_connect_button_status("3g", "no_connect");
        }
    }
    else if (status_3g == "No Signal") 
    {
	 if(isActivated == 0)
	 {
	    obj_3g.attr("class", "connBtn_active");
            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
            update_connect_button_status("3g", "activate");
	 }
	 else if(gOMAStatusObj.isHFAOn()  == 1)
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
            update_connect_button_status("3g", "no_activate");
            return;
        }        
	else
	{
	        obj_3g.attr("class", "connBtn_disable");
	        //obj_3g.html('<img border="0" src="img/shape_btn_nosignal.png">');
	        update_connect_button_status("3g", "nosignal");
	}
    }
    else if (status_3g == "Connected") 
    {
        if(isActivated == 0)
        {//alert(gOMAStatusObj.getNumOfHFACompelete() );
        	if(gOMAStatusObj.getNumOfHFACompelete() > 0 && gOMAStatusObj.isHFAOn() == 0)
        		{
		            obj_3g.attr("class", "connBtn_disable");
		            //obj_3g.html('<img border="0" src="img/shape_btn_activate.png">');
		            update_connect_button_status("3g", "activate");
        		}
        	else
        		{
		            obj_3g.attr("class", "connBtn_disable");
		            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
		            update_connect_button_status("3g", "no_activate");
        		}
            return ;
        }
        else if(gOMAStatusObj.isHFAOn()  == 1)
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
            update_connect_button_status("3g", "no_activate");
            return;
        }        
    	else if(gOMAStatusObj.isOMADMrunning() == 1)
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_connect_disable.png">');
            update_connect_button_status("3g", "no_connect");
            //return;
        }
    	else
        {
            if((gConnObj.getPacketCallState() == 3) && (signal_3g == 0))
            {
	        obj_3g.attr("class", "connBtn_disable");
	        //obj_3g.html("");
	        update_connect_button_status("3g", "no_connect");
            }
            else
            {
                obj_3g.attr("class", "connBtn_active");
                //obj_3g.html('<img border="0" src="img/shape_btn_disconnect.png">');
                update_connect_button_status("3g", "disconnect");
		    }
        } 
    } 
    else if (status_3g == "Connecting") 
    {
        if(isActivated == 0)
        {
        	if(gOMAStatusObj.getNumOfHFACompelete() > 0 && gOMAStatusObj.isHFAOn() == 0)
        		{
		            obj_3g.attr("class", "connBtn_disable");
		            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
		            update_connect_button_status("3g", "no_activate");
        		}
        	else
        		{
		            obj_3g.attr("class", "connBtn_disable");
		            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
		            update_connect_button_status("3g", "no_activate");
        		}
            return ;
        }
        else if(gOMAStatusObj.isHFAOn()  == 1)
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
            update_connect_button_status("3g", "no_activate");
            return;
        }        
        else if(gOMAStatusObj.isOMADMrunning() == 1)
        {
            obj_3g.attr("class", "connBtn_disable");
            //obj_3g.html('<img border="0" src="img/shape_btn_connect_cancel.png">');
            update_connect_button_status("3g", "cancel");
            //return;
        }
        else if(gHFAcomplete == 1)
        {
        	$('inline_network_scanning_wait').colorbox.close();	
        	window.clearTimeout(gOMAStatusObj.mNetScanDlgCloseTimeout);
        	gHFAcomplete = 0;
        }
        else
    	{
	        obj_3g.attr("class", "connBtn_active");
	        //obj_3g.html('<img border="0" src="img/shape_btn_connect_cancel.png">');
	        update_connect_button_status("3g", "cancel");
    	}
    }
    else if (status_3g == "Disconnecting")
    {
        obj_lte.attr("class", "connBtn_disable");
        //obj_lte.html('<img border="0" src="img/shape_btn_disconnect.png">');
        update_connect_button_status("3g", "disconnect");
    } 


    // lte
    if(gOMAStatusObj.isHFAOn()  == 1)
   {
        obj_lte.attr("class", "connBtn_disable");
        //obj_lte.html('<img border="0" src="img/shape_btn_not_activate.png">');        
        update_connect_button_status("LTE", "no_activate");
        return;
    }
    else if (status_lte == "Disconnected")
    {
        obj_lte.attr("class", "connBtn_active");
        //obj_lte.html('<img border="0" src="img/shape_btn_connect.png">'); 
        update_connect_button_status("LTE", "connect");
    }
    else if (status_lte == "Radio off") 
    {
        if(
            (work_mode != 2) || // work mode is not 4G preffered mode
            (HO_mode == 1) ||// HO mode is 3G Only
            (gOMAStatusObj.isOMADMrunning() == 1)
            )
        {
            obj_lte.attr("class", "connBtn_disable");
            //obj_lte.html('<img border="0" src="img/shape_btn_4Gdisabled.png">');
            update_connect_button_status("LTE", "disable");
        }
        else
        {
            obj_lte.attr("class", "connBtn_disable");
            //obj_lte.html('<img border="0" src="img/shape_btn_connect_disable.png">');
            update_connect_button_status("LTE", "no_connect");
        }
    }
    else if (status_lte == "No Signal") 
    {   
	if(isActivated == 0)
	 {
	    obj_lte.attr("class", "connBtn_active");
            //obj_3g.html('<img border="0" src="img/shape_btn_not_activate.png">');
            update_connect_button_status("LTE", "activate");
	 }
	else
	{
        obj_lte.attr("class", "connBtn_disable");
        //obj_lte.html('<img border="0" src="img/shape_btn_nosignal.png">');
        update_connect_button_status("LTE", "nosignal");
    }
    }
    else if (status_lte == "Connected")
    {
        obj_lte.attr("class", "connBtn_active");
        //obj_lte.html('<img border="0" src="img/shape_btn_disconnect.png">');
        update_connect_button_status("LTE", "disconnect");
    } 
    else if (status_lte == "Connecting") 
    {
    	 if(gHFAcomplete == 1)
        {
        	$('inline_network_scanning_wait').colorbox.close();	
        	window.clearTimeout(gOMAStatusObj.mNetScanDlgCloseTimeout);
        	gHFAcomplete = 0;
        }
        obj_lte.attr("class", "connBtn_active");
        //obj_lte.html('<img border="0" src="img/shape_btn_connect_cancel.png">');
        update_connect_button_status("LTE", "cancel");
    }
    else if (status_lte == "Disconnecting")
    {
        obj_lte.attr("class", "connBtn_disable");
        //obj_lte.html('<img border="0" src="img/shape_btn_disconnect.png">');
        update_connect_button_status("LTE", "disconnect");
    } 

    if(gAlertShown == 0 && gStatus_3g_prev == "Connecting" && status_3g == "Disconnected") //it means connection fail.
    {
        gAlertShown = 1;
        gCallFailCnt++;
        if(gCallFailCnt >= 2) 
            gCallFailCnt = 2;
        var callerrortype = gConnObj.getCallErrorType();
        var callerrorreason = gConnObj.getCallErrorReason();
        var show_cidc = 0;

		if(callerrortype == 1){
	        if(callerrorreason == 67 || callerrorreason == 75 || callerrorreason == 131 || callerrorreason == 138 ){
	            show_cidc = 1;
	        }
			
	        if(callerrorreason > 0)
	        {
	            $("#mip_error1").html("MIP error : " + callerrorreason);
	            $("#mip_error1_cidc").html("MIP error : " + callerrorreason);
	            $("#mip_error2").html("MIP error : " + callerrorreason);
	            $("#mip_error2_cidc").html("MIP error : " + callerrorreason);
	        }
		}
        else
        {
        	if(callerrortype !=0 ){
	            $("#mip_error1").html("(" + callerrortype + ":" + callerrorreason + ")");
	            $("#mip_error1_cidc").html("(" + callerrortype + ":" + callerrorreason + ")");
	            $("#mip_error2").html("(" + callerrortype + ":" + callerrorreason + ")");
	            $("#mip_error2_cidc").html("(" + callerrortype + ":" + callerrorreason + ")");
        	}

        	if (mAutoChangeTimer) 
        	{ 
	            clearTimeout(mAutoChangeTimer); 
        	}
            mAutoChangeTimer = setTimeout(function() { if(temp_AutoConn_mode == 1){gConnObj.doUpdateAutoconn("1", "0");  if(gAlertShown){top.$.colorbox.close(); gAlertShown=0;}} }, (10 * 1000));
        }

        if(gConnObj.getAutoconnect() == 1){
            temp_AutoConn_mode = 1;
            gConnObj.doUpdateAutoconn("0", "0");
		}else{
            temp_AutoConn_mode = 0;
        }


        if(gCallFailCnt == 1){
            if(show_cidc)
                $.colorbox({inline:true, width:"70%", height:"auto", scrolling:false, overlayClose:false, opacity:0.4, href:'#inline_call_fail_1_cidc'});
            else
                $.colorbox({inline:true, width:"70%", height:"auto", scrolling:false, overlayClose:false, opacity:0.4, href:'#inline_call_fail_1'});
        }
        else if(gCallFailCnt >= 2){
            if(show_cidc)
                $.colorbox({inline:true, width:"70%", height:"auto", scrolling:false, overlayClose:false, opacity:0.4, href:'#inline_call_fail_2_cidc'});
            else
                $.colorbox({inline:true, width:"70%", height:"auto", scrolling:false, overlayClose:false, opacity:0.4, href:'#inline_call_fail_2'});
        }
    }
    else if(status_3g == "Connected")
    {
        gCallFailCnt=0;
    }
    gStatus_3g_prev = status_3g;


}

function update_connection_time(type, time) {
    var isActivated = gConnObj.IsActivated();
    var isApMode = gConnObj.IsAPMODE();

    if (time >= 0 && isActivated == 1 && isApMode==0) {
        $("#left_" + type + "connTmr").show();
        $("#left_" + type + "connTmr").html(zeroPad(Math.floor(time / 3600),2) + ":" + zeroPad((Math.floor(time / 60) % 60),2) + ":" + zeroPad(time % 60,2));
    } else {
        $("#left_" + type + "connTmr").show();
        $("#left_" + type + "connTmr").html("00:00:00");

    }
}

function update_roam_status(type, roam) {
  if (roam.length > 0) {
    $("#left_" + type + "roamstatus").show();
    $("#left_" + type + "roamstatus").html(roam);
    //$("#left_" + type + "roamstatus2").show();
    //$("#left_" + type + "roamstatus2").html(roam);
  } else {
    $("#left_" + type + "roamstatus").hide();
    //$("#left_" + type + "roamstatus2").hide();
  }
}

function update_roam_icon(roam_3g, roam_LTE){
    if(roam_3g != "0" || roam_LTE != "0")
    {
    }
    else
    {
    }
}    
  

function update_datalink_status() {
//removed by HCM requirement.
/*
    if(gConnObj.getDatalink() == 1)
    {
        $("#top_datalink_en").show();
        $("#top_datalink_dis").hide();
        $("#top_datalink_en2").show();
        $("#top_datalink_dis2").hide();
    }
    else
    {
        $("#top_datalink_en").hide();
        $("#top_datalink_dis").show();
        $("#top_datalink_en2").hide();
        $("#top_datalink_dis2").show();
    }
*/
}
function update_autoconnect_status() {
    gWorkMode = gConnObj.getWorkMode();
    var isActivated = gConnObj.IsActivated();
    
    gApMode = gConnObj.IsAPMODE();

    if(gApMode == 1 || gWorkMode == 0 /* default */  || isActivated == 0 )
    {
        $("#top_autodeact").show();
        $("#top_autodeact2").show();
        $("#top_autodeact2").html("<center><a href='#' id='btnAutoDeact' class='autoDeactBtn' title='Deactivated'>Auto Connect Off</a></center>");

        $("#top_autoen").hide();
        $("#top_autodis").hide();
        $("#top_autoen2").hide();
        $("#top_autodis2").hide();
    }
    else
    {
        $("#top_autodeact").hide();
        $("#top_autodeact2").hide();
        
        if(gConnObj.getAutoconnect() == 1)
        {
            $("#top_autoen").show();
            $("#top_autodis").hide();
            $("#top_autoen2").show();
            $("#top_autodis2").hide();
        }
        else
        {
            $("#top_autoen").hide();
            $("#top_autodis").show();
            $("#top_autoen2").hide();
            $("#top_autodis2").show();
        }
    }

}

function update_gps_status() {
    var strGPSTest ="";
    var strGPSOn="";
    var strGPSColor="";
    var strGPSBGImage="";

    if(gConnObj.getGpsEnable() == 1)
    {
        strGPSOn="GPS On";
        strGPSColor="#FFE100";
        strGPSBGImage="img/icon_gps2.png";
    }
    else
    {
        strGPSOn="GPS Off";
        strGPSColor="#000000";
        strGPSBGImage="img/icon_gps1.png";
    }

    strGPSTest += "<div style='background:url(\""+ strGPSBGImage+"\") 0 0 no-repeat;font: bold 13px/1 sans-serif;width:90px;height: 26px;width=90px;padding:6px 0px 0px 0px;margin: 0px 0px;color:" + strGPSColor+";'><center>" + strGPSOn +"</center></div>";

    $("#top_gps_text_dis2").html(strGPSTest);
    
//removed by HCM requirement.
/*
    if(gConnObj.getGpsEnable() == 1 && gConnObj.getNmeaEnable() == 0)
    {
        $("#top_gps_dis").hide();
        $("#top_gps_en").show();
        $("#top_nmea_en").hide();
        $("#top_gps_dis2").hide();
        $("#top_gps_en2").show();
        $("#top_nmea_en2").hide();

    }
    else if(gConnObj.getGpsEnable() == 1 && gConnObj.getNmeaEnable() == 1)
    {
        $("#top_gps_dis").hide();
        $("#top_gps_en").hide();
        $("#top_nmea_en").show();
        $("#top_gps_dis2").hide();
        $("#top_gps_en2").hide();
        $("#top_nmea_en2").show();

    }
    else
    {
        $("#top_gps_dis").show();
        $("#top_gps_en").hide();
        $("#top_nmea_en").hide();
        $("#top_gps_dis2").show();
        $("#top_gps_en2").hide();
        $("#top_nmea_en2").hide();
    }
*/
}
/*
function update_enable_status() {
    var  = $("#btnEnable");
    var status_3g = gConnObj.getStatus("3g"]);
    var status_4g= gConnObj.getStatus("4g"]);
    if(status_3g == "")
    {
        obj_enable.html("enable 4G");
    }
    else
    {
        obj_enable.html("enable 3G");
    }
}
*/
//PeterRYU need to check..
//where is "check_usage.asp" file
function update_menu_status(curr_page) {  
    var menu_ids = ["pg_status", "pg_checkusage",  "pg_wifi", "pg_settings", "pg_help"];    
    var menu_pages = ["status.asp", "check_usage.asp", "settings_wifi.asp", "settings.asp", "help.htm"];

   for(var i=0;i<5;i++){
        if(menu_pages[i]==curr_page){
            $("#top_menu" +  i + "_on").show();
            $("#top_menu" +  i + "_off").hide();
        }else{
            $("#top_menu" +  i + "_off").show();
            $("#top_menu" +  i + "_on").hide();    
        }
    }
}

function update_check_usage_menu() {
    var obj = document.getElementById('pg_checkusage');

    if (gConnObj.IsActivated() == 1 && (gConnObj.getStatus("3g") == "Connected" || gConnObj.getStatus("LTE") == "Connected"))
    {
        if (obj.style.display == '' || obj.style.display == 'none')
            obj.style.display = 'inline-block';
    }
    else
    {
        if (obj.style.display == 'inline-block')
            obj.style.display = 'none';
    }
}

var gAlertShow = 0;
function showAlertMessage(type) {
  if (type < 0) {
    return;
  }

  if (gAlertShow == 0) {
    gAlertShow = type;
    if (gAlertShow == 1) {
      $.colorbox({inline:true, width:'500', scrolling:false, overlayClose:false, opacity:0.6, href:'#inline_BusyNotify'});
    } else if (gAlertShow == 2) {
      $.colorbox({inline:true, width:'500', scrolling:false, overlayClose:false, opacity:0.6, href:'#inline_3gNotify'});
    }
  } else {
    if (type == 0) {
      $.colorbox.close();
      window.gAlertShow = 0;
    }
  }
}

function hideAlertMessage() {
  $.colorbox.close();
  setTimeout( "window.gAlertShow = 0;", 2000);
}

function click_switch(wan, set)
{         
    connect_click(wan,0);
    switchmode(wan, set);
}

function click_connect_curr()
{     
    //check connected?
    var status_curr = gConnObj.getStatus(gSelectedCur);
    var obj_switch = $("#btnSwitch");

    if(status_curr=="Connected")
        return;
    
    if ((obj_switch.attr("class") != "connBtn_active")) 
        return;

    switchmode(gSelectedCur, 1);
    gConnObj.doSwitchingAction(gSelectedCur, "1");    
}


function update_small_net_status(wan) {
    var status = gConnObj.getStatus(wan);
    $("#small_net_status").html(status);
    
}

function click_switch_mode_only(wan)
{  
    if(wan=="3g"){        
        gSelectedCur = "3g";
    }
    else if(wan=="LTE"){
        gSelectedCur = "LTE";
    }
    update_small_net_status(wan);
/*
    if(status_3g != "Connected" && status_4g != "Connected" && status_lte != "Connected" ){
        click_switch(wan, 1);
    }
*/    
}

function switchmode(wan, set)
{
	if(wan=="3g"){        
        if(set==1) {
            gDisplayActiveTabOnHOSvcCur = "3g";
            //doc.E("switch_cm_3g").checked = 1;
            //gSelectedCur ="3g"
        }
        $("#areaLTE").hide();
        $("#area3G").show();
    }
    else if(wan=="LTE"){
        if(set==1) {
            gDisplayActiveTabOnHOSvcCur = "LTE";
            //doc.E("switch_cm_lte").checked = 1;
            //gSelectedCur ="LTE"
        }
        $("#area3G").hide();   
        $("#areaLTE").show();
    }
}

/* -------------------------- */
/*  Update function           */
/* -------------------------- */

var set_default_ran = 0;
function index_refresh() {
  var boot_time = gConnObj.getBootTime();
  if (boot_time != "") {
    if (gBootTime == "") {
      gBootTime = boot_time;
    } else {
      if (boot_time != gBootTime) {
        gBootTime = boot_time;
        if (window.gAutoRefresh == 1) {
          setTimeout(function() { top.location.reload(); }, 3000);
        } else {
          top.location.reload();
          //$.colorbox({inline:true, width:'500', overlayClose:false, opacity:0.6, href:'#inline_reloadPage'});
        }
        return;
      }
    }
  }

  var wan = ["3g", "LTE"];
    var roam_3g;
    var roam_LTE;
    
  for (var i=0; i<wan.length ; ++i) {
    var signal = gConnObj.getSignal(wan[i]);
    var status = gConnObj.getStatus(wan[i]);
    var roam_txt   = gConnObj.getRoamText(wan[i]);
    var roam_id   = gConnObj.getRoamId(wan[i]);
    var isActivated = gConnObj.IsActivated();
    var mainNetwork = gConnObj.getMainNetwork();
    
    var technology = "";

    if( i == 0)
        roam_3g = roam_id;
    else
        roam_LTE = roam_id;

    if (set_default_ran == 0 && status != "Unknown") {
      if (status == "Connected") {
        if (wan[i] == "3g") {
          switchmode('3g', 1);
        } else 
	if (wan[i] == "LTE") {
          switchmode('LTE', 1);
        }        
        set_default_ran = 1;        
      }
      if(status == "Radio off" || status == "No Signal")
      {
	if (wan[i] == "3g") {
          switchmode('3g', 0);
        } else 
	if (wan[i] == "LTE") {
          switchmode('LTE', 0);
        }
        set_default_ran = 1;        
      }
      else if (mainNetwork == wan[i]) {
        switchmode(wan[i], 1);
        set_default_ran = 1;
      }      
    }
    else if(set_default_ran == 1)
    {
        if(status == "Connected")
        {
            gDisplayActiveTabOnHOSvcCur = wan[i];
        }
        if (mainNetwork == wan[i]) {
            switchmode(wan[i], 1);
        }
        if(gDisplayActiveTabOnHOSvcCur != gDisplayActiveTabOnHOSvcOld)
        {
            gDisplayActiveTabOnHOSvcOld = gDisplayActiveTabOnHOSvcCur;
                
            if (gDisplayActiveTabOnHOSvcCur == "3g") {
                switchmode('3g', 0);
            } else 
	    if (gDisplayActiveTabOnHOSvcCur == "LTE") {
                switchmode('LTE', 0);
            }
        }
    }

    

/*
    if (status == "Connected")
        technology = " " + gConnObj.getTechnology(wan[i]);
*/    
    if(isActivated == 1)
    {
    	if(gOMAStatusObj.isHFAOn() == 1)
    	{
    		status = "Not Activated";
    	}
       else if(wan[i] == "3g" && status == "Connected" && (gConnObj.getPacketCallState() == 3) && (signal == 0)) //3g no signal on dormant.
       {
            status = "No Signal";
       }
        update_signal_status(wan[i], signal, status + technology);
       
    }
    else
    {        
        if(status == "Connecting" || status == "Connected" || status == "Disconnected" ||status == "Radio off" ||status == "No Signal")
        {
            status = "Not Activated";
            update_signal_status(wan[i], signal,  status + technology);
        }
        else
        {
            update_signal_status(wan[i], signal, status + technology);
        }

        // Check the connect proxy for DSA
        if(gOMAStatusObj.getNumOfHFACompelete() > 0 && gOMAStatusObj.isHFAOn() == 0)
        {
            gConnObj.doCheckProxyReady();
        }
    }

    update_roam_status(wan[i], roam_txt);
  }

    update_roam_icon(roam_3g, roam_LTE);
    update_connect_button();
 
    update_datalink_status();
    update_autoconnect_status();
    update_gps_status();
    //update_enable_status();
    //update_check_usage_menu();

    update_small_net_status(gSelectedCur);

/*    
  var roamstate = gConnObj.getRoamguardStatus();
  if(roamstate == 1)
    showRoamGuardMsg("inline_msgbox", "Data roaming rate may apply. Click 'Roam' button to continue.");
*/  
  showAlertMessage(gConnObj.getAlertType());

}
function update_timer()
{
    var wan = ["3g", "LTE"];

    for (var i=0; i<wan.length ; ++i) {
        var time   = gConnObj.getConnTime(wan[i]);
        if(wan[i] == "3g" && (gConnObj.getPacketCallState() == 3) && (gConnObj.getSignal(wan[0]) == 0)) //3g no service in dormant
        {
            time = -1;
        }
        update_connection_time(wan[i], time);
    }
}
/* -------------------------- */
/*  Event function            */
/* -------------------------- */
function connect_click(wan, trycon)
{
     if (gOMAStatusObj.isOMADMrunning() == 1)
		return;
    var signal_3g = gConnObj.getSignal("3g");
    var status_3g = gConnObj.getStatus("3g");
    var roam_3g = gConnObj.getRoamId("3g");
    var isActivated = gConnObj.IsActivated();
    

    if((wan == "3g") && (isActivated == 0))
    {
        var obj = $("#btn" + wan + "Conn");
        if (obj.attr("class") != "connBtn_active") 
	{
            return;
	}
        
        // DSA is available when HFA fails more than once and HFA is not in progress.
        if(gOMAStatusObj.getNumOfHFACompelete() > 0 && gOMAStatusObj.isHFAOn() == 0)
        {
            // Start DSA client
            showDialog("inline_dsa_connecting");
            gConnObj.doStartDSAClient();
            return ;
        }
    }

    if((wan == "LTE"))
    {
        var obj = $("#btn" + wan + "Conn");
        if (obj.attr("class") != "connBtn_active") 
            return;        
    }
    
    
    if((wan == "3g") && (status_3g == "Disconnected") && (signal_3g > 0) && (roam_3g != "0"))
    {
        gConnObj.getRoamGuardAlert();
    }
    else
    {
        do_connect(wan, trycon)
    }
}

function do_connect(wan, trycon)
{
    var signal_3g = gConnObj.getSignal("3g");
    var status_3g = gConnObj.getStatus("3g");
    var signal_lte = gConnObj.getSignal("LTE");
    var status_lte = gConnObj.getStatus("LTE");
    
    var is3GLPM = gConnObj.Is3GLPM();
    var isLTELPM = gConnObj.IsLTELPM();
    
    var work_mode = gConnObj.getWorkMode();
    var HO_mode = gConnObj.getHOMode();
    var AP_mode = gConnObj.IsAPMODE(); /* airplane mode: default airplain mode - off*/
    
    gWan = wan;

    {
        if(AP_mode == 1)
        {
//            alert("Airplain mode.");
            return ;
        }

        if(gWan == "3g")
        {
            //1. set CONNMNG_AUTOCONNECT to 0.
            gConnObj.doUpdateAutoconn("0", "0");
                //alert("3G LPM scenario is not implemented yet.");
                //jjkim: add code for 3g radio on.
            {
                    //if(status_4g == "Connected")
                    if(trycon == 1)
                    {
                        gConnObj.doSwitchingAction("3g", "1");//switch to 3g and try to connect
                    }
                    else
                    {
                        gConnObj.doSwitchingAction("3g", "0");//switch to 3g and do not try to connect
                    }
                    return ;
            }
        }
        else if(gWan == "LTE")
        {
            //1. set CONNMNG_AUTOCONNECT to 0.
            gConnObj.doUpdateAutoconn("0", "0");

            //alert("3G LPM scenario is not implemented yet.");
            //jjkim: add code for 3g radio on.
            {
                    if(trycon == 1)
                    {
                        gConnObj.doSwitchingAction("LTE", "1");//switch to 3g and try to connect
                    }
                    else
                    {
                        gConnObj.doSwitchingAction("LTE", "0");//switch to 3g and do not try to connect
                    }
                    return ;
            }
        }
        
        if(trycon == 1) wan_connect(gWan);   
    }
}

function vpn_connect_click(mode, username, password)
{
     var obj;
   
        gDatalinkLoginObj.doUpdateCredential(mode, username, password);

    wan_connect(gWan);   
}

function wan_connect(wan)
{
    obj = $("#btn" + wan + "Conn");
    if (obj.attr("class") == "connBtn_active") 
    {
        gConnObj.doAction(wan);
    }
}

function save_credential(mode, username, password)
{
    gDatalinkLoginObj.doSaveCredential(mode, username, password);
    if(mode == 1)
    {
        $("#username2").attr("value", username);
        $("#cridential1").attr("class", "display:block");
        
        $.colorbox({inline:true, width:'400', overlayClose:false, opacity:0.6, href:'#inline_scenarioB'});
    }
    else
    {
        wan_connect(gWan);   
    }
}

function roam_start(start)
{
    if(gAutoTemp && start == "0" ) 
    {
        gConnObj.doUpdateAutoconn("1", "0");
        gAutoTemp = 0;
    }
    gConnObj.doRoamStart(start);
}

function datalink_click(value)
{
    if(value == "1")
    {
        gDatalinkLoginObj.doUpdateDatalinkConfirm("0");
    }
    else
    {
        gDatalinkLoginObj.doUpdateDatalinkConfirm("1");
    }
}

function enable_click()
{
    alert("enable 3G/4G is not implemented yet.");
}

function autoconnect_click(value)
{    
	if (gOMAStatusObj.isOMADMrunning() == 1)
		return;
       
    var roam_3g = gConnObj.getRoamId("3g");
    var signal_3g = gConnObj.getSignal("3g");

/*

    if(status_3g == "Connecting" ||status_4g == "Connecting" )
    {
        //if 3g or 4g is connecting state, changing auto connect may have to disabled.
        return ;
    }

    if(value == "1")
    {
        gConnObj.doUpdateAutoconn("0", "1");
        gAutoTemp = 0;
        
    }
    else
    {
        var roam_3g = gConnObj.getRoamId("3g");
        gAutoTemp = 1;

        if(status_4g == "Disconnected" )
        {
            connect_click("4g", 1);
            gConnObj.doUpdateAutoconn("1", "1");
        }
        else if(status_3g == "Disconnected")
        {
            connect_click("3g", 1);
            if(roam_3g == "0") //in home area.
                gConnObj.doUpdateAutoconn("1", "1");
        }        
        else
            gConnObj.doUpdateAutoconn("1", "1");
    }
*/
     if(value == "1")
     {
        gConnObj.doUpdateAutoconn("0", "1");
        gAutoTemp = 0;
        
     }else{
        gAutoTemp = 1;
        
        if(gSelectedCur =="3g" && roam_3g != "0")
            connect_click("3g", 1);
        else{
            gConnObj.doUpdateAutoconn("1", "1");    
        }
     }
}

function gps_click(value)
{    
    if(value == "0")
    {
       gGpsNmeaObj.doUpdateGPSEnable("1");
    }
    else if(value == "1")
    {
        gGpsNmeaObj.doConfirmNMEA();
    }
    else
    {
       gGpsNmeaObj.doUpdateGPSEnable("0");
       gGpsNmeaObj.doUpdateNMEAEnable("0");
    }
}

function nmea_enable()
{
    gGpsNmeaObj.doUpdateNMEAEnable("1");
}

function nmea_cancel()
{
    gGpsNmeaObj.doQuery();
}

function datalink_enable(value)
{
    var wan = ["3g", "4g", "LTE"];

    for(var i = 0; i < wan.length; i++)
    {
        obj = $("#btn" + wan[i] + "Conn");
        if (obj.attr("class") == "connBtn_active") 
        {
            if((gConnObj.getStatus(wan[i]) == "Connecting") || (gConnObj.getStatus(wan[i]) == "Connected"))
            {
                gConnObj.doAction(wan[i]); //cacel or disconnect call.
            }
        }
    }
    gDatalinkLoginObj.doUpdateDatalink(value);    
}

function cidc_start()
{
    gCIOMA_Obj.select_option(0);    
    window.setTimeout("gCIOMA_Obj.showWaitDlg();", 500);
    window.setTimeout("$.colorbox.close()", 8000);
    window.setTimeout("gCIOMA_Obj.doOMADMStart2()", 8000);
}

function showRoamGuardMsg(name, msg)
{
    var txt = '<p><input type="button" value="Roam" class="button" onclick="roam_start(1)"/> ';
    txt += '<input type="button" value="Cancle" class="button" onclick="roam_start(0)"/></p>'
        
    $("#"+name).html("<p>"+msg+"</p>" + txt);
    $.colorbox({inline:true, width:'60%', overlayClose:false, opacity:0.4, href:'#'+name});
}

function index_init(level) {
  if (level <= 0) {
    if (window.sid.length > 0) {
      top.location.href = top.location.href.split("?")[0];
      return;
    }
  }

  var curr_page = getCurrentPage();
  var url_path = curr_page;
  if (window.sid.length > 0) {
    if (url_path.indexOf("?") >= 0) {
      url_path = url_path + '&WWW_SID=' + sid;
    } else {
      url_path = url_path + '?WWW_SID=' + sid;
    }
  }

  ifr.window.location = url_path;
  update_menu_status(curr_page);
  MainTblHeightResize();
  browser_workaround();
    
  gConnObj = new ConnObj("conn");
  gDatalinkLoginObj = new DatalinkLoginObj("datalink");
  gOMAStatusObj = new OMAStatusObj(1);
//  gOMAStatusObj.setRefreshTime();
//  gOMAStatusObj.doQuery();	// 2012.07.30 blocked
  gGpsNmeaObj = new GpsNmeaObj();
  gRefurObj = new RefurObj();
  gCIOMA_Obj = new CIOMA_Obj();

  gUsimPinCodeObj = new UsimPinCodeObj();
  gAutoUpgradeObj = new AutoUpgradeObj();
  gOtaspManualActionObj = new OtaspManualActionObj();
  //gSMSNewMsgObj = new SMSNewMsgObj();

  setInterval("index_refresh()", 1000);
  doTimerUpdate();

  //setInterval("doTimerUpdate()", 500);
  $("#productName").html(document.title);

  gConnObj.doInitialCheckDsaSession();
  
  if (document.location.href.search("device.programming.com") != -1)
  {
    gConnObj.doDSAProgramDevice();
  }  
}

/*

$(function(){
  $("td[name=connBtn]").click(function(){
    if ($(this).attr("id") == "btn4G") {
      $("#area4G").show();
      $("#area3G").hide();
      $("#switch3G_on").show();
      $("#switch4G_on").hide();
      
    } else {
      $("#area3G").show();
      $("#area4G").hide();
      $("#switch3G_on").hide();
      $("#switch4G_on").show();
    }
  });
});
*/

function select_network_switch()
{
    var status = gConnObj.getStatus(gSelectedCur);
    
    if(status != "Connected"){
        select_network_current(gSelectedCur);
    }
}

function select_network_current(wan)
{
    var status = gConnObj.getStatus(wan);
    var wan_value;
    var roam_id = gConnObj.getRoamId(wan);
    var roam_int = gConnObj.getRoamInt(wan);
    var roam_guard = gConnObj.getRoamguardStatus();
    var isActivated = gConnObj.IsActivated();

    if(isActivated ==0){
		showDialogEx("inline_manual_activate", "510px","auto");	

		gOtaspManualActionObj.doUpdate();
        return;
    }

	

    if(wan == "LTE") wan_value = 2;
    else if(wan == "3g") wan_value = 0;


	if(wan =="3g"){
		if((status == "Disconnected") && (roam_id != "0")){
			if(roam_guard == 2){
				if(roam_int == 1) //domestic roam alert
		                      showDialogEx("inline_domestic_roamguard", "50%", "auto");
	    	                else if(roam_int == 2) //international roam alert
   	        	              showDialogEx("inline_international_roamguard", "50%", "auto");
	    	                else if(roam_int == 3) //international warning alert
 	        	              showDialogEx("inline_international_warning", "50%", "auto");
				return;
			}else if(roam_int == 3){
        	             showDialogEx("inline_international_warning", "50%", "auto");
				return;
			}        
		}
	}	

    if(status == "Connected"){
        gConnObj.doMainNetworkDisconnect();
    }else if(status == "Connecting"){
        gConnObj.doMainNetworkCancel();
    }
//	else
	else if((gConnObj.getSvcAvailable(wan) != 0 ) && (status != "Radio off"))
	{
        gConnObj.doMainNetworkConnect(wan_value);
    }
}

function select_network_roam_3g()
{
	gConnObj.doMainNetworkConnect(0);
}


$(window).resize(function() {
    MainTblHeightResize();
});
