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

