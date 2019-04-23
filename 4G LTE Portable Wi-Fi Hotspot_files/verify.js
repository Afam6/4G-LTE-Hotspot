function check_num(value) {
    var ret = value.match(/^\d+(\.\d+)?$/);
    if (!ret) {
        return value + ' is not a number';
    }
    return null;
}

function check_range(value,min,max) {
    var err_msg = check_num(value);
    if (err_msg != null) return err_msg;
  
    if (!isNaN(value) && value >= min && value <= max) {
        return null;
    }
    return value + " is out of range (it must be between " + min + " and " + max + ").";
}

function check_ip(value) {
    if (value == "") {
        return 'NULL is not a valid IP address.';
    }

    var ipArray = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipArray == null) {
        // don't match ip pattern
        return value + ' is not a valid IP address.';
    } else {
        for (i = 1; i < 5; i++) {
            if (check_range(ipArray[i],0,255) != null){
                return value + ' is not a valid IP address.';
            }
        }
    }
    return null;
}

function check_ipmask(value) {
    var maskArray = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (maskArray && maskArray.length == 5 && 
        check_range(maskArray[1], 0, 255) == null && check_range(maskArray[2], 0, 255) == null && check_range(maskArray[3], 0, 255) == null && check_range(maskArray[4], 0, 255) == null)
    {
        var lastBit = 1;
        var count = 0;

        for (var i = 1; i < 5; i++) {
            var mask = parseInt(maskArray[i], 10);
            for (var j = 7; j >= 0; j--) {
                var n = Math.pow(2,j);
                var bitOn = (mask & n) ? 1 : 0;
                if (lastBit != bitOn) {
                    lastBit = bitOn;
                    if (count == 1) 
                        return value + ' is not a valid IP Mask address.';
                    count++;
                }
            }
        }
    } else {
        return value + ' is not a valid IP Mask address.';
    }

    return null;

}

function check_mac(value) {
    var ret = value.match(/^([0-9a-fA-F]{2}:){5}([0-9a-fA-F]){2}$/);
    if (!ret || value == '00:00:00:00:00:00') {
        return value + ' is not a valid MAC address(XX:XX:XX:XX:XX:XX).';
    }
    return null;
}

function check_text(value, type) {
    if (type == "NonComma") {
        var ret = value.match(/^[^,]*$/);
        if (!ret) {
            return "'" + value + "' must be a no-comma string.";
        }
    } else if (type == "Alnum") {
        var ret = value.match(/^[A-Za-z][A-Za-z0-9]*$/);
        if (!ret) {
            return "'" + value + "' must be a no-comma string.";
        }
    }
    
    return null;
}

function VERIFY_VALUE(id, type, argv) {  
    var name  = "#" + id;
    var value = $(name).attr('value');
    var err_msg = null;
    //alert("==> name = " + $(name).attr('name') + ", type = " + type + ", argv = " + argv + ", value = "+value);
    
    if (type == "IP") {
        err_msg = check_ip(value);
    } else if (type == "IPMASK") {
        err_msg = check_ipmask(value);
    } else if (type == "MAC") {
        err_msg = check_mac(value);
    } else if (type == "INT") {
        if (argv != "" && argv != null) {
            var argv = argv.split("-");
            err_msg = check_range(value,parseInt(argv[0]),parseInt(argv[1]));
        } else {
            err_msg = check_num(value);
        }
    } else if (type == "TEXT") {
        err_msg = check_text(value, argv);
    }
    
    /*
    if (err_msg != null) {
        var verify = type;;
        if (argv != "" && argv != null) {
            veriy = type + ":" + argv;
        }
        $("input").each(function() {
            if ($(this).attr("value") == value && $(this).attr("verify") == verify) {
                $(this).css("background-color", "#cc0000");
            }
        });
    }
    $(name).css("background-color", "#ffffff");
    */
    
    return err_msg;
}

function VERIFY(obj) {
    var verify = $(obj).attr('verify');
    if (verify != "" && verify != null) {
        var types = verify.split(":");
        return VERIFY_VALUE($(obj).attr('id'), types[0], types[1]);
    }
    return null;
}

var __verify_tmp_index = 1;
function v_Field(elem)
{
    var id = $(elem).attr('id');
    if (id == "" || id == null) {
        id = "__verify_tmp_id_" + __verify_tmp_index++;;
        $(elem).attr('id', id);
    }
    var err_msg = VERIFY(elem);
    if (err_msg == null) {
        return true;
    }
    if (typeof dialogErrorBox == "function") {
        dialogErrorBox("<b>Your entered is incorrect, please check it.</b><br /><br /> Error message : " + err_msg);
    } else {
        alert("Your entered is incorrect, please check it.\nError message : " + err_msg);
    }
    return false;
}
