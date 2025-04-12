# 动态注入

下载地址：https://github.com/frida/frida/releases
inject 模式: frida-server-16.7.3-xxx
embedded 模式: frida-gadget-16.7.3-xxx


## objection：apk 重打包

objection -d -g com.electrolytej.app explore

> memory list modules

> memory list exports libsigchain.so

> android heap search instances 类名

> android hooking list activities/services

frida -D d2d9503e -f com.electrolytej.titan --no-pause -l _index.js

objection patchapk --source xx.apk --gadget-config config.json

[//]: # (## LIEF:修改 so)

todo:
宿主重编译
  1. 下载应用
  2. 代码插桩