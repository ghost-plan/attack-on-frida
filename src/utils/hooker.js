function hookMethod(methodAddr, onEnter, onLeave) {
  Interceptor.attach(methodAddr, {
    onEnter: function (args) {
      const param_type_list = [className, name, sig, fnPtr, findModule];
      // onEnter(param_type_list);
      onEnter(args);
    },
    onLeave: function (result) {
      onLeave(result);
    },
  });
}
function hookRegisterNatives(methodName, onEnter, onLeave) {
  var symbols = Module.enumerateSymbolsSync("libart.so");
  for (var i = 0; i < symbols.length; i++) {
    var symbol = symbols[i];
    const address = symbol.address;
    const name = symbol.name;
    const type = symbol.type;
    const isGlobal = symbol.isGlobal;
    const section = symbol.section;
    if (
      name.indexOf("art") >= 0 &&
      name.indexOf("JNI") >= 0 &&
      name.indexOf("RegisterNatives") >= 0 &&
      name.indexOf("CheckJNI") < 0
    ) {
      //_ZN3art3JNI15RegisterNativesEP7_JNIEnvP7_jclassPK15JNINativeMethodi
      console.log(address, name, "RegisterNatives", type, isGlobal, section);
      /**
       * jint RegisterNatives(jclass clazz, const JNINativeMethod* methods,jint nMethods)
       * args[0] 类或者struct
       * args[1] args[2] args[3] 类或者struct 形参1，形参2，形参3
       */
      Interceptor.attach(address, {
        onEnter: function (args) {
          var env = args[0];
          var className = Java.vm.tryGetEnv().getClassName(args[1]);
          var methodsPtr = ptr(args[2]);
          var methodCount = parseInt(args[3]);
          console.log("[RegisterNatives] method_count:", methodCount);

          for (var i = 0; i < methodCount; i++) {
            var namePtr = Memory.readPointer(
              methodsPtr.add(i * Process.pointerSize * 3)
            );
            var sigPtr = Memory.readPointer(
              methodsPtr.add(i * Process.pointerSize * 3 + Process.pointerSize)
            );
            var fnPtr = Memory.readPointer(
              methodsPtr.add(
                i * Process.pointerSize * 3 + Process.pointerSize * 2
              )
            );

            var name = Memory.readCString(namePtr);
            var sig = Memory.readCString(sigPtr);
            var findModule = Process.findModuleByAddress(fnPtr);
            if (name != methodName) continue;
            const param_type_list = [className, name, sig, fnPtr, findModule];
            onEnter(param_type_list);
          }
        },
        onLeave: function (result) {
          onLeave(result);
        },
      });
    }
  }
}

export { hookRegisterNatives, hookMethod };
