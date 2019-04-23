RPC = function (name) {
    var _this_ = this;
    this.mName = name;
    this.mPostData = null;
    this.mBindData = null;
    this.mTypeData = null;
    this.mDoSet = 0;

    this.reset = function () {
        _this_.mBindData = null;
        _this_.mBindData = new Object();
        
        _this_.mTypeData = null;
        _this_.mTypeData = new Object();

        _this_.mPostData = null;
        _this_.mPostData = new Object();
        _this_.mPostData['COUNT'] = 0;
        _this_.mPostData['WWW_SID'] = window.sid;
    };
    this.reset();

    this.run = function (options) {
        var bindData = _this_.mBindData;
        var formName = _this_.mName;
        var afterCb = null;
        var errorCb = null;
        var timeout = 30000;
        var argv = null;
        
        if (options) {
            if (typeof options.successFn == "function") {
                afterCb = options.successFn;
            }
            if (typeof options.errorFn == "function") {
                errorCb = options.errorFn;
            }
            if (options.timeout) {
                timeout = options.timeout;
            }
            if (options.argv) {
                argv = options.argv;
            }
        }

        var options = {
            type: 'POST',
            url: "/rpc.asp",
            data: _this_.mPostData,
            dataType: 'xml',
            timeout: timeout,
            error: function(xhr, status, err) {
                if (typeof errorCb == "function") {
                    errorCb(status);
                }
            },
            complete: function(xhr, status) {
            },
            success: function(data, status, xhr) {
                if (typeof xhr.responseText != "undefined") {
                    var xml = xhr.responseText.replace(/<result>/g, "").replace(/<\/root>/g, "").replace(/<root>/g, "");
                    var result = xml.split("</result>");
                    for (var i = 0 ; i<result.length ; ++i) {
                        var bind = bindData[i+1];
                        if (bind != null) {
                            if (typeof bind == "string") {
                                if (typeof setElementValue == "function") {
                                    setElementValue(bind, result[i]);
                                }
                            } else {
                                bind[0](bind[1], result[i]);
                            }
                        }
                    }
                } else {
                    var result = [];
                    $('result', responseXML).each(function(){
                        result.push($(this).text().replace(/\\r/g, "\r"));
                    });
                }
        
                if (typeof afterCb == "function") {
                    afterCb(result, argv, "");
                }

                bindData = null;
                afterCb = null;
                errorCb = null;
            }
        };

        $.ajax(options);
    };

    this.addItem = function(act, name, value, type, bind) {
        var count = _this_.mPostData.COUNT + 1;
        _this_.mPostData['COUNT'] = count;
        _this_.mPostData['ACTION_'+count] = act;
        _this_.mPostData['NAME_'+count] = name;
        _this_.mPostData['VALUE_'+count] = value;

        _this_.mBindData[count] = bind;
        _this_.mTypeData[count] = type;
    }
              
    this.addGet = function (name, func) {
        return this.addItem("sncfgGet", name, null, null, func);
    };
    
    this.addSet = function (name, value, type) {
        _this_.mDoSet = 1;
        return this.addItem("sncfgSet", name, value, type);
    };
    
    this.addSetEx = function (name, field, type) {
        _this_.mDoSet = 1;
        return this.addItem("sncfgSet", name, getElementValue(field), type);
    };
    
    this.addService = function (name, argv, func) {
        return this.addItem("service", name, argv, null, func);
    };
    
    this.addFunction = function (name, argv, func) {
        return this.addItem("function", name, argv, null, func);
    };
};

RPCFile = function (table,name) {
    var _this_ = this;
    var str = "";
    this.mFormName = table+'_FileUploadForm';
    this.mFramName = table+'_UploadTarget';
    this.mAfterSubmit = null;
    this.mArgv = null;
    
    str += '<form id="'+this.mFormName+'" method="post" enctype="multipart/form-data" action="/rpcex.cgi" target="'+this.mFramName+'">';
    str += '<input name="WWW_SID"  type="hidden" value="'+window.sid+'" />';
    str += '<input name="COUNT"    type="hidden" value="1" />';
    str += '<input name="ACTION_1" type="hidden" value="upload" />';
    str += '<input name="NAME_1"   type="hidden" value="'+name+'" />';
    str += '<input name="VALUE_1"  type="file" />';
    str += '<iframe id="'+this.mFramName+'" name="'+this.mFramName+'" src="" style="display:none;">';
    str += '</iframe></form>';
    $("#"+table).html(str);
	  
    this.uploadCompleted = function() {
        if (typeof _this_.mAfterSubmit == "function") {
            var data = $('#'+_this_.mFramName).contents().text();
            var result = data;
            var s = data.indexOf("<result>");
            var e = data.indexOf("</result>");
            if (s >= 0 && e >= 0) {
                result = data.substring(s+8,e);
            }
            if (result == "ok") {
                _this_.mAfterSubmit("success", _this_.mArgv);
            } else {
                _this_.mAfterSubmit("error", _this_.mArgv);
            }
        }
    };
    
	  this.run = function (options) {
        _this_.mAfterSubmit = null;
        _this_.mArgv = null;
        
        if (typeof options.successFn == "function") {
            _this_.mAfterSubmit = options.successFn;
        }
        if (options.argv) {
            _this_.mArgv = options.argv;
        }
	      
	      var iframe = document.getElementById(_this_.mFramName);
	      if (iframe.attachEvent){ 
	          iframe.attachEvent("onload", _this_.uploadCompleted);
        } else {
            iframe.onload = _this_.uploadCompleted;
        }
	      document.forms[_this_.mFormName].submit();
	  };
};

