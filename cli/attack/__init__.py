import objection


def inject_mobile():
    """
    下载地址：https://github.com/frida/frida/releases
        inject 模式: frida-server-16.7.3-xxx
        embedded 模式: frida-gadget-16.7.3-xxx
    Returns:

    """
    pass


def embedded_apk():
    """
    objection：apk 重打包
    objection patchapk --source douyin.apk --target-class com.ss.android.ugc.aweme.main.MainActivity

    objection patchapk --source douyin.apk --target-class com.ss.android.ugc.aweme.app.host.AwemeHostApplication --skip-resources --ignore-nativelibs  --gadget-version 16.7.19 --pause
    - 需要手动复制资源到 build，因为资源文件被混淆，不能重新打包
    - frida gadget与 frida tools大版本要一致，比如 16.xx,xx or 17.xxx，才能建立通信运行起来。
    - find . -name ".DS_Store" -delete

    objection：apk 运行
    objection -d -g com.ss.android.ugc.aweme explore

    > memory list modules

    > memory list exports libsigchain.so

    > android heap search instances 类名

    > android hooking list activities/services
    Returns:
    """

    pass


def run_script():
    """
      - inject

    ```
    adb shell "su -c /data/local/tmp/frida-server"
    frida -U(-D d2d9503e) -f com.electrolytej.app --no-pause -l _index.js
    ```

  - embedded

    `frida -U (-D d2d9503e) Gadget -l _index.js`
    Returns:

    """
    pass


if __name__ == '__main__':
    # objection.
    pass
