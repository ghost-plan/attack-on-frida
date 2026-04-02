使用指定路径下的 frida-gadget.so
# 1. 找到缓存目录
ls -la ~/.objection/

# 2. 放置你的 gadget
mkdir -p ~/.objection/android/arm64-v8a
cp /path/to/your/libfrida-gadget.so ~/.objection/android/arm64-v8a/libfrida-gadget.so
echo "14.2.18" > ~/.objection/android/arm64-v8a/.version

# 3. 使用指定版本打包
objection patchapk \
  --source qinbaobao.apk \
  --target-class com.secneo.apkwrapper.AW \
  -c config.json -l index.js\
  && adb install -r -t -d qinbaobao.objection.apk

  objection patchapk --source release-2.0.0.apk -c  config.json -l index.js && adb install -r -t -d release-2.0.0.objection.apk

# bug fix
  frida-gadget.so 17.9.1版本不能执行 script 脚本,使用本工程的项目就行