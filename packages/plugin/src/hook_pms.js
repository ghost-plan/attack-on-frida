import { getFieldValue,setFieldValue } from "@attack/core";
import {js_log, j_v, j_debug, j_info, j_warn, j_error, c_v, c_debug, c_info, c_warn, c_error,} from "@attack/core";
Java.perform(function () {
    // js_log("attack", "hook pms!");
    var ApplicationPackageManager = Java.use('android.app.ApplicationPackageManager')
    var origin_getPackageInfo = ApplicationPackageManager.getPackageInfo.overload("java.lang.String", "int")
    origin_getPackageInfo.implementation = function (...args) {
        js_log("attack", "Inside getPackageInfo");
        var packageInfo = origin_getPackageInfo.call(this, ...args)

        var StringBuilder = Java.use('java.lang.StringBuilder')
        var sb = StringBuilder.$new("hook getpackageinfo before:")
        sb.append(args[0])
        sb.append('\t')
        sb.append(args[1])
        sb.append('\t')
        sb.append(getFieldValue(packageInfo, 'firstInstallTime'))
        sb.append('\t')
        sb.append(getFieldValue(packageInfo, 'lastUpdateTime'))
        js_log("attack", sb.toString());
        if ("com.ss.android.ugc.aweme" == args[0] && args[1] == 64.0) {
            //'android.content.pm.PackageInfo'
            var Long = Java.use('java.lang.Long')
            setFieldValue(packageInfo, 'firstInstallTime', Long.valueOf(1))
            setFieldValue(packageInfo, 'lastUpdateTime', Long.valueOf(1))
        }
        var StringBuilder = Java.use('java.lang.StringBuilder')
        var sb1 = StringBuilder.$new("hook getpackageinfo after:")
        sb1.append(args[0])
        sb1.append('\t')
        sb1.append(args[1])
        sb1.append('\t')
        sb1.append(getFieldValue(packageInfo, 'firstInstallTime'))
        sb1.append('\t')
        sb1.append(getFieldValue(packageInfo, 'lastUpdateTime'))
        js_log("attack", sb1.toString());
        return packageInfo
    };
//    var IPackageManager = Java.use('android.content.pm.IPackageManager.Stub')
//    IPackageManager.getPackageInfo.overload("java.lang.String", "int", "int").implementation = function (...args) {
//        js_log("attack", "IPackageManager getPackageInfo")
//        return this.getPackageInfo(args[0], args[1], args[2])
//    }

});