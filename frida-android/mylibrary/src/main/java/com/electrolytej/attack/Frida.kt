package com.electrolytej.attack

import android.content.Context

object Frida {
    init {
        System.loadLibrary("gadget")
    }

    fun init(context: Context) {
        // 在需要的时候注入代码
//        Frida.getScriptEngine().eval("""
//    Java.perform(function() {
//        // 你的 Frida 代码
//    });
//""");
//        try {
//            getAssets().open("script.js").use { `is` ->
//                val script: String = Scanner(`is`).useDelimiter("\\A").next()
//                Frida.getScriptEngine().eval(script)
//            }
//        } catch (e: IOException) {
//            e.printStackTrace()
//        }
    }
}