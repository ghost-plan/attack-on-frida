import { hookRegisterNatives } from "./utils/hooker";

Java.perform(function () {
    var Log = Java.use("android.util.Log");
    Log.v("attack", "I'm in the process!");

    var ApplicationPackageManager = Java.use('android.app.ApplicationPackageManager')
    var origin_getPackageInfo = ApplicationPackageManager.getPackageInfo.overload("java.lang.String", "int")
    origin_getPackageInfo.implementation = function (...args) {
        Log.v("attack", "Inside getPackageInfo");
        var packageInfo = origin_getPackageInfo.call(this, ...args)

        var StringBuilder = Java.use('java.lang.StringBuilder')
        var sb = StringBuilder.$new("hook getpackageinfo defore:")
        sb.append(args[0])
        sb.append('\t')
        sb.append(args[1])
        sb.append('\t')
        sb.append(getFieldValue(packageInfo, 'firstInstallTime'))
        sb.append('\t')
        sb.append(getFieldValue(packageInfo, 'lastUpdateTime'))
        Log.v("attack", sb.toString());
        if ("com.electrolytej.spacecraft.debug" == args[0] && args[1] == 64.0) {
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
        Log.v("attack", sb1.toString());
        return packageInfo

    };
    var PackageManagerService = Java.use('com.android.server.pm.PackageManagerService')
    PackageManagerService.getPackageInfo.overload("java.lang.String", "int", "int").implementation = function (...args) {
        Log.v("attack", "PackageManagerService getPackageInfo")
        return this.getPackageInfo(args[0], args[1], args[2])
    }
    var IPackageManager = Java.use('android.content.pm.IPackageManager.Stub')
    IPackageManager.getPackageInfo.overload("java.lang.String", "int", "int").implementation = function (...args) {
        Log.v("attack", "IPackageManager getPackageInfo")
        return this.getPackageInfo(args[0], args[1], args[2])
    }

});