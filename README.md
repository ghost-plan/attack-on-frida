# attack-on-frida

## get start
- npm install
- hook

  - inject

    ```
    adb shell "su -c /data/local/tmp/frida-server"
    frida -U(-D d2d9503e) -f com.electrolytej.app --no-pause -l _index.js
    ```

  - embedded

    `frida -U (-D d2d9503e) Gadget -l _index.js`

- npm run watch

## object

objection -d -g com.electrolytej.app explore

> memory list modules
> memory list exports libsigchain.so
> android heap search instances 类名
> android hooking list activities/services
frida -D d2d9503e -f com.electrolytej.titan --no-pause -l _index.js
