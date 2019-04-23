var reloadTime = 0;
var reloadTimer = 0;
function reload_page(page) {
    if (--reloadTime <= 0) {
        clearInterval(reloadTimer);
        document.location.href = page;
    } 
}

ConnObj = function(name) {
    var _this_ = this;
    this.mName = name;

    this.mErrFunc = null;

    this.m3G = null;
    this.mLTE = null;
    this.mShowConnTime = false;

    this.mDefRefreshTime = 1;
    this.mRefreshTime = this.mDefRefreshTime;

    this.mQueryRpc = null;
    this.mQueryTimer = null;

    this.mQueryTimerUpdateRpc = null;
    this.mQueryTimerUpdateTimer = null;
    
    this.mActionRpc = null;
    this.mCancelRpc = null;
    this.mUpdateRpc = null;
    this.mActionRpc2 = null;
    this.mActionRpc3 = null;
    this.mEncodeParamRpc = null;
    this.mIsAction = 0;

    this.mAlertType = -1;
    this.mUpdtaeWebBootTime = 1;
    this.mWebBootTime = "";
    this.mInterfaceStatus = "0, 0, 0";

    this.connect_after_switching = 0;
    this.mShowRoamguard = 0;
    this.mRoamText = "";
    this.mRoamId = "";
    this.mRoamInt = 0;
    this.mDatalink = 0;
    this.mAutoconnect = 0;
    this.mGpsEnable = 0;
    this.mWorkMode = 0;
    this.mHOMode = 0;
    this.mIs3GLPM = 0;
    this.mIsLTELPM = 0; //lte
    this.mNmeaEnable = 0;
    this.mIsActivated = 1;
    this.mIsAPMODE = 0;
    this.mPacketCallState = 0;
    this.mCallErrorType = 0;
    this.mCallErrorReason = 0;
    this.mBGScan = 0;
    this.mMainNetwork = 0;
    this.mIsNetSwitching = 0;
    this.mSwitchDisplay = 0;
    this.mIsHandover = 0;
    this.mHandoverDisplay = 0;
    this.mNewFirmwareDisplay = 0;
    this.mIpptEnable = 0;

    this.mTimer=null;

    this.mUpdateFail = 0;
    this.mSysMode = 0;
/*
    this.mCurrentService = 0;
    this.mCurrentInCallProtocol = 0;
*/
    this.getAlertType = function() {
        return _this_.mAlertType;
    }

    this.getBootTime = function() {
        return _this_.mWebBootTime;
    }

    this.getInterfaceStatus = function() {
        return _this_.mInterfaceStatus;
    }

    this.getRoamguardStatus = function() {
        return _this_.mShowRoamguard;
    }

    this.getPacketCallState = function() {
        return _this_.mPacketCallState;
    }

    this.getCallErrorType = function() {
        return _this_.mCallErrorType;
    }

    this.getCallErrorReason = function() {
        return _this_.mCallErrorReason;
    }

    this.getSignal = function(type) {
        if (type == "3g")
        {
            return (_this_.m3G != null) ? _this_.m3G[4] : 0;
        }
        if (type == "LTE")
        {
            return (_this_.mLTE != null) ? _this_.mLTE[4] : 0;
        }
        return 0;
    }

    this.getSvcAvailable = function(type) {
        if (type == "3g")
        {
            return (_this_.m3G != null) ? _this_.m3G[3] : 0;
        }
        if (type == "LTE")
        {
            return (_this_.mLTE != null) ? _this_.mLTE[3] : 0;
        }
        return 0;
    }

    this.getStatus = function(type) {
        var status = "down";        
        if (type == "3g") {
            status = (_this_.m3G != null) ? _this_.m3G[5] : "down";
        } else if (type == "LTE") {
            status = (_this_.mLTE != null) ? _this_.mLTE[5] : "down";
        }

        if (type == "3g") {
            if(_this_.Is3GLPM() == 1)
            {
                return "Radio off";
            }
        } else if (type == "LTE") {
            if(_this_.IsLTELPM() == 1)
            {
                return "Radio off";
            }
        }

        if (status == "up") {
            return "Connected";
        } else if (status == "down") {
            if (type == "3g") {
                if(_this_.getSignal("3g") == 0)
                {
                    return "No Signal";
                }
                else
                {
                    return "Disconnected";
                }
            } else if (type == "LTE") {
                if(_this_.getSignal("LTE") == 0)
                {
                    return "No Signal";
                }
                else
                {
                    return "Disconnected";
                }
            }
            else
            {
                //default.
                return "Disconnected";
            }
        } else if (status == "connecting") {
            return "Connecting";
        }
        else if(status == "disconnecting"){
            return "Disconnecting";
        }
        return "Unknown";
    }

    this.getConnTime = function(type) {
        if (_this_.mShowConnTime) {
            if (type == "3g") {
                if(_this_.getStatus("3g") == "Radio off")
                {
                    return -1;
                }
                if (_this_.m3G == null) return -1;
                return (_this_.m3G[5] == "up") ? _this_.mTimer[0] : -1;
            }
        }
        return -1;
    }

    this.getRoamText = function(type) {
        if (_this_.mRoamText) {
            if (type == "3g") {
                return _this_.mRoamText;
            }
        }
        return "";
    }

    this.getRoamId = function(type) {
        if (_this_.mRoamId) {
            if (type == "3g") {
                return _this_.mRoamId;
            }
        }
        return "0";
    }

    this.getRoamInt = function(type) {
        return _this_.mRoamInt;
    }

    this.getDatalink = function() {
        return _this_.mDatalink;
    }

    this.getAutoconnect = function() {
        return _this_.mAutoconnect;
    }

    this.getWorkMode = function() {
        return _this_.mWorkMode;
    }

    this.getHOMode = function() {
        return _this_.mHOMode;
    }
    
    this.Is3GLPM = function() {
        return _this_.mIs3GLPM;
    }
    this.IsLTELPM = function() {
        return _this_.mIsLTELPM;
    }
    this.IsActivated = function() {
        return _this_.mIsActivated;
    }
    this.IsAPMODE = function() {
        return _this_.mIsAPMODE;
    }
    this.IsUpdateFail = function() {
        return _this_.mUpdateFail;
    }
    this.doUpdateAutoconnCallBack = function(result, argv, error) {
    }

    this.doUpdateAutoconn = function(value, is_permanant) {
        var options = {
            successFn: _this_.doUpdateAutoconnCallBack,
            argv: _this_
        };
        this.mUpdateRpc.reset();
/*        
        if(is_permanant == "1")
        {
        this.mUpdateRpc.addSet("CONNMNG_AUTOCONNECT", value);
        }
        this.mUpdateRpc.addSet("CONNMNG_AUTOCONNECT_TMP", value);
*/
        
        this.mUpdateRpc.addFunction("fti_autoconn_update", value + "|" + is_permanant);
        this.mUpdateRpc.run(options);
    }


   this.getGpsEnable = function() {
        return _this_.mGpsEnable;
    }

   this.getNmeaEnable = function() {
        return _this_.mNmeaEnable;
    }

   this.getIpptEnable = function() {
        return _this_.mIpptEnable;
    }

   this.getMainNetwork = function() { //0:3g, 1:wimax, 2:lte
        if(_this_.mMainNetwork ==0) return "3g";
        else if(_this_.mMainNetwork ==1) return "4g";
        else if(_this_.mMainNetwork ==2) return "LTE";
        else return "LTE";
    }   

   this.getIsNetSwitching = function() { 
        return _this_.mIsNetSwitching;
    }   

    this.getSysMode = function() {
        return _this_.mSysMode;
    }


    this.doRefresh = function(obj) {
        if (obj.mQueryTimer) { clearTimeout(obj.mQueryTimer); }
        obj.mQueryTimer = setTimeout(function() { obj.doUpdate(); }, (obj.mRefreshTime * 1000));
    }

    this.doDsaDisconnectedCallBack = function(result, argv, error) {
        showDialogEx("inline_dsa_disconnected", "60%", "auto");
        _this_.doStopDSAClient();
    }
    
    this.doDsaDisconnected = function() {
        var options = {
            successFn: _this_.doDsaDisconnectedCallBack,
            argv: _this_
        };
        
        this.mActionRpc.reset();
        this.mActionRpc.addSet("CONNMNG_DSA_DISCONNECTED", 0);
        this.mActionRpc.addService("sncfg_commit", "");
        this.mActionRpc.run(options);
    }

    this.doUpdateCallBack = function(result, argv, error) {
        if(result.length != 29 ){
            _this_.doRefresh(_this_);
            return;
        }
        argv.obj.mUpdateFail = 0;

        var wan_list = result[0].split("\n");
        var if_status = result[1];
        var show_conn_time = result[2];
        var show_alert = result[3];
        var roamguard = result[4];
        var roamstatus = result[5].split(",");
        var boot_time = result[22];

        var i;
        var tmp_wan = null;
        var tmp_3g = null;               
        var tmp_lte = null;    
        var callError = result[20].split(",");
		
        argv.obj.mCallErrorType = callError[0];
        argv.obj.mCallErrorReason = callError[1];
        
        for (i = 0; i < wan_list.length; ++i) {
            tmp_wan = wan_list[i].split("\t");
            if (tmp_wan[0] == "3gmodem" && tmp_wan[1] == "o") {
                tmp_3g = tmp_wan;
            } else if (tmp_wan[0] == "lte" && tmp_wan[1] == "o") {
                tmp_lte = tmp_wan;
            }
        }

        argv.obj.m3G = tmp_3g;
        argv.obj.mLTE = tmp_lte;
        argv.obj.mShowConnTime = (show_conn_time == "1") ? true : false;
        argv.obj.mAlertType = show_alert;
        argv.obj.mInterfaceStatus = if_status;
        if (argv.updateBootTime == 1) {
            argv.obj.mWebBootTime = boot_time;
            argv.obj.mUpdtaeWebBootTime = 0;
        }
        argv.obj.mShowRoamguard = roamguard;

        if (roamstatus[0] > 2)
            argv.obj.mRoamText = roamstatus[2];
        else
            argv.obj.mRoamText = "";
        argv.obj.mRoamId = roamstatus[0];
	argv.obj.mRoamInt = roamstatus[3];
		
//        argv.obj.mCurrentService = result[6];
//        argv.obj.mCurrentInCallProtocol = result[7];
        argv.obj.mDatalink = result[6];
        argv.obj.mAutoconnect = result[7];
        argv.obj.mGpsEnable = result[8];
        argv.obj.mWorkMode = result[9];
        argv.obj.mHOMode = result[10];
        argv.obj.mIs3GLPM = result[11];
        argv.obj.mNmeaEnable = result[13];
        argv.obj.mIsActivated = result[14];
        argv.obj.mIsAPMODE = result[15];
        argv.obj.mIsNetSwitching = result[16];
        argv.obj.mIsHandover = result[17];

        // switch rf
        if( result[16] == 0 && _this_.mSwitchDisplay == 1){
            //close waiting dialog.
            top.$.colorbox.close();
            _this_.mSwitchDisplay = 0;
        }

        if( result[16] == 1 && _this_.mSwitchDisplay == 0){
            top.showDialogEx("inline_switching", "60%", "auto");
            _this_.mSwitchDisplay = 1;
        }

        // handover
        if( result[17] == 0 && _this_.mHandoverDisplay == 1){
            //close waiting dialog.
            top.$.colorbox.close();
            _this_.mHandoverDisplay = 0;
        }
        if( result[17] == 1 && _this_.mHandoverDisplay == 0){
            top.showDialogEx("inline_handover", "60%", "auto");
            _this_.mHandoverDisplay = 1;
        }        

        
        if (result[18] == "1")
        {
            top.$.colorbox.close();
            argv.obj.doDsaDisconnected();
        }
        
        argv.obj.mPacketCallState = result[19];
        argv.obj.mMipError = result[20];
        
        argv.obj.mBGScan = result[21];

        //for LTE
        argv.obj.mIsLTELPM = result[23];

        //for MainNetwork
        argv.obj.mMainNetwork = result[24]; //0:3g, 1:wimax, 2:lte, 3:GSM
        if(argv.obj.mMainNetwork == "3")
            argv.obj.mMainNetwork = "0"; //3G = GSM/WCDMA 4G = LTE on U711, otherwise, 3G = 1x/EvDO 4G = LTE 

        // New Firmware Check
        if( result[25] == 1 && _this_.mNewFirmwareDisplay == 0){
            top.showDialogEx("inline_new_software", "60%", "140px");
            _this_.mNewFirmwareDisplay = 1;
        }

        argv.obj.mIpptEnable = result[26];
        argv.obj.mSysMode = result[27];
        
        argv.obj.doRefresh(argv.obj);
        argv.obj = null;
    }

    this.doRefreshTimer = function(obj) {
        if (obj.mQueryTimerUpdateTimer) { clearTimeout(obj.mQueryTimerUpdateTimer); }
        obj.mQueryTimerUpdateTimer = setTimeout(function() { obj.doTimerUpdate(); }, 1000);
    }
        
    this.doUpdateTimerCallBack = function(result, argv, error) {
        argv.obj.mTimer = result[0].split("\n");
        argv.obj.doRefreshTimer(argv.obj);
        argv.obj = null;
    }

    this.doTimerUpdate = function() {
        var options = {
            successFn: _this_.doUpdateTimerCallBack,
            errorFn: function(textStatus) {_this_.doTimerUpdate(); },
            timeout: 5000,
            argv: { obj: _this_ }
        };
        this.mQueryTimerUpdateRpc.reset();
        this.mQueryTimerUpdateRpc.addFunction("get_up_time", "");

        this.mQueryTimerUpdateRpc.run(options);
    }
    this.doUpdate = function() {
        var update = this.mUpdtaeWebBootTime;
        var options = {
            successFn: _this_.doUpdateCallBack,
            errorFn: function(textStatus) {_this_.mUpdtaeWebBootTime = 1; _this_.mUpdateFail = 1; _this_.doUpdate(); },
            timeout: 5000,
            argv: { obj: _this_, updateBootTime: update }
        };
        this.mUpdateFail = 2; //updating...
        this.mQueryRpc.reset();
        this.mQueryRpc.addFunction("fti_connobj_update", "");
/*        
        this.mQueryRpc.addFunction("connmng_get_info", "");
        this.mQueryRpc.addFunction("wmx_get_if_status", "");
        this.mQueryRpc.addGet("WEBPAGE_SHOW_CONN_TIME");
        this.mQueryRpc.addGet("WEBPAGE_SHOW_ALERT");
        this.mQueryRpc.addFunction("cdma_info", "Roam_Status_Get");
        this.mQueryRpc.addFunction("cdma_info", "ERoam_IndicatorEx");
        this.mQueryRpc.addGet("DATALINK_ENABLE");
        this.mQueryRpc.addGet("CONNMNG_AUTOCONNECT_TMP");
        this.mQueryRpc.addFunction("cdma_info", "GPS_GetOnOff");
        this.mQueryRpc.addFunction("cdma_info", "Wimax_GetWorkMode");
        this.mQueryRpc.addGet("CONNMNG_HANDOVER_MODE");
        this.mQueryRpc.addFunction("cdma_info", "GetSvcOpMode");
        this.mQueryRpc.addGet("CONNMNG_WIMAX_LPM");
        this.mQueryRpc.addGet("FTI_SYS_NMEA_ENABLED");
        this.mQueryRpc.addFunction("cdma_info", "IsActivated");
        this.mQueryRpc.addGet("CONNMNG_AIRPLANE_MODE");
        this.mQueryRpc.addGet("CONNMNG_DSA_ENABLE");
        this.mQueryRpc.addGet("CONNMNG_DSA_SESSION");
        this.mQueryRpc.addGet("CONNMNG_DSA_DISCONNECTED");
        this.mQueryRpc.addFunction("cdma_info", "GetPacketCallState");
        this.mQueryRpc.addFunction("cdma_info", "MIP_GetError");
        this.mQueryRpc.addGet("CONNMNG_BGSCAN");

//        this.mQueryRpc.addFunction("cdma_info", "GetCurrentService");
//        this.mQueryRpc.addFunction("cdma_info", "GetCurrentInCallProtocol");

        if (update == 1) {
            this.mQueryRpc.addGet("MINI_HTTPD_BOOTTIME");
        }
*/        
        
        this.mQueryRpc.run(options);
    }

    this.doRoamStart = function(on) {
        //var param = "Roam_UserAction" + "=" + on;
        this.mQueryRpc.reset();
        this.mQueryRpc.addFunction("fti_do_roam_start", on);
        this.mQueryRpc.run();
    }

    this.getRoamGuardAlertCallBack = function(result, argv, error) {
        if(result.length != 2 ){
            _this_.doRefresh(_this_);
            return;
        }
        if(result[0] == "1") //domestic roam alert
            showDialogEx("inline_domestic_roamguard", "50%", "auto");
        else if(result[0] == "2") //international roam alert
            showDialogEx("inline_international_roamguard", "50%", "auto");
        else if(result[0] == "3") //international warning alert
            showDialogEx("inline_international_warning", "50%", "auto"); 
        else
        {
            argv.doRoamStart("0");
            do_connect("3g");
        }
    }

      this.getRoamGuardAlert = function() {
        var options = {
            successFn: _this_.getRoamGuardAlertCallBack,
            argv: _this_
        };
        this.mQueryRpc.reset();
        this.mQueryRpc.addFunction("cdma_info", "RoamGuard_GetAlertType");
        this.mQueryRpc.run(options);
    }

    this.doActionCallBack = function(result, argv, error) {
        argv.mRefreshTime = argv.mDefRefreshTime;
    }
    this.doLPMActionCallBack = function(result, argv, error) {
        //alert("doLPMActionCallBack");
    }

    this.doLPMAction3GCallBack = function(result, argv, error) {
        var status = "down";
        var options = {
            successFn: _this_.doLPMActionCallBack,
            argv: _this_,
            timeout: 5000,
            errorFn: function(textStatus) {alert("3G LPM failed - 1"); }
        };

        status = (_this_.m3G != null) ? _this_.m3G[5] : "down";
        if (status == "down"){
            _this_.mActionRpc2.reset();
            _this_.mActionRpc2.addService("do_lpmpwctl", "3g off");
            _this_.mActionRpc2.run(options);
        }
        else
        {
            options = {
                successFn: _this_.doLPMAction3GCallBack,
                argv: _this_,
                timeout: 5000,
                errorFn: function(textStatus) {alert("3G LPM failed - 2"); }
            };
            _this_.mActionRpc2.reset();
            _this_.mActionRpc.addService("sleep", "1");
            _this_.mActionRpc2.run(options);
        }
    }
    
    this.doLPMActionLTECallBack = function(result, argv, error) {
        var status = "down";
        var options = {
            successFn: _this_.doLPMActionCallBack,
            argv: _this_,
            timeout: 5000,
                errorFn: function(textStatus) {alert("LTE LPM failed - 1"); }
        };

        status = (_this_.mLTE != null) ? _this_.mLTE[5] : "down";
        if (status == "down"){
            _this_.mActionRpc2.reset();
            _this_.mActionRpc2.addService("do_lpmpwctl", "lte off");
            _this_.mActionRpc2.run(options);
        }
        else
        {
            options = {
                successFn: _this_.doLPMActionLTECallBack,
                argv: _this_,
                timeout: 5000,
                errorFn: function(textStatus) {alert("LTE LPM failed - 2"); }
            };
            _this_.mActionRpc2.reset();
            _this_.mActionRpc.addService("sleep", "1");
            _this_.mActionRpc2.run(options);
        }

    }
    this.doLPMAction = function(action)
    {
        var options;
        this.mActionRpc.reset();
        
	if(action == "3g off")
        {
            options = {
                successFn: _this_.doLPMAction3GCallBack,
                argv: _this_,
                timeout: 5000
            };
            this.mActionRpc.addFunction("fti_connobj_3g_off", "");
        }
        else if(action == "lte off")
        {
            options = {
                successFn: _this_.doLPMActionLTECallBack,
                argv: _this_,
                timeout: 5000
            };
            this.mActionRpc.addFunction("fti_connobj_lte_off", "");
        }
        else if(action == "3g on")
        {
            options = {
                successFn: _this_.doLPMActionCallBack,
                argv: _this_,
                timeout: 5000
            };
            this.mActionRpc.addFunction("fti_connobj_3g_on", "");
        }
        else if(action == "lte on")
        {
            options = {
                successFn: _this_.doLPMActionCallBack,
                argv: _this_,
                timeout: 5000
            };
            this.mActionRpc.addFunction("fti_connobj_lte_on", "");
        }
        this.mActionRpc.run(options);
    }

    this.doSwitchingAction3GCallBack = function(result, argv, error) {
        if(_this_.getStatus("3g") == "Radio off")
        {
            setTimeout(function() {_this_.doSwitchingAction3GCallBack(result, argv, error);}, 1000);
            return ;
        }
        if(_this_.connect_after_switching == "1")
        {
            _this_.doAction("3g");
        }
        //close waiting dialog.
        top.$.colorbox.close();
    }
    
    this.doSwitching3GCallBack = function(result, argv, error) {
        var status = "down";
        var options = {
            successFn: _this_.doSwitchingAction3GCallBack,
            argv: _this_,
            timeout: 10000,
            errorFn: function(textStatus) {/* alert("Switching to 3G : timeout(2)");*/ $.colorbox.close();}
        };
            _this_.mActionRpc2.reset();
            _this_.mActionRpc2.addFunction("fti_connobj_wimax_off_dual_on", "");
            _this_.mActionRpc2.run(options);
    }

    this.doSwitchingActionLTECallBack = function(result, argv, error) {
        if(_this_.getStatus("LTE") == "Radio off")
        {
            setTimeout(function() {_this_.doSwitchingActionLTECallBack(result, argv, error);}, 1000);
            return ;
        }
        if(_this_.connect_after_switching == "1")
        {
            _this_.doAction("LTE");
        }
        //close waiting dialog.
        top.$.colorbox.close();
    }
    
    this.doSwitchingLTECallBack = function(result, argv, error) {
        var status = "down";
        var options = {
            successFn: _this_.doSwitchingActionLTECallBack,
            argv: _this_,
            timeout: 10000,
            errorFn: function(textStatus) {/*alert("Switching to 4G : timeout(2)");*/ $.colorbox.close(); }
        };

            _this_.mActionRpc2.reset();            
            _this_.mActionRpc2.addFunction("fti_connobj_wimax_off_dual_on", "");
            _this_.mActionRpc2.run(options);

    }
    
    
    this.doSwitchingAction = function(action, conn)
    {
        var options;
        var action;
        this.connect_after_switching = conn;
        this.mActionRpc.reset();
        top.showDialogEx("inline_switching", "60%", "auto"); 

	if(action == "3g")
        {
            options = {
                successFn: _this_.doSwitching3GCallBack,
                argv: _this_,
                timeout: 10000
            };
            if(this.getStatus("LTE") == "Connected")
            {
                this.mActionRpc.addFunction("fti_connobj_lte_disconnect", "");
                action = 1;
            }
            
            if(action == 0)
                this.mActionRpc.addService("sleep", "1");
        }
        else if(action == "LTE")
        {
            options = {
                successFn: _this_.doSwitchingLTECallBack,
                argv: _this_,
                timeout: 10000
            };

            if(this.getStatus("3g") == "Connected")
            {
                this.mActionRpc.addFunction("fti_connobj_3g_disconnect", "");
                action = 1;
            }
            if(action == 0)
                this.mActionRpc.addService("sleep", "1");
        }
        this.mActionRpc.run(options);
    }
    
    this.doAction = function(type) {
        var options = {
            successFn: _this_.doActionCallBack,
            argv: _this_
        };

        var wan = null, wan2 = null;
        var name = "", name2 = "";
        if (type == "3g") {
            wan = this.m3G;
            wan2 = this.mLTE;
            name = "3g";
            name2 = "lte";
        } else if (type == "LTE") {
            wan = this.mLTE;
            wan2 = this.m3G;
            name = "lte";
            name2 = "3g";
        }

        if (wan == null) return;

        var status = wan[5];
        this.mActionRpc.reset();

        if (status == "down") {
            //mypark check
            //this.mActionRpc.addSet("WAN_"+name+"_Status", "connecting");
            if (wan2 != null && wan2[5] == "up") {
                this.mActionRpc.addFunction("fti_connobj_"+name2+"_disconnect", "");                
            }
            this.mActionRpc.addFunction("fti_connobj_"+name+"_connect", "");
        } else if (status == "up") {
            //mypark check
            //this.mActionRpc.addSet("WAN_"+name+"_Status", "disconnecting");

            this.mActionRpc.addFunction("fti_connobj_"+name+"_disconnect", "");
        } else if (status == "connecting") {
            this.mActionRpc.addFunction("fti_connobj_"+name+"_cancel", "");
        } else {
            return;
        }
        this.mRefreshTime = 1;
        this.mActionRpc.run(options);
    }

    this.doInitialCheckDsaSessionCallBack = function(result, argv, error) {
        var dsa_enabled = result[0];
        var dsa_session = result[1];

        if (dsa_enabled == "1" && dsa_session == "1") {
            _this_.doStopDSAClient();
        }
    }

    this.doInitialCheckDsaSession = function() {
        var options = {
            successFn: _this_.doInitialCheckDsaSessionCallBack,
            argv: _this_
        };
        this.mQueryRpc.reset();
        this.mQueryRpc.addFunction("fti_connobj_check_dsa", "");
        /*
        this.mQueryRpc.addGet("CONNMNG_DSA_ENABLE");
        this.mQueryRpc.addGet("CONNMNG_DSA_SESSION");
        */
        this.mQueryRpc.run(options);
    }

    this.doCheckProxyReadyCallBack = function(result, argv, error) {
        var dsa_session = result[0];
        var proxy_ready = result[1];

        if ((dsa_session == "1") && (proxy_ready == "1")) {
            _this_.doInitialDSARequest();
        }
    }
    
    this.doCheckProxyReady = function() {
        var options = {
            successFn: _this_.doCheckProxyReadyCallBack,
            argv: _this_
        };
        this.mActionRpc.reset();
        this.mActionRpc.addGet("CONNMNG_DSA_SESSION");
        this.mActionRpc.addGet("CONNMNG_DSA_PROXY_READY");
        this.mActionRpc.run(options);
    }

    this.doInitialDSARequestCallBack = function(result, argv, error) {
        var dsa_server = result[2];
        var lstInfo = result[3].split(",");
        var esn="", meid="", mdn="", msid="", nai="", lang="", dmanu="", dmodel="", clientver="";

        if(lstInfo[0] != "(null)")
            esn = lstInfo[0];
        if(lstInfo[1] != "(null)")
            meid = lstInfo[1];
        if(lstInfo[2] != "(null)")
            mdn = lstInfo[2];
        if(lstInfo[3] != "(null)")
            msid = lstInfo[3];
        if(lstInfo[4] != "(null)")
            nai = lstInfo[4];
        if(lstInfo[5] != "(null)")
            lang = lstInfo[5];
        if(lstInfo[6] != "(null)")
            dmanu = lstInfo[6];
        if(lstInfo[7] != "(null)")
            dmodel = lstInfo[7];
        if(lstInfo[8] != "(null)")
            clientver = lstInfo[8];

        var dsa_url = "https://" + dsa_server + ":443/dsa/?esn=" + esn +
            "&meid=" + meid + "&mdn=" + mdn + "&msid=" + msid + "&nai=" + nai +
            "&lang=" + lang + "&dmanu=" + dmanu + "&dmodel=" + dmodel + "&clientver=" + clientver;
        window.location = dsa_url;
    }

    this.doInitialDSARequest = function() {
        var options = {
            successFn: _this_.doInitialDSARequestCallBack,
            argv: _this_
        };

        this.mActionRpc2.reset();
        this.mActionRpc2.addSet("CONNMNG_DSA_PROXY_READY", 0);
        this.mActionRpc2.addService("sncfg_commit", "");
        this.mActionRpc2.addGet("CONNMNG_DSA_SERVER");
        this.mActionRpc2.addFunction("dsa_get_url", "encode=1");
        this.mActionRpc2.run(options);
    }

    this.doStartDSAClient = function() {
        this.mActionRpc.reset();
        this.mActionRpc.addService("connmng_do", "-dsa start");
        this.mActionRpc.run();
    }

    this.doStopDSAClientCallBack = function(result, argv, error) {
        $("#omadmStatus").html("");
        
        _this_.mActionRpc2.reset();
        _this_.mActionRpc2.addService("connmng_do", "-dsa stop");
        _this_.mActionRpc2.run();
    }

    this.doStopDSAClient = function() {
        var options = {
            successFn: _this_.doStopDSAClientCallBack,
            argv: _this_
        };
        
        this.mActionRpc.reset();
        this.mActionRpc.addSet("CONNMNG_DSA_SESSION", 0);
        this.mActionRpc.addSet("CONNMNG_DSA_PROXY_READY", 0);
        this.mActionRpc.addService("sncfg_commit", "");
        this.mActionRpc.run(options);
    }

    this.doDSAProgramDevice = function() {
        top.showDsaResetDlg();
               
        this.mActionRpc.reset();
        this.mActionRpc.addService("connmng_do", "-dsa stop");
        this.mActionRpc.addFunction("cdma_info", "SetPwrOnOff=2");
        this.mActionRpc.run();
    }

    this.doCheckUsageCallBack = function(result, argv, error) {
        if(result.length != 10 ){
            _this_.doRefresh(_this_);
            return;
        }
        var esn="", meid="", mdn="", msid="", nai="", lang="", dmanu="", dmodel="", clientver="";

        if(result[0] != "(null)")
            esn = result[0];
        if(result[1] != "(null)")
            meid = result[1];
        if(result[2] != "(null)")
            mdn = result[2];
        if(result[3] != "(null)")
            msid = result[3];
        if(result[4] != "(null)")
            nai = result[4];
        if(result[5] != "(null)")
            lang = result[5];
        if(result[6] != "(null)")
            dmanu = result[6];
        if(result[7] != "(null)")
            dmodel = result[7];
        if(result[8] != "(null)")
            clientver = result[8];

        var dsa_url = "https://deviceselfservice.cspire.com:443/dsa/?activity=usage&esn=" + esn +
            "&meid=" + meid + "&mdn=" + mdn + "&msid=" + msid + "&nai=" + nai +
            "&lang=" + lang + "&dmanu=" + dmanu + "&dmodel=" + dmodel + "&clientver=" + clientver;
        window.open(dsa_url);
    }
    
    this.doCheckUsage = function() {
        var options = {
            successFn: _this_.doCheckUsageCallBack,
            argv: _this_
        };
        
        this.mActionRpc.reset();
        this.mActionRpc.addFunction("fti_dsa_get_url", "");
        this.mActionRpc.run(options);
    }

    this.doMainNetworkConnectCallBack = function(result, argv, error) {
        if(_this_.mIsNetSwitching == 1){
            top.showDialogEx("inline_switching", "60%", "auto");
        }
    }

    this.doMainNetworkConnect = function(wan) {   
        var options = {
            successFn: _this_.doMainNetworkConnectCallBack,
            argv: _this_
        };
        this.mActionRpc.reset();
        this.mActionRpc.addFunction("fti_main_net_connect", wan);
        this.mActionRpc.run(options);
    }

    this.doMainNetworkCancelCallBack = function(result, argv, error) {

    }

    this.doMainNetworkCancel = function() {   
        var options = {
            successFn: _this_.doMainNetworkCancelCallBack,
            argv: _this_
        };
        this.mActionRpc.reset();
        this.mActionRpc.addFunction("fti_main_net_cancel", "");
        this.mActionRpc.run(options);
    }

    this.doMainNetworkDisconnectCallBack = function(result, argv, error) {

    }

    this.doMainNetworkDisconnect = function() {   
        var options = {
            successFn: _this_.doMainNetworkDisconnectCallBack,
            argv: _this_
        };
        this.mActionRpc.reset();
        this.mActionRpc.addFunction("fti_main_net_disconnect", "");
        this.mActionRpc.run(options);
    }

    this.initial = function() {
        this.mQueryRpc = new RPC("cgi_query_" + this.mName);
        this.mActionRpc = new RPC("cgi_action_" + this.mName);
        this.mCancelRpc = new RPC("cgi_cancel_" + this.mName);
        this.mUpdateRpc = new RPC("cgi_update_" + this.mName);
        this.mActionRpc2 = new RPC("cgi_action_2" + this.mName);
        this.mActionRpc3 = new RPC("cgi_action_3" + this.mName);
        this.mQueryTimerUpdateRpc = new RPC("cgi_query_" + this.mName);
    }

    this.initial();
    this.doUpdate();
    //this.doTimerUpdate();
};

OtaspManualActionObj = function() {
	var _this_ = this;
	var mQueryRpc = new RPC("otasp_man_act_query");
	var mUpdateRpc = new RPC("otasp_man_act_update");
	var mQueryTimer = null;
	var mTimeOutFlag = 0;
	var mRefreshTime = 1;
	var mEmptyCount = 0;
	var checkflag = 0;
	var commitflag = 0;

	this.doCloseDialogTimer = function () {
		top.$.colorbox.close();	
		setTimeout(function() {top.showDialogEx("inline_otasp_failed_network", "50%", "auto"); }, 1000);
	}

	this.doQueryCallBack = function(result, argv, error) {
		if(result[0] == "")
		{
			if (mTimeOutFlag == 0)
			{
				mTimeOutFlag = 1;
				_this_.mQueryTimer = setTimeout(function() { _this_.doCloseDialogTimer(); }, (40 * 1000));
			}
		}
		else
		{
			if (mTimeOutFlag == 1) 
			{
				mTimeOutFlag = 0;
				clearTimeout(_this_.mQueryTimer); 
			}
		}

		var otaspList = result[0].split("|");
		for(var i=0;i<otaspList.length;i++)
		{
			switch(otaspList[i]) {
				case "0" : 
					//top.doc.E("man_activate").value += "Service is not activated \n";
					if(checkflag == 1)
					{
						setTimeout(function() {top.$.colorbox.close();}, 2000);
						if(top.gConnObj.IsActivated() == 1)
						{
							if(commitflag == 1)
								setTimeout(function() {top.showDialogEx("inline_otasp_already_activated", "50%", "auto"); }, 2500);
							else
								setTimeout(function() {top.showDialogEx("inline_otasp_not_completed", "50%", "auto"); }, 2500);
						}
						else
							setTimeout(function() {top.showDialogEx("inline_otasp_notactivated", "50%", "auto"); }, 2500);
						return;
					}
					break;
				case "1" :
					//top.doc.E("man_activate").value += "Service is activated \n";
					if(checkflag == 1)
					{
						setTimeout(function() {top.$.colorbox.close();}, 2000);
						setTimeout(function() {top.showDialogEx("inline_otasp_activated", "50%", "auto"); }, 2500);
						return;
					}
					break;
				case "2" :
					top.doc.E("man_activate").value += "Activation connecting -- Network connection is in progress for automatic activation of service \n";
					break;
				case "3" :
					top.doc.E("man_activate").value += "Activation connected -- Network connection is connected for automatic activation of service \n";
					checkflag = 1;
					break;
				case "4" :
					top.doc.E("man_activate").value += "OTASP security is authenticated \n";
					break;
				case "5" :
					top.doc.E("man_activate").value += "OTASP NAM is downloaded \n";
					break;
				case "6" :
					top.doc.E("man_activate").value += "OTASP MDN is downloaded \n";
					break;
				case "7" :
					top.doc.E("man_activate").value += "OTASP IMSI downloaded \n";
					break;
				case "8" :
					top.doc.E("man_activate").value += "OTASP PRL is downloaded \n";
					break;
				case "9" :
					top.doc.E("man_activate").value += "OTASP SPC is downloaded \n";
					break;
				case "10" :
					top.doc.E("man_activate").value += "OTASP settings are committed";
					commitflag = 1;
			}
		}
		_this_.doQuery();
	}

	this.doQuery = function () {
		var options = {
			successFn: _this_.doQueryCallBack,
			errorFn: function(textStatus) { _this_.doQuery();},
			timeout: 2000,
			argv: _this_
		};
		mQueryRpc.reset();
		mQueryRpc.addFunction("fti_manual_activate_query", "");
		mQueryRpc.run(options);
	}

	this.doUpdateCallBack = function(result, argv, error) {
		top.doc.E("man_activate").value = "please wait for Network response...\n";
		argv.doQuery();
	}

	this.doUpdate = function () {
		var options = {
			successFn:_this_.doUpdateCallBack,            
			argv:_this_
		};

		mUpdateRpc.reset();
		mUpdateRpc.addFunction("fti_manual_activate_update", "");
		mUpdateRpc.run(options);
	}

};


AutoConnObj = function() {
    var _this_ = this;
    var mUpdateRpc = null;

    this.doUpdateCallBack = function (result, argv, error) {
        top.showSplashWindow("Saved!");
    }
    this.doUpdate = function(ho_mode) {
        var options = {
            successFn:_this_.doUpdateCallBack,            
            argv:_this_,
            errorFn:function(textStatus) {top.showMssageBox("inline_msgbox", "Failed!");},
            timeout:5000
        };

        mUpdateRpc.reset();
/*        
        if (ho_mode == 0) {
            mUpdateRpc.addService("connmng_do", "-ho mode manual");
        } else if (ho_mode == 1) {
            mUpdateRpc.addService("connmng_do", "-ho mode 3gonly");
        } else if (ho_mode == 2) {
            mUpdateRpc.addService("connmng_do", "-ho mode 4gonly");
        } else if (ho_mode == 3) {
            mUpdateRpc.addService("connmng_do", "-ho mode 3gpref");
        } else if (ho_mode == 4) {
            mUpdateRpc.addService("connmng_do", "-ho mode 4gpref");
        } else {
            mUpdateRpc.addService("connmng_do", "-ho mode manual");
        }
*/
        mUpdateRpc.addFunction("fti_conn_mode_update", ho_mode);
        mUpdateRpc.run(options);
    }

    this.doUpdate3GWarn = function(mode) {
        mUpdateRpc.reset();
        mUpdateRpc.addSet("WEBPAGE_SHOW_3G_WARN", mode);
        mUpdateRpc.run(null);
    }

    mUpdateRpc = new RPC("auto_conn_update");
};

ShowConnTimeObj = function() {
    var mQueryRpc = null;
    var mUpdateRpc = null;
    this.setState = function(name, value) {
        set_field_checked(name, (value == "1"));
    }
    this.doUpdate = function() {
        mUpdateRpc.reset();
        if (field_is_checked("dispTmr")) {
            set_field_checked("dispTmr", false);
            mUpdateRpc.addSet("WEBPAGE_SHOW_CONN_TIME", "0");
        } else {
            set_field_checked("dispTmr", true);
            mUpdateRpc.addSet("WEBPAGE_SHOW_CONN_TIME", "1");
        }
        mUpdateRpc.run(null);
    }
    this.doQuery = function() {
        mQueryRpc.reset();
        mQueryRpc.addGet("WEBPAGE_SHOW_CONN_TIME", [this.setState, "dispTmr"]);
        mQueryRpc.run(null);
    }
    mQueryRpc = new RPC("show_conn_query");
    mUpdateRpc = new RPC("show_conn_update");
    this.doQuery();
};

AirplaneModeObj = function() {
    var mQueryRpc = null;
    var mUpdateRpc = null;
    this.setState = function(name, value) {
        set_field_checked(name, (value == "1"));
    }
    this.doUpdate = function() {
        mUpdateRpc.reset();
        if (field_is_checked("dispAirplane")) {
            set_field_checked("dispAirplane", false);
            mUpdateRpc.addSet("CONNMNG_AIRPLANE_MODE", "0");
        } else {
            set_field_checked("dispAirplane", true);
            mUpdateRpc.addSet("CONNMNG_AIRPLANE_MODE", "1");
        }
        mUpdateRpc.run(null);
    }
    this.doQuery = function() {
        mQueryRpc.reset();
        mQueryRpc.addGet("CONNMNG_AIRPLANE_MODE", [this.setState, "dispAirplane"]);
        mQueryRpc.run(null);
    }
    mQueryRpc = new RPC("airplane_query");
    mUpdateRpc = new RPC("airplane_update");
    this.doQuery();
};

ClearSessionObj = function() {

    var _this_ = this;
    var mClearSessionRpc = new RPC("omaclearsession_update");

    this.doOMADMClearSessionCallBack = function(result, argv, error) {

    }

    this.doOMADMClearSession = function() {
        mClearSessionRpc.reset();
        mClearSessionRpc.addFunction("fti_oma_ui_clear", "");
        mClearSessionRpc.run({ successFn: _this_.doOMADMClearSessionCallBack });
    }
};

function updateProgress(name, value) {
    $("#" + name).reportprogress(parseInt(value));
}

function showFUMODownloadStatus(percentDownload) {
    document.getElementById('omadmStatusDiv').style.display = 'none'; //hide omadm status
    document.getElementById('FUMOProgessDiv').style.display = 'inline'; //Show Fumo download status
    $("#fumoDownloadStatus").html(percentDownload + " % downloaded");


}


function hideFUMODownloadStatus() {
    document.getElementById('FUMOProgessDiv').style.display = 'none'; //Hide FUMO download status
    document.getElementById('omadmStatusDiv').style.display = 'inline'; //Show omadm status
}


function hideButton(BTNnumber) {
    document.getElementById('omadmCancelBtn' + BTNnumber).style.display = 'none';
}

function showButton(BTNnumber) {
    switch (BTNnumber) {
        case "0":
            hideButton(1); hideButton(2); hideButton(3); hideButton(4); hideButton(5); hideButton(6);
            break;
        case "1":
            hideButton(0); hideButton(2); hideButton(3); hideButton(4); hideButton(5); hideButton(6);
            break;
        case "2":
            hideButton(0); hideButton(1); hideButton(3); hideButton(4); hideButton(5); hideButton(6);
            break;
        case "3":
            hideButton(0); hideButton(1); hideButton(2); hideButton(4); hideButton(5); hideButton(6);
            break;
        case "4":
            hideButton(0); hideButton(1); hideButton(2); hideButton(3); hideButton(5); hideButton(6);
            break;
        case "5":
            hideButton(0); hideButton(1); hideButton(2); hideButton(3); hideButton(4); hideButton(6);
            break;
        case "6":
            hideButton(0); hideButton(1); hideButton(2); hideButton(3); hideButton(4); hideButton(5);
            break;


    }
    document.getElementById('omadmCancelBtn' + BTNnumber).style.display = 'inline';
}

function disableCancelButton(btnNum) {
document.getElementById('cancelbtn'+btnNum).disabled = true;
}
function enableCancelButton(btnNum) {
document.getElementById('cancelbtn'+btnNum).disabled = false;
}
SvcOpModeObj = function(){
	var _this_ = this;
	var mQueryRpc = new RPC("svcOpMode_query");
	var mUpdateRpc = new RPC("svcOpMode_update");
	var mSvcOpMode;


	  this.doUpdateSvcOpModeCallBack = function (result, argv, error) {
    }
    this.getCurrentSvcOpMode=function(){
    	_this_.doQuerySvcOpMode();
    	return mSvcOpMode;
    	}
    this.doUpdateSvcOpMode= function(){
        var options = {
            successFn:_this_.doUpdateSvcOpModeCallBack,
            timeout:3000,
            argv:_this_
        };
      
        mUpdateRpc.reset();
        param = "GetSvcOpMode=1";
        mUpdateRpc.addFunction("cdma_info", param);        
        mUpdateRpc.run(options);
    }

	this.doQuerySvcOpModeCallBack = function (result, argv, error) {
		mSvcOpMode = result[0];
    }
	this.doQuerySvcOpMode = function() {
        mQueryRpc.reset();
        mQueryRpc.addFunction("cdma_info", "GetSvcOpMode");
        mQueryRpc.run({ successFn: _this_.doQuerySvcOpModeCallBack });
    }

};

OMAStatusObj = function(time) {

    var _this_ = this;
    var m_status;
    var mQueryRpc = new RPC("omastatus_query");
    var mQueryFnRpc = new RPC("omafn_query");
    var mUpdateRpc = null;


    var mUserActionRpc = new RPC("omauseraction_update");
    var mClearSessionObj = new ClearSessionObj();
    this.mNumOfHFAComplete = 0;
    this.mHFArunnig = 0;
    this.mOMArunnig = 0;
    this.mIsActivationInProcess = 0;
    this.mHFAfail = 0;
    var mQueryTimer = null;
    this.mDefRefreshTime = time;
    this.mRefreshTime = 1;
    this.mTimeout1;
    this.mTimeout2;
    this.mTimeout3;
    this.mTimeout4;
    this.mTimeout5;
    this.mTimeout6;
    this.mTimeout7;
    this.mTimeout8;
    this.mTimeout9;
    this.mTimeout10;
    this.mCancelTimeout;
    this.mactivationOkCloseTimeout;
    this.mNetScanTimeout;
    this.mOMACancelAttempted = 0;
    this.mNetScanDlgCloseTimeout;

    this.SetOMACancel = function()
    {
    	_this_.mOMACancelAttempted = 1; 
    }
    resetOMArunning = function()
    {
    	_this_.mOMArunnig = 0;
    }
    cancelClearSession = function()
    {
    	mClearSessionObj.doOMADMClearSession();
    }
    ResetOMACancel = function()
    {
      	_this_.mOMACancelAttempted = 0;
    }
    ResetHFArunning = function()
    {
   	 _this_.mHFArunnig = 0;
     }
    ResetIsActivationInProcess = function()
    {
    	_this_.mIsActivationInProcess = 0;
    }
    this.doRefresh = function(obj) {
        if (obj.mQueryTimer) { clearTimeout(obj.mQueryTimer); }
        obj.mQueryTimer = setTimeout(function() { obj.doQuery(); }, (obj.mRefreshTime * 1000));
    }

    this.doOMADMUserActionCallBack = function(result, argv, error) {

    }
    CloseCancelConfirm = function()
    {
    	window.setTimeout("$('inline_omadmStatus').colorbox.close()",5000);
    }
    this.doOMADMUserAction = function(session_type, user_action_req) {
        var param;

        if (session_type == 0 && user_action_req == 8 && _this_.mOMACancelAttempted == 1) {
        	disableCancelButton(0);
              _this_.mCancelTimeout = window.setTimeout("$('#omadmStatus').html(' ');enableCancelButton(0);hideButton(0); resetOMArunning();ResetOMACancel();cancelClearSession();showMssageBox('inline_omadmStatus', 'Service Update Cancelled!');CloseCancelConfirm()",3000);
         }
        else if (session_type == 1 && user_action_req == 8 && _this_.mOMACancelAttempted == 1) {
        	disableCancelButton(1);
        	 _this_.mCancelTimeout = window.setTimeout("$('#omadmStatus').html(' ');enableCancelButton(1);hideButton(1); resetOMArunning();ResetOMACancel();cancelClearSession();showMssageBox('inline_omadmStatus', 'PRL Update Cancelled!');CloseCancelConfirm()",3000);
        }
        else if (session_type == 2 && user_action_req == 8 && _this_.mOMACancelAttempted == 1) {
        	disableCancelButton(2);
        	  _this_.mCancelTimeout = window.setTimeout("$('#omadmStatus').html(' ');enableCancelButton(2);hideButton(2); resetOMArunning();ResetOMACancel();cancelClearSession();showMssageBox('inline_omadmStatus', 'Firmware Update Cancelled!');CloseCancelConfirm()",3000);
        	
	 }
	 else if (session_type == 3 && user_action_req == 8 && _this_.mOMACancelAttempted == 1) {
	 	disableCancelButton(3);
	 	  _this_.mCancelTimeout = window.setTimeout("$('#omadmStatus').html(' ');enableCancelButton(3);hideButton(3); resetOMArunning();ResetOMACancel();cancelClearSession();ResetHFArunning();ResetIsActivationInProcess();showMssageBox('inline_omadmStatus', 'Activation Cancelled!');CloseCancelConfirm()",3000);
	 }
	 else if (session_type == 4 && user_action_req == 8 && _this_.mOMACancelAttempted == 1) {
	 	disableCancelButton(4);
	 	 _this_.mCancelTimeout = window.setTimeout("$('#omadmStatus').html(' ');enableCancelButton(4);hideButton(4); resetOMArunning();ResetOMACancel();cancelClearSession();showMssageBox('inline_omadmStatus', 'Service Update Cancelled!');CloseCancelConfirm()",3000);
	 }
	 else if (session_type == 5 && user_action_req == 8 && _this_.mOMACancelAttempted == 1) {
	 	disableCancelButton(5);
	 	  _this_.mCancelTimeout = window.setTimeout("$('#omadmStatus').html(' ');enableCancelButton(5);hideButton(5); resetOMArunning();ResetOMACancel();cancelClearSession();showMssageBox('inline_omadmStatus', 'Service Update Cancelled!');CloseCancelConfirm()",3000);
	 }
	 else if (session_type == 6 && user_action_req == 8 && _this_.mOMACancelAttempted == 1) {
	 	disableCancelButton(6);
	 	  _this_.mCancelTimeout = window.setTimeout("$('#omadmStatus').html(' ');enableCancelButton(6);hideButton(6); resetOMArunning();ResetOMACancel();cancelClearSession();showMssageBox('inline_omadmStatus', 'Firmware Update Cancelled!');CloseCancelConfirm()",3000);
	 }

	        param = user_action_req;
	        mUserActionRpc.reset();
	        mUserActionRpc.addFunction("fti_oma_user_act", param);
	        mUserActionRpc.run({ successFn: _this_.doOMADMUserActionCallBack });

        if (session_type == 3 && user_action_req == 16) {
            $("#omadmStatus").html("Checking for PRL update...");
            showButton(3);
            window.clearTimeout(_this_.mTimeout3);
            window.clearTimeout(_this_.mTimeout4);
         }
        else if (session_type == 3 && user_action_req == 1) {
            $("#omadmStatus").html("Do not power off! Firmware is being installed");
            window.clearTimeout(_this_.mTimeout7);
            window.clearTimeout(_this_.mTimeout8);
         }
        else if (session_type == 3 && user_action_req == 8  && _this_.mOMACancelAttempted == 0) {
            $("#omadmStatus").html("Preparing Service. Please wait...");
            window.clearTimeout(_this_.mTimeout7);
            window.clearTimeout(_this_.mTimeout8);
         }
        else if (session_type == 2 && user_action_req == 1) {
            $("#omadmStatus").html("Do not power off! Firmware is being installed");
            window.clearTimeout(_this_.mTimeout1);
            window.clearTimeout(_this_.mTimeout2);
         }
         else if (session_type == 2 && user_action_req == 8  && _this_.mOMACancelAttempted == 0) {
            $("#omadmStatus").html("Preparing Service. Please wait...");
            window.clearTimeout(_this_.mTimeout1);
            window.clearTimeout(_this_.mTimeout2);
         }
        else if (session_type == 6 && user_action_req == 1) {
            $("#omadmStatus").html("Do not power off! Firmware is being installed");
            window.clearTimeout(_this_.mTimeout9);
            window.clearTimeout(_this_.mTimeout10);
         }
         else if (session_type == 6 && user_action_req == 8  && _this_.mOMACancelAttempted == 0) {
            $("#omadmStatus").html("Preparing Service. Please wait...");
            window.clearTimeout(_this_.mTimeout9);
            window.clearTimeout(_this_.mTimeout10);
         }
       
    }

    this.doOMADMUserAction2 = function(session_type, user_action_req) {
        var param;
        param = user_action_req;
        mUserActionRpc.reset();
        mUserActionRpc.addFunction("fti_oma_user_act", param);        
        mUserActionRpc.run({ successFn: _this_.doOMADMUserActionCallBack });
        if (session_type == 3 && user_action_req == 16) {
            $("#omadmStatus").html("Checking for Firmware update...");
            showButton(3);
            window.clearTimeout(_this_.mTimeout5);
            window.clearTimeout(_this_.mTimeout6);
        }
    }


    this.doInitializeCIOMAState = function() {
        mUpdateRpc.reset();
        mUpdateRpc.addSet("CIOMA_STATUS", "4");
        mUpdateRpc.run(null);

    }
    this.getNumOfHFACompelete = function() {
    return _this_.mNumOfHFAComplete;
  	}

   this.isHFAOn = function() {
    return _this_.mHFArunnig;
  	}

   this.isOMADMrunning = function(){
   	return _this_.mOMArunnig;
   	}
   this.isHFAfailOn = function(){
   	return _this_.mHFAfail;
   	}
   this.doClearTimeoutOkClose = function(){
   	window.clearTimeout(_this_.mactivationOkCloseTimeout);
   	}
    this.doClearTimeoutNetscan = function(){
   	window.clearTimeout(_this_.mNetScanTimeout);
   	}
   
   this.showNetworkScanningWaitDlg = function(){
	showDialogEx("inline_network_scanning_wait", "60%", "auto");
	_this_.mNetScanDlgCloseTimeout = window.setTimeout("$('inline_network_scanning_wait').colorbox.close();",120000);
	}

   
    this.doQueryCallBack = function(result, argv, error) {
		if(result.length != 15 ){
            _this_.doRefresh(_this_);
            return;
        }

        var oma_session = result[0];
        var oma_status = result[1];
        var user_ack_type = result[2];
        var download_length = result[3];
        var download_complete = result[4];
        var update_complte_pct = result[5];
        var uimode = result[6];
        var nresult = result[7];
        var firmver = result[8];
        var description = result[9];
        var num_retries = result[10];
        var retry_interval = result[11];
        var query_display = result[12];        
        var oma_running = result[13];

        if(query_display == 0 && _this_.mOMACancelAttempted == 0) {
            argv.doRefresh(argv);
           //_this_.doQueryFn();
            return;
        }

        //save oma status
        _this_.mOMArunnig = oma_running;

        switch (oma_session) //session type
        {
            case "0": //NONE
                break;
            case "1": //DC
                if(oma_status==1){ //STARTED
                    $("#omadmStatus").html("The network is preparing  your services. Please wait...");
                    showButton(0);
                    _this_.doInitializeCIOMAState();
                    _this_.mOMArunnig = 1;
                } 

                if (_this_.mOMACancelAttempted == 1)
                {
                    mClearSessionObj.doOMADMClearSession();
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);
                    
                	ResetOMACancel();
                	$("#omadmStatus").html("Service Update Cancelled!");
                    showMssageBox("inline_omadmStatus", "Service Update Cancelled!");
                    window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                    $("#omadmStatus").html("");
                }

                if(oma_status != 1 ){ //SUCCEED or FAILED
                    mClearSessionObj.doOMADMClearSession();
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);
                    
                    if(oma_status==2){ //SUCCEED                        
                        $("#omadmStatus").html("Service Complete!");
                        showMssageBox("inline_omadmStatus", "Service Complete!");
                        window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                        $("#omadmStatus").html("");                      
                    }else if(oma_status==4){ //FAILED
                        $("#omadmStatus").html("Service Fail!");
                        showMssageBox("inline_omadmStatus", "Service Fail!");
                        $("#omadmStatus").html("");
                    }

                    
                }
                break;
                
            case "2": //PRL
                if(oma_status==1){ //STARTED
                    $("#omadmStatus").html("Checking for PRL update...");
                    showButton(0);
                    _this_.doInitializeCIOMAState();
                    _this_.mOMArunnig = 1;
                }

                if (_this_.mOMACancelAttempted == 1)
                {
                    mClearSessionObj.doOMADMClearSession();     
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);
                    
                	ResetOMACancel();
                	$("#omadmStatus").html("PRL Update Cancelled!");
                    showMssageBox("inline_omadmStatus", "PRL Update Cancelled!");
                    window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                    $("#omadmStatus").html("");
                }
                
                if(oma_status != 1){ //SUCCEED or FAILED    
                    mClearSessionObj.doOMADMClearSession();  
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);
                        
                    
                    if(oma_status==2){ //SUCCEED                       
                        $("#omadmStatus").html("PRL update Complete!");
                        showMssageBox("inline_omadmStatus", "PRL update Complete!");
                        window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                        $("#omadmStatus").html("");                       
                    }else if(oma_status==4){ //FAILED
                        $("#omadmStatus").html("PRL update Fail!");
                        showMssageBox("inline_omadmStatus", "PRL update Fail!");
                        $("#omadmStatus").html("");
                    }
                }
                
                break;
                
            case "3": //FUMO
                if(oma_status==1){ //STARTED
                    $("#omadmStatus").html("Checking for Firmware update...");                                        
                    _this_.doInitializeCIOMAState();
                    _this_.mOMArunnig = 1;                    
                }

                if (_this_.mOMACancelAttempted == 1)
                    {
                        mClearSessionObj.doOMADMClearSession();
                        hideButton(0);
                        disableCancelButton(0);
                    
                    	ResetOMACancel();
                        window.clearTimeout(_this_.mCancelTimeout);
                        $("#omadmStatus").html("Firmware Update Cancelled!");
                        showMssageBox("inline_omadmStatus", "Firmware Update Cancelled!");
                        window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                        $("#omadmStatus").html("");
                }
                
                if(oma_status == 6 || oma_status == 7){  //DOWNLOAD_AVAILABLE or DOWNLOADING
                    showButton(0);
                    if (download_length > 0) {
                        var percentDownloaded;
                        percentDownloaded = Math.round(download_complete * 100 / download_length);
                        showFUMODownloadStatus(percentDownloaded);
                    }
                    else
                        $("#omadmStatus").html("Preparing Service. Please wait...");                    
                }
                else if(oma_status == 9){  //FIRMWARE_AVAILABLE
                    $("#omadmStatus").html("");
                    hideButton(0);
                    hideFUMODownloadStatus();
                    showDialog("inline_cifumo_useraction");
                    _this_.mTimeout1 = window.setTimeout("$('inline_cifumo_useraction').colorbox.close();",5000);
                    _this_.mTimeout2 = window.setTimeout("gOMAStatusObj.doOMADMUserAction(2,1);", 5000);
                }
                else if(oma_status == 11){  //FIRMWARE_AVAILABLE                    
                    $("#omadmStatus").html("Reporting update status to server...");                    
                }                
                else if(oma_status == 2 || oma_status == 3 || oma_status == 4){  //SUCCEED, CANCELED, FAILED
                    mClearSessionObj.doOMADMClearSession();
                    enableCancelButton(0);
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);
                        
                    
                    if(oma_status==2){ //SUCCEED                       
                        $("#omadmStatus").html("Firmware Update Complete!");
                        showMssageBox("inline_omadmStatus", "Firmware Update Complete!");
                        window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                        $("#omadmStatus").html("");
                        hideFUMODownloadStatus();                    
                    }else if(oma_status==4){ //FAILED                        
                        $("#omadmStatus").html("Firmware Update Fail!");
                        showMssageBox("inline_omadmStatus", "Firmware Update Fail!");
                        $("#omadmStatus").html("");
                        hideFUMODownloadStatus();
                    }
                }

                
                break;
            case "4": //NI
                if(oma_status==4 || oma_status==1){ //RECEIVED_NOTI or STARTED
                    $("#omadmStatus").html("The network is preparing  your services. Please wait...");
                    showButton(0);
                    _this_.doInitializeCIOMAState();
                    _this_.mOMArunnig = 1;
                    window.setTimeout("hideButton(2);",5000);
                }else if(oma_status==2 || oma_status==3 || oma_status==4){ //SUCCEED or CANCELED or  FAILED
                    mClearSessionObj.doOMADMClearSession();
                    enableCancelButton(0);
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);     

                    if (_this_.mOMACancelAttempted == 1)
                    {
                    	ResetOMACancel();
                        window.clearTimeout(_this_.mCancelTimeout);
                        $("#omadmStatus").html("Service Update Cancelled!");
                        showMssageBox("inline_omadmStatus", "NI Cancelled!");
                        window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                        $("#omadmStatus").html("");
                    }
                    else if(oma_status==2){ //SUCCEED                       
                        $("#omadmStatus").html("Service Update Complete!");
                        showMssageBox("inline_omadmStatus", "NI Complete!");
                        window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                        $("#omadmStatus").html("");                                           
                    }else if(oma_status==4){ //FAILED                        
                        $("#omadmStatus").html("Service Update Fail!");
                        showMssageBox("inline_omadmStatus", "NI Fail!");
                        $("#omadmStatus").html("");
                    }
                    
                }     
                break;
            case "5": //HFA
                mClearSessionObj.doOMADMClearSession();
                window.clearTimeout(_this_.mCancelTimeout);
                    
                if (_this_.mOMACancelAttempted == 1)
                {
                	mClearSessionObj.doOMADMClearSession();
                    ResetOMACancel();
                    $("#omadmStatus").html("Activation Cancelled!");
                    showMssageBox("inline_omadmStatus", "Activation Cancelled!");
                    window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                    $("#omadmStatus").html("");
                }
                else if(oma_status==2){ //SUCCEED                       
                    _this_.mHFArunnig = 0;
                    mClearSessionObj.doOMADMClearSession();
                    $("#omadmStatus").html("Device has been activated!");
                    showDialog("activation_success");
                    gHFAcomplete = 1;
                    //_this_.mNetScanTimeout = window.setTimeout("gOMAStatusObj.showNetworkScanningWaitDlg();",5000);
                    $("#omadmStatus").html("");
                    hideFUMODownloadStatus();                 
                }else if(oma_status==4){ //FAILED                        
                    _this_.mHFArunnig = 0;
                	_this_.mHFAfail = 1;
                    //close buttons
                    hideButton(0);
                    mClearSessionObj.doOMADMClearSession();
                    $("#omadmStatus").html("Activation Fail!");
                    showMssageBox("inline_omadmStatus", "Activation Fail!");
                    $("#omadmStatus").html("");
                    hideFUMODownloadStatus();
                }
                break;
            case "6": //HFA_DC
                _this_.mHFArunnig = 1;
                _this_.mHFAfail = 0;

                if(oma_status==1){ //STARTED
                    $("#omadmStatus").html("The network is preparing  your services. Please wait...");
                    showButton(0);
                    _this_.doInitializeCIOMAState();
                    _this_.mOMArunnig = 1;
                    _this_.mIsActivationInProcess = 1;
                }
                
                if(oma_status!=1){
                    _this_.mIsActivationInProcess = 0;
                    mClearSessionObj.doOMADMClearSession();
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);
                    
                    if( oma_status ==2) //SUCCEED
                    {
                        $("#omadmStatus").html("Activation in progress.");
                        showDialog("inline_hfa_dc_confirm");
                        _this_.mTimeout3 = window.setTimeout("$('inline_hfa_dc_confirm').colorbox.close();",5000);
                        //_this_.mTimeout4 = window.setTimeout("gOMAStatusObj.doOMADMUserAction(3,1);", 5000);
                        _this_.mTimeout4 = window.setTimeout("", 5000);
                    }
                }
                break;
                
            case "7": //HFA_PRL
                if(oma_status==1){ //STARTED
                    $("#omadmStatus").html("Device has been activated.\nChecking for PRL update...");
                    showButton(0);
                    _this_.doInitializeCIOMAState();
                    _this_.mOMArunnig = 1;
                }

                if (_this_.mOMACancelAttempted == 1)
                {
                    mClearSessionObj.doOMADMClearSession();
                    enableCancelButton(0);
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);
                    
                	ResetOMACancel();
                	$("#omadmStatus").html("PRL Update Cancelled!");
                    showMssageBox("inline_omadmStatus", "PRL Update Cancelled!");
                    window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                    $("#omadmStatus").html("");
                }
                
                if(oma_status != 1){ //SUCCEED or FAILED    
                    mClearSessionObj.doOMADMClearSession();
                    enableCancelButton(0);
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);
                        
                    
                    _this_.mIsActivationInProcess = 0;
                    if (oma_status == 2) //SUCCEED
                    {
                        $("#omadmStatus").html("PRL has been updated.");
                        showDialog("inline_hfa_prl_confirm");
                        _this_.mTimeout5 =window.setTimeout("$('inline_hfa_prl_confirm').colorbox.close();",5000);
                        //_this_.mTimeout6 = window.setTimeout("gOMAStatusObj.doOMADMUserAction2(3,1);", 5000);
                        _this_.mTimeout6 = window.setTimeout("", 5000);

                    }  
                }
                break;
                
            case "8": //HFA_FUMO 
                if(oma_status==1){ //STARTED
                    $("#omadmStatus").html("PRL has been updated.\nChecking for Firmware update...");
                    //showButton(6);
                    _this_.doInitializeCIOMAState();
                    _this_.mOMArunnig = 1;                    
                }

                if (_this_.mOMACancelAttempted == 1)
                    {
                        mClearSessionObj.doOMADMClearSession();
                        hideButton(0);
                    
                    	ResetOMACancel();
                        window.clearTimeout(_this_.mCancelTimeout);
                        $("#omadmStatus").html("Firmware Update Cancelled!");
                        showMssageBox("inline_omadmStatus", "Firmware Update Cancelled!");
                        window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                        $("#omadmStatus").html("");
                }
                
                if(oma_status == 6 || oma_status == 7){  //DOWNLOAD_AVAILABLE or DOWNLOADING
                    showButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);
                    if (download_length > 0) {
                        var percentDownloaded;
                        percentDownloaded = Math.round(download_complete * 100 / download_length);
                        showFUMODownloadStatus(percentDownloaded);
                    }
                    else
                        $("#omadmStatus").html("Preparing Service. Please wait...");                    
                }
                else if(oma_status == 9){  //FIRMWARE_AVAILABLE
                    hideButton(0);
                    hideFUMODownloadStatus();
                    showDialog("inline_cifumo_useraction");
                    _this_.mTimeout1 = window.setTimeout("$('inline_cifumo_useraction').colorbox.close();",5000);
                    _this_.mTimeout2 = window.setTimeout("gOMAStatusObj.doOMADMUserAction(2,1);", 5000);
                }
                else if(oma_status == 11){  //FIRMWARE_AVAILABLE                    
                    $("#omadmStatus").html("Reporting update status to server..."); 
                }
                else if(oma_status == 2 || oma_status == 3 || oma_status == 4){  //SUCCEED, CANCELED, FAILED
                    mClearSessionObj.doOMADMClearSession(); 
                    hideButton(0);
                    window.clearTimeout(_this_.mCancelTimeout);

                    if(oma_status==2){ //SUCCEED                       
                        $("#omadmStatus").html("Firmware Update Complete!");
                        showMssageBox("inline_omadmStatus", "Firmware Update Complete!");
                        window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                        $("#omadmStatus").html("");
                        hideFUMODownloadStatus();                    
                    }else if(oma_status==4){ //FAILED                        
                        $("#omadmStatus").html("Firmware Update Fail!");
                        showMssageBox("inline_omadmStatus", "Firmware Update Fail!");
                        $("#omadmStatus").html("");
                        hideFUMODownloadStatus();
                    }                       
                }
                
                break;

        }



        argv.doRefresh(argv);
       //_this_.doQueryFn();

    }

    this.doQuery = function() {

        var options = {
            successFn: _this_.doQueryCallBack,
            errorFn: function(textStatus) { _this_.doRefresh(_this_); },
            timeout: 5000,
            argv: _this_
        };


        var param;
        mQueryRpc.reset();
        mQueryRpc.addFunction("fti_OMAStatusObj_query","");
/*        
        mQueryRpc.addGet("CIOMA_STATUS");
        mQueryRpc.addFunction("cdma_info", "OMADM_ReportInfo");
        //mQueryRpc.addGet("AUTO_CONN_INIT_STATE_CIOMA");
        mQueryRpc.addGet("UPGRADE_STATUS");
*/        
        mQueryRpc.run(options);
    }

    this.setRefreshTime = function() {

        this.mRefreshTime = 1;

    }

    this.doQueryFnCallBack = function(result, argv, error) {        
        var mbHfaStarted = result[0];
        var mShowOMAResultMsg;
        mShowOMAResultMsg = result[1];
        var dsa_session = result[2];

        if(mShowOMAResultMsg == 1)
        	{_
                this_.doSetOMAFinishMsgReset(0);
                _this_.mOMArunnig = 0;

                $("#omadmStatus").html("Service Complete!");
                showMssageBox("inline_omadmStatus", "Service Complete!");
                window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                $("#omadmStatus").html("");
                hideButton(0);hideButton(3);hideButton(4);hideFUMODownloadStatus();
        	}
        else if(mShowOMAResultMsg == 2)
        	{
                _this_.doSetOMAFinishMsgReset(0);
                _this_.mOMArunnig = 0;

                $("#omadmStatus").html("Service Fail!");
                showMssageBox("inline_omadmStatus", "Service Fail!");
                $("#omadmStatus").html("");
                hideButton(0);hideButton(3);hideButton(4);hideFUMODownloadStatus();
        	}
        else if(mShowOMAResultMsg == 3)
        	{
                _this_.doSetOMAFinishMsgReset(0);
                _this_.mOMArunnig = 0;
                $("#omadmStatus").html("PRL update Complete!");
                showMssageBox("inline_omadmStatus", "PRL update Complete!");
                window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
                $("#omadmStatus").html("");
                hideButton(1);hideButton(5);hideFUMODownloadStatus();
        	}
	else if(mShowOMAResultMsg == 4)
		{
            _this_.doSetOMAFinishMsgReset(0);
            _this_.mOMArunnig = 0;
            $("#omadmStatus").html("PRL update Fail!");
            showMssageBox("inline_omadmStatus", "PRL update Fail!");
            $("#omadmStatus").html("");
            hideButton(1);hideButton(5);hideFUMODownloadStatus();
		}
	else if(mShowOMAResultMsg == 5)
		{
            _this_.doSetOMAFinishMsgReset(0);
            _this_.mOMArunnig = 0;
            $("#omadmStatus").html("Firmware update Complete!");
            showMssageBox("inline_omadmStatus", "Firmware update Complete!");
            window.setTimeout("$('inline_omadmStatus').colorbox.close();",5000);
            $("#omadmStatus").html("");
            hideButton(2);hideButton(6);hideFUMODownloadStatus();
		}
	else if(mShowOMAResultMsg == 6)
		{
            _this_.doSetOMAFinishMsgReset(0);
            _this_.mOMArunnig = 0;
            $("#omadmStatus").html("Firmware update Fail!");
            showMssageBox("inline_omadmStatus", "Firmware update Fail!");
            $("#omadmStatus").html("");
            hideButton(2);hideButton(6);hideFUMODownloadStatus();
		}
	else if(mShowOMAResultMsg == 7)
        	{
                _this_.doSetOMAFinishMsgReset(0);
                _this_.mOMArunnig = 0;
                _this_.mHFArunnig = 0;
                _this_.mIsActivationInProcess = 0;
                $("#omadmStatus").html("Device has been activated!");
                showDialog("activation_success");
                gHFAcomplete = 1;
                _this_.mNetScanTimeout = window.setTimeout("gOMAStatusObj.showNetworkScanningWaitDlg();",5000);
                $("#omadmStatus").html("");
                hideButton(0);hideButton(3);hideButton(4);hideFUMODownloadStatus();
        	}
        else if(mShowOMAResultMsg == 8)
        	{
                _this_.doSetOMAFinishMsgReset(0);
                _this_.mOMArunnig = 0;
                _this_.mHFArunnig = 0;
                _this_.mIsActivationInProcess = 0;
                $("#omadmStatus").html("Activation Fail!");
                showMssageBox("inline_omadmStatus", "Activation Fail!");
                $("#omadmStatus").html("");
                hideButton(0);hideButton(3);hideButton(4);hideFUMODownloadStatus();
        	}

         if (mbHfaStarted > 0) 
        {
        	 if (_this_.mOMArunnig == 0 && _this_.mHFAfail != 1)
        	 {
         	     _this_.mOMArunnig = 1;
          	     _this_.mHFArunnig = 1;
        	 }
			
         	 if(gConnObj.IsActivated() == 0 && _this_.mIsActivationInProcess == 0 && !( _this_.mNumOfHFAComplete > 0 && (_this_.mHFAfail == 1 ||_this_.mHFArunnig == 0 )))
         	 $("#omadmStatus").html("Contacting Network. Please wait...");

         }
    }

    this.doQueryFn = function() {


        mQueryFnRpc.reset();
        mQueryFnRpc.addFunction("fti_OMAStatusObj_QueryFn", "");
       // mQueryFnRpc.addFunction("cdma_info", "OMADM_CheckSession");
/*       
        mQueryFnRpc.addFunction("cdma_info", "OMADM_CheckHfaStart");
       mQueryFnRpc.addGet("SHOW_OMA_FINISH_MSG");
        //mQueryFnRpc.addSet("CIOMA_STATUS", "3");
        mQueryFnRpc.addGet("CONNMNG_DSA_SESSION");
*/
        mQueryFnRpc.run({ successFn: _this_.doQueryFnCallBack });
    }

	
	
	this.doSetOMAFinishMsgReset = function(value) {
	   
	    mUpdateRpc.reset();
	    mUpdateRpc.addSet("SHOW_OMA_FINISH_MSG", value);
	    mUpdateRpc.run(null);
    }

    mUpdateRpc = new RPC("ciomastate_update");
    _this_.doInitializeCIOMAState();
   // _this_.doInitializeAUTOCONNstate_CIOMA();
    $("#omadmStatus").html("");
    //this.doQueryFn();
};


DatalinkLoginObj = function(name) {
    var _this_ = this;
    var mQueryRpc = null;
    var mUpdateRpc = null;
    var mDatalinkQueryRpc = null;
    var mDatalinkScenario = 0;
    var mUsername = 0;
    var mPassword = 0;
    var mTTLSUsername = 0;
    var mTTLSPassword = 0;
    var mQueryTimer = null;
    var mRefreshTime = 2;
    var mDatalinkStatus = 0;
    var mDatalinkScenario = 0;
    var mDatalinkPermanant = 0;
    var mMip = null;
    var mDatalinkTmp = 0;
    
    this.doUpdateCallBack = function(result, argv, error) {
        wan_connect("3g");
    }

    this.doUpdateCredentialCallBack = function(result, argv, error) {
        var param;
        mip = result[0].split(',');
        if (mip.length == 11) {
            if (_this_.mDatalinkScenario == 0) //save nothing
            {
                var nai = mip[0].split('@');
                mip[0] = _this_.mUsername + "@" + nai[1]; //username
                mip[9] = str2hex(_this_.mPassword); //password
            }
            else if (_this_.mDatalinkScenario == 1) //username
            {
                mip[9] = str2hex(_this_.mPassword); //password
            }

            param = "MIP_SetDatalink=" + mip;
            mUpdateRpc.reset();
            mUpdateRpc.addFunction("cdma_info", param);
            mUpdateRpc.run({ successFn: _this_.doUpdateCallBack, argv: _this_ });
        }
    }

    this.doUpdateCredential = function(scenario, username, password) {
        _this_.mDatalinkScenario = scenario;
        _this_.mUsername = username;
        _this_.mPassword = password;

        mQueryRpc.reset();
        mQueryRpc.addFunction("cdma_info", "MIP_GetProfile=1");
//        mQueryRpc.addFunction("cdma_info", "MIP_GetDatalink");
        mQueryRpc.run({ successFn: _this_.doUpdateCredentialCallBack});
    }

    this.doSaveDoneCredentialCallBack = function(result, argv, error) {
    }

    this.doSaveCredentialCallBack = function(result, argv, error) {
        var param;
        _this_.mMip = result[0].split(',');

        if (_this_.mMip.length == 11) {

            var realm = _this_.mMip[0].split("@");
            if (_this_.mDatalinkScenario == 1) //save username
            {
                _this_.mMip[0] = _this_.mUsername + "@" + realm[1];
            }
            else if (_this_.mDatalinkScenario == 2) //save username & password
            {
                _this_.mMip[0] = _this_.mUsername + "@" + realm[1];
                _this_.mMip[9] = str2hex(_this_.mPassword); //password
            }
        }
        param = "MIP_SetProfile=1," + _this_.mMip;
        _this_.mDatalinkPermanant = 1;
        mUpdateRpc.reset();
        mUpdateRpc.addFunction("cdma_info", param);
        mUpdateRpc.addSet("DATALINK_PERMANANT", _this_.mDatalinkPermanant);
        mUpdateRpc.run({ successFn: _this_.doSaveDoneCredentialCallBack });
    }


    this.doSaveCredential = function(scenario, username, password) {
        _this_.mDatalinkScenario = scenario;
        _this_.mUsername = username;
        _this_.mPassword = password;
    
        if (_this_.mDatalinkScenario == 1 || _this_.mDatalinkScenario == 2) {
            mQueryRpc.reset();
            mQueryRpc.addFunction("cdma_info", "MIP_GetProfile=1");
            mQueryRpc.run({ successFn: _this_.doSaveCredentialCallBack });
        }
    }

    this.getDatalinkStatus = function() {
        return _this_.mDatalinkStatus;
    }

    this.getDatalinkScenario = function() {
        return _this_.mDatalinkScenario;
    }

    this.getDatalinkPermanant = function() {
        return _this_.mDatalinkPermanant;
    }

    this.checkUpdate = function() {
        if($.cookie('update_datalink') == 1)
        {
            $.cookie('update_datalink', "0");
            this.doQueryDatalink();
        }
        this.doRefresh(_this_);
    }

    this.doQueryDatalinkCallBack = function(result, argv, error) {
/*        
        argv.mDatalinkStatus = result[0];
        argv.mDatalinkScenario = result[1];
        argv.mDatalinkPermanant = result[2];
*/        
    }

    this.doQueryDatalink = function() {
        var options = {
            successFn: _this_.doQueryDatalinkCallBack,
            argv: _this_
        };

        mDatalinkQueryRpc.reset();
        mDatalinkQueryRpc.addGet("DATALINK_ENABLE");
        mDatalinkQueryRpc.addGet("DATALINK_SCENARIO");
        mDatalinkQueryRpc.addGet("DATALINK_PERMANANT");
        mDatalinkQueryRpc.run(options);
    }

    this.doUpdateDatalinkCallBack = function(result, argv, error) {
        window.top.location.reload(true);
    }

    this.doUpdateDatalink = function(value) {
        var options = {
            successFn: _this_.doUpdateDatalinkCallBack,
            argv: _this_
        };
        
        mDatalinkQueryRpc.reset();
        mDatalinkQueryRpc.addSet("DATALINK_ENABLE", value);
        if(value == "0")
        {
            mDatalinkQueryRpc.addSet("WMX_AUTH_MODE", "2"); //device authentification
            mDatalinkQueryRpc.addSet("WMX_EAP_Mode", "0"); //TLS
            mDatalinkQueryRpc.addSet("DNS_CUSTOM_ENABLE", "0");
        }
        else
        {
             mDatalinkQueryRpc.addSet("WMX_AUTH_MODE", "1"); //user authentification
            mDatalinkQueryRpc.addSet("WMX_EAP_Mode", "1"); //TTLS
        }
         mDatalinkQueryRpc.addSet("DATALINK_PERMANANT", "0");                 
         mDatalinkQueryRpc.run(options);
     }

    this.doUpdateDatalinkConfirm = function(value) {
        if(value == "1")
        {
            top.showDialogEx("inline_datalink_enable_reload", "60%", "auto"); 
        }
        else
        {
            top.showDialogEx("inline_datalink_disable_reload", "60%", "auto"); 
        }
    }  
    
    this.doRefresh = function(obj) {
        if (obj.mQueryTimer) { clearTimeout(obj.mQueryTimer); }
        obj.mQueryTimer = setTimeout(function() { obj.checkUpdate(); }, (obj.mRefreshTime * 1000));
    }

    mQueryRpc = new RPC("datalinklogin_query");
    mUpdateRpc = new RPC("datalinklogin_update");
    mDatalinkQueryRpc = new RPC("datalink_query");
    $.cookie('update_datalink', "0");
    this.doQueryDatalink();
    this.doRefresh(_this_);


};

/* -------------------------- */
/*                     GPS                     */
/* -------------------------- */
GpsNmeaObj = function (name) {
    var _this_ = this;
    var mQueryRpc = new RPC("queryNMEA");
    var mUpdateRpc = new RPC("updateNMEA");
    var mStartGpsRpc = new RPC("StartGps");
    var mUpdateGPSEnableRpc = new RPC("updateGPSEnable");
    var waitTime  = 100;
    var waitTimer = null;
    var mQueryTimer = null;
    var mRefreshTime = 2;

    var mNmeaEnable = 0;
    var mNmeaTemp = 0;
    var mIndex = 0;
    var mCheckCnt = 0;

    _this_.mIndex = 0;
    _this_.mCheckCnt = 0;
    
    this.getNMEAEnable = function() {
        return  _this_.mNmeaEnable;
    }
    
    this.doUpdateCallBack = function (result, argv, error) {
    }

    this.doUpdateGPSEnableCallBack = function (result, argv, error) {
    }
    
    this.doUpdateGPSEnable = function(value){
        var options = {
            successFn:_this_.doUpdateGPSEnableCallBack,
            timeout:3000,
            argv:_this_
        };
        var param;
        mUpdateGPSEnableRpc.reset();
        param = "GPS_SetOnOff" + "=" + value;
        mUpdateGPSEnableRpc.addFunction("cdma_info", param);        
        mUpdateGPSEnableRpc.run(options);
    }

    this.doUpdateGPSMode = function(){
        var param;

        mUpdateRpc.reset();
        param = "GPS_SetMode" + "=" + getElementValue("gps_mode");
        mUpdateRpc.addFunction("cdma_info", param);
        mUpdateRpc.run();
    }

    this.doUpdateGPSSession = function(){
        var param;

        mUpdateRpc.reset();
        param = "GPS_SetSession" + "=" + getElementValue("gps_session");
        mUpdateRpc.addFunction("cdma_info", param);
        mUpdateRpc.run();
    }

    this.doUpdateTime = function (){
        var options = {
            successFn:_this_.doUpdateNMEAEnableCallBack,
            timeout:3000,
            argv:_this_,
            errorFn: function(textStatus) {/* _this_.doTimer(); */}
        };
        
        if(waitTime == 180){
            _this_.mCheckCnt = 0;

//          $("#timeoutStr").html(waitTime);
//          showDialogEx("inline_waitnmea", "60%", "auto");
        }
        else if(waitTime > 175)
        {
            //for enabling, wait 5 sec first.
        }
        else if((waitTime % 3) == 0){
            mUpdateRpc.reset();
            /*
            mUpdateRpc.addService("do_nmea", "check");
            */
            mUpdateRpc.addFunction("fit_do_nmea_check", "");
            mUpdateRpc.run(options); 
        }
        else if(waitTime <= 0)
        {
            var obj = ifr.doc.E("nmea_enable");
            if(obj)
                ifr.doc.E("nmea_enable").checked = (_this_.mNmeaEnable=="1")? true:false; 
            
            clearInterval(waitTimer);
            $.colorbox.close(); 

            if(_this_.mNmeaEnable == 1)
                $("#nmeaStatus").html("disable");
            else
                $("#nmeaStatus").html("enable");
            showDialogEx("inline_failnmea", "60%", "auto"); 
            return;
         } 

        waitTime--;
        //$("#timeoutStr").html(waitTime);
    }

    this.doUpdateNMEAEnableCallBack = function (result, argv, error) {
        var ret = result[0].split("\n");
        var obj = ifr.doc.E("nmea_enable");
        var os = window.navigator.appVersion;

        if(_this_.mNmeaTemp == parseInt(ret[0]))
        {            
             _this_.mNmeaEnable = _this_.mNmeaTemp;
            clearInterval(waitTimer);
            $.colorbox.close(); 

			/*
            if(_this_.mNmeaEnable == 1)
            {
                mStartGpsRpc.reset();
                mStartGpsRpc.addFunction("cdma_info", "GPS_SetOnOff=1");        
                mStartGpsRpc.addFunction("cdma_info", "GPS_Control=1");        
                mStartGpsRpc.run();  

                var gps = ifr.doc.E("gps_disable");
                if(gps)
                    ifr.doc.E("gps_disable").checked = false; 
            }
			*/
        }
        if(obj)
            ifr.doc.E("nmea_enable").checked = (_this_.mNmeaEnable=="1")? true:false; 
/*        
        else
        {
            if(_this_.mNmeaEnable == 1)
                $("#nmeaStatus").html("disable");
            else
                $("#nmeaStatus").html("enable");
          showDialogEx("inline_failnmea", "60%", "auto"); 
         }
*/

    }


    this.doUpdateNMEAEnable = function(value ){
        var options = {
            timeout:3000,
            argv:_this_
        };       
         if(_this_.mNmeaEnable == value)
            return;
        _this_.mNmeaTemp = parseInt(value);

        mUpdateRpc.reset();
        if(value == "1")
        {
/*        
            mUpdateRpc.addFunction("nmea_enable", "enable");            
*/            
            mUpdateRpc.addFunction("fti_nmea_enable", "1");
            $("#nmeaWait").html("enabled");
            mUpdateRpc.run();
        }
        else
        {
/*        
            mUpdateRpc.addFunction("nmea_enable", "disable");
*/          
            mUpdateRpc.addFunction("fti_nmea_enable", "0");
            mUpdateRpc.run();
            $("#nmeaWait").html("disabled");
           showDialogEx("inline_waitnmea", "50%", "auto");
            _this_.mIndex = 1;
        }
        //waitTime = 100; //for U602
        waitTime = 180; //for U770
        waitTimer = setInterval( function () { _this_.doUpdateTime();} , 1000 ); 
    }


    this.doConfirmNMEA = function( ){
            top.showDialogEx("inline_nmea", "50%", "auto");
    }

    this.doQueryCallBack = function (result, argv, error) {
        /* mypark
        _this_.mNmeaEnable = parseInt(result[0]);
        */
        /*
        var obj = ifr.doc.E("nmea_enable");
        if(obj)
            ifr.doc.E("nmea_enable").checked = (_this_.mNmeaEnable=="1")? true:false; */
     }

    this.doQuery = function() {
        mQueryRpc.reset();
        mQueryRpc.addService("do_nmea", "check");
        mQueryRpc.run({successFn:_this_.doQueryCallBack});
    }

     _this_.doQuery();

};


/* -------------------------- */
/*                  RTN                       */
/* -------------------------- */
var rebootTime = 100;
var rebootTimer = null;
function reload_page2() {
    if (--rebootTime <= 0) {
        clearInterval(rebootTimer);
        parent.location.href = parent.location.href;
    } 
}

RefurObj = function (name) {
    var _this_ = this;
    var mQueryRpc = new RPC("rtn_query");
    var mRefurbishRpc = new RPC("rtn_update");

    this.doRefurbishConfirm = function() {
        top.showDialogEx("inline_factoryconf", "60%", "150px");
    }

    this.doRefurbish = function() {
        
        rebootTime = 110;
        top.showDialog("inline_sysreload","80%","auto");
        rebootTimer = setInterval( function () { reload_page2();} , 1000 );
        mRefurbishRpc.reset();
/*        
        mRefurbishRpc.addService("sleep", "10");
        mRefurbishRpc.addFunction("system_cfg", "factory");
        mRefurbishRpc.addService("rm_ftisku_ver");
        mRefurbishRpc.addService("rm_nmea_conf");
        mRefurbishRpc.addFunction("cdma_info", "Refurbish");
        mRefurbishRpc.addService("reboot", "2");
*/
        mRefurbishRpc.addFunction("fti_equip_rtn_set", "");
        mRefurbishRpc.run(null);
    }
};


/* -----------------------------*/
/*            CIOMA-DM                       */
/*-----------------------------*/

CIOMA_Obj = function () {
    var _this_ = this;
    var mUpdateRpc = null;
    var mQureyRpc = null;
    var mConnectivity = 0;
    var connectivityCheckInterval = null;
    var intervalBeforeCIOMA = null;
    var dotNumber = 0;
    var dotString = "";
    var selectedOption = "0";
    var count = 0;
    
    this.select_option = function(value)
    {
        selectedOption = value;
//  alert(selectedOption);
    }

    this.doOMADMStartCallBack = function (result, argv, error) {

    }

    this.doOMADMStart= function() {
        var param;

        var is3GLPM = top.gConnObj.Is3GLPM();
        var session = selectedOption;
        var isApMode = top.gConnObj.IsAPMODE();

        if(isApMode == 1)
        {
            showDialog("inline_apmode_enable");
            return ;
        }

        if (top.gConnObj.getStatus("3g") == "Connected" || top.gConnObj.getStatus("3g") == "Connecting" || is3GLPM == 1)
        {
            showDialog("inline_disconnect_data_query");
        }
        else
        {
            mUpdateRpc.reset();
            param = selectedOption;
            mUpdateRpc.addFunction("fti_omadm_start",  param);
            mUpdateRpc.run({successFn:_this_.doOMADMStartCallBack});
//            _this_.doUpdateCIOMAStatus(session);
        }
    }

    this.doDisconnect = function(){
        if(top.gConnObj.getStatus("3g") == "Connected" || top.gConnObj.getStatus("3g") == "Connecting")
        top.gConnObj.doAction("3g");
    }

    this.doOMADMStart2CallBack = function (result, argv, error) {

    }
    
    this.setConnectivityValue = function()
    {
        mConnectivity = 2;
    }
    
    this.checkStartCIOMA = function() {
        if(count < 3)
            ++count;
        else
        {
            clearInterval(intervalBeforeCIOMA);
            count = 0;
            _this_.doOMADMStart2();
        }
    }

    this.checkConnectivity = function() {
        if (top.gConnObj.getStatus("3g") == "Connected" || top.gConnObj.getStatus("3g") == "Connecting" ||  top.gConnObj.getStatus("3g") == "Disconnecting")
        {
            mConnectivity = 1;
            if (top.gConnObj.getStatus("3g") == "Disconnecting")
            top.gConnObj.doUpdateAutoconn("0", "0");
            else
            _this_.doDisconnect();

        }
        else
        {
            var is3GLPM = top.gConnObj.Is3GLPM();
            if(is3GLPM == 1 )
            {
                top.gConnObj.doLPMAction("3g on");
                return;
            }
            else if (top.gConnObj.getStatus("3g") != "Disconnected")
                return;
            else
                mConnectivity = 2;
        }

        if (mConnectivity == 2)
        {
            dotNumber = 0;
            clearInterval(connectivityCheckInterval);
            intervalBeforeCIOMA = setInterval(function(){_this_.checkStartCIOMA()}, 1000);			 	
        }
    }

    this.showWaitDlg = function(){
        top.showDialogEx("inline_data_disconnect_wait", "60%", "auto");
    }

    this.checkBeforeCIOMAstart = function(){
        _this_.showWaitDlg();

        if (top.gConnObj.getStatus("3g") == "Connected" || top.gConnObj.getStatus("3g") == "Connecting")
            _this_.doDisconnect();
        
        connectivityCheckInterval = setInterval(function() {_this_.checkConnectivity();},1000);
    }

    this.doOMADMStart2= function() {
        top.$.colorbox.close();			
        var session = selectedOption;
        
        mUpdateRpc.reset();
        param = "OMADM_Start" + "=" + selectedOption;
        mUpdateRpc.addFunction("cdma_info", param);
        if (session == 0)
            mUpdateRpc.addSet("CIOMA_STATUS", "1");
        else if (session == 1)
            mUpdateRpc.addSet("CIOMA_STATUS", "2");
        else if (session == 2)
            mUpdateRpc.addSet("CIOMA_STATUS", "3");

        mUpdateRpc.run({successFn:_this_.doOMADMStart2CallBack});
//        _this_.doUpdateCIOMAStatus(selectedOption);
    }
    
    mUpdateRpc = new RPC("cdmainfo_omastart");
    mQureyRpc = new RPC("cioma_status_query");
};


UsimPinCodeObj = function() {
	var _this_ = this;
	var mQueryRpc = new RPC("usim_query");
	var mUpdateRpc = new RPC("usim_update");
    var valid_puk_code = "";

	this.doBlock = function() {
        top.location.href = "/block.html";
    }

    this.doQueryNewPinCodeCallBack = function(result, argv, error) {
    }

    this.doQueryNewPinCode = function() {
        var param;
        if (getElementValue("main_new_pin_code") == "") {
                showMssageBox("inline_msgbox", "PIN code not set.");
                return;
        }
        if (getElementValue("main_new_pin_code") != getElementValue("cfm_new_pin_code")) {
            showMssageBox("inline_msgbox", "PIN code do not match.");
            return;
        }
        param = _this_.valid_puk_code + "|" + doc.E("main_new_pin_code").value;
        mQueryRpc.reset();
        mQueryRpc.addFunction("fti_usim_new_pin_code",  param);
        mQueryRpc.run({successFn:_this_.doQueryNewPinCodeCallBack});		
    }

    this.doQueryPukCodeCallBack = function(result, argv, error) {
        if(result.length != 3 ){
            _this_.doRefresh(_this_);
            return;
        }
        var success = result[0];
        var cnt = result[1];

        if( success == 0) {
            if(cnt > 0){
                _this_.initial();
                //top.location.href = "/rpc.asp";
            }else{
                _this_.doBlock();       
            }
//            _this_.initial();
        }else{
            //_this_.valid_puk_code = doc.E("main_puk_code").value;
            top.$.colorbox.close();            
            //showDialogLogin("inline_new_pin_code","60%", "auto");
        }
    }	

    this.doQueryPukCode = function() {
        var param;
        var pin_code = doc.E("main_puk_new_pin_code").value;
        var puk_code = doc.E("main_puk_code").value;

        if(puk_code.length == 0){
            showDialog("inline_pukcode_not_set");
            return;            
        }

        if(puk_code.length > 8){
            showDialog("inline_pukcode_not_valid");
            return;            
        }
        
        if(pin_code.length == 0){
            showDialog("inline_pincode_not_set");
            return;
        }
        
        
        param = doc.E("main_puk_code").value + "|" + doc.E("main_puk_new_pin_code").value;
        mQueryRpc.reset();
        mQueryRpc.addFunction("fti_usim_puk_code_check",  param);
        mQueryRpc.run({successFn:_this_.doQueryPukCodeCallBack});		
    }

    this.doQueryPinCodeCallBack = function(result, argv, error) {
        var success = result[0];
        var cnt = result[1];

        if( success == 0) {
            _this_.initial();            
           //top.location.href = "/";
        }else{
           top.$.colorbox.close();           
        }
    }   

    this.doQueryPinCode = function() {
        mQueryRpc.reset();
        mQueryRpc.addFunction("fti_usim_pin_code_check",  doc.E("main_pin_code").value);
        mQueryRpc.run({successFn:_this_.doQueryPinCodeCallBack});		
    }

    this.doinitialCallBack = function(result, argv, error) {
        if(result.length != 4 ){
            _this_.initial();
            return;
        }
        var enable_pin_lock = result[0];
        var enable_pin_code_cnt = result[1];
        var enable_puk_code_cnt = result[2];

        // enable_pin_lock - 0:disable, 1:enable_not_verified, 2:enable_verified, 3: block,4:permanently blocked
	var times_txt;
		
        if(enable_pin_lock == 1) {
            if(enable_pin_code_cnt ==1)
	        times_txt = window.lang.convert("time remained", top.default_lang);
            else
	        times_txt = window.lang.convert("times remained", top.default_lang);

    	    $("#main_pin_code_cnt").html(enable_pin_code_cnt + " " + times_txt);            
                doc.E("main_pin_code").value ="";
            showDialogPinCodeMain("inline_pin_code_lock","60%", "auto");       
        }
        else if(enable_pin_lock == 2) {
        }
        else if(enable_pin_lock == 3) {
            if(enable_puk_code_cnt ==1)
	        times_txt = window.lang.convert("time remained", top.default_lang);
            else
	        times_txt = window.lang.convert("times remained", top.default_lang);

    	    $("#main_puk_code_cnt").html(enable_puk_code_cnt + " " + times_txt);            

                    doc.E("main_puk_code").value ="";
                    doc.E("main_puk_new_pin_code").value ="";
            showDialogPukCodeMain("inline_puk_code_lock","60%", "auto");
//            showDialogPinBlock("inline_pincode_block","60%", "auto");
            //$.colorbox({inline:true, width:'60%', scrolling:false, overlayClose:false, opacity:0.4, href:'#inline_pincode_block', escKey:false});
            
            }			
        else if(enable_pin_lock == 4) {
            _this_.doBlock();
        }		
    }
	
	this.initial = function() {		
        mQueryRpc.reset();
        mQueryRpc.addFunction("fti_usim_pin_lock_get",  "");
        mQueryRpc.run({successFn:_this_.doinitialCallBack});
		
        doc.E("main_pin_code").value ="";
        doc.E("main_puk_code").value ="";
        doc.E("main_puk_new_pin_code").value ="";
		
    }

    this.initial();
};


AutoUpgradeObj = function (name) {
    var _this_ = this;
    mUpdateRpc   = new RPC("auto_upgrade_update");

    
    this.doDownloadCallBack = function (result, argv, error) {
        top.showUpgradeDlg();
    }
    
    this.doDownload = function () {
        //window.location.href = fw_url;
        var options = {
            successFn:_this_.doDownloadCallBack,
            timeout:5000,
            argv:_this_
        };

        var status_3g = top.gConnObj.getStatus("3g");
        var status_lte = top.gConnObj.getStatus("LTE");

        if((status_3g != "Connected") && (status_lte != "Connected"))
        {
            top.showDialogEx("inline_data_off", "40%", "auto");
            return ;
        }        
        
        mUpdateRpc.reset();
        mUpdateRpc.addFunction("fti_do_upgrade_device","");
        mUpdateRpc.run(options);
    }

    this.doBatteryCheckCallBack = function (result, argv, error) {
		//_this_.doDownload();
		var isEnough = result[0];

		if (isEnough == "1")
		{
			//alert("upgrading is possible");
			_this_.doDownload();
		}
		else
		{
			top.showDialogEx("inline_Battery_not_Enough", "50%", "auto");
		}

    }

	this.doBatteryCheck = function () {
        var options = {
            successFn:_this_.doBatteryCheckCallBack,
            timeout:5000,
            argv:_this_
        };

        mUpdateRpc.reset();
        mUpdateRpc.addFunction("fti_do_battery_check","");
        mUpdateRpc.run(options);

	}

    this.doDownloadPC = function () {
        window.location.href = fw_url;
    }
        
};

SMSNewMsgObj = function (name){
    var _this_ = this;
    var mQueryTimer  = null;
    var mQueryRpc = new RPC("check_new_msg");
    var mConfirmRpc = new RPC("confirm_new_msg");
    var mUnreadMsgCnt = 0;
    
    this.doConfirmNewMsgCB = function(result, argv, error)
    {
        var str_msg;
        if (_this_.mQueryTimer) { clearTimeout(_this_.mQueryTimer); }

        if(result[0] == "0") //success
        {
            _this_.mQueryTimer = setTimeout(function() { _this_.initial(); }, 5000);
            //alert("Confirmed");
        }
        else
        {
            str_msg = " Confirm Message error(" + result[0] + ")";
            alert(str_msg);
            _this_.mQueryTimer = setTimeout(function() { _this_.initial(); }, 5000);
        }
    }

    this.doConfirmNewMsgErr = function()
    {
        _this_.initial();
    }
    
    this.doConfirmNewMsg = function()
    {
        var options = {
            successFn:_this_.doConfirmNewMsgCB,
            timeout:5000,
            errorFn: function(textStatus) {_this_.doConfirmNewMsgErr(); },
            argv:_this_
        };
        
        mConfirmRpc.reset();
        mConfirmRpc.addFunction("fti_wms_confirm_new_msg",  "");
        mConfirmRpc.run(options);
    }
    this.doChkNewMsg = function(result, argv, error)
    {
        var str_msg;
        if (_this_.mQueryTimer) { clearTimeout(_this_.mQueryTimer); }

        _this_.mUnreadMsgCnt = result[1];
        //$("#sms_cnt").html("Unread message : " + _this_.mUnreadMsgCnt);
        if(result[0] == "0") //there is no new message
        {
            if(_this_.mUnreadMsgCnt == 0)
            {
                $("#loginsms").attr("src", "img/sms.png");
                $("#loginsms").attr("style", "display:none");
                $("#logoutsms").attr("src", "img/sms.png");
                $("#logoutsms").attr("style", "display:none");
            }
            else
            {
                $("#loginsms").attr("src", "img/sms.png");
                $("#loginsms").attr("style", "cursor:pointer");
                $("#logoutsms").attr("src", "img/sms.png");
                $("#logoutsms").attr("style", "cursor:pointer");
            }
        }
        else
        {
            $("#loginsms").attr("src", "img/smsnew.gif");
            $("#loginsms").attr("style", "cursor:pointer");
            $("#logoutsms").attr("src", "img/smsnew.gif");
            $("#logoutsms").attr("style", "cursor:pointer");
        }
        if(_this_.mUnreadMsgCnt == 0)
        {
            $("#loginsms").attr("src", "img/sms.png");
            $("#loginsms").attr("style", "display:none");
            $("#logoutsms").attr("src", "img/sms.png");
            $("#logoutsms").attr("style", "display:none");
        }
        else
        {
            if(result[0] == "0") //there is no new message
            {
                $("#loginsms").attr("src", "img/sms.png");
                $("#loginsms").attr("style", "cursor:pointer");
                $("#logoutsms").attr("src", "img/sms.png");
                $("#logoutsms").attr("style", "cursor:pointer");
                _this_.mQueryTimer = setTimeout(function() { _this_.initial(); }, 5000);
            }
            else
            {
                str_msg = " New Message.";
                str_msg = result[0] + str_msg;
                $("#loginsms").attr("src", "img/smsnew.gif");
                $("#loginsms").attr("style", "cursor:pointer");

                //alert(str_msg);
                //If user confirm the new message notification, restart the timer.
                //_this_.mQueryTimer = setTimeout(function() { _this_.initial(); }, 5000);
                //_this_.doConfirmNewMsg()
            }
        }
        _this_.mQueryTimer = setTimeout(function() { _this_.initial(); }, 5000);
    }

    this.doChkNewMsgErr = function()
    {
        _this_.initial();
    }
    this.initial = function() 
    {
        var options = {
            successFn:_this_.doChkNewMsg,
            timeout:5000,
            errorFn: function(textStatus) {_this_.doChkNewMsgErr(); },
            argv:_this_
        };
        
        mQueryRpc.reset();
        mQueryRpc.addFunction("fti_wms_chk_new_msg",  "");
        mQueryRpc.run(options);
    }
    
    this.initial();
}

