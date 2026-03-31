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
  --target-class com.dw.btime.Launcher \
  --gadget-version 14.2.18 \
  --gadget-config /Users/chenjinfa/tech/aiProjects/attack-on-frida/gadget-config-8888.json