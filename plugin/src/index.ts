import {js_log, j_v, j_debug, j_info, j_warn, j_error, c_v, c_debug, c_info, c_warn, c_error,} from "./utils/p";
import {hookRegisterNatives} from "./utils/hooker";

// const {exec} = require("child_process");

function main() {
    Java.perform(function () {
        js_log("attack", "js_log");
        j_error("attack", "j_error");
        j_warn("attack", "j_warn");
        j_info("attack", "j_info");
        j_debug("attack", "j_debug");
        j_v("attack", "j_v");
        c_error("attack", "c_error");
        c_warn("attack", "c_warn");
        c_info("attack", "c_info");
        c_debug("attack", "c_debug");
        c_v("attack", "c_v");
    });
    // Module.ensureInitialized("libart.so");
    // Module.ensureInitialized("libguard.so");
    hookRegisterNatives(
        "main",
        (enter_args: Array<any>) => {
            let className = enter_args[0];
            let name = enter_args[1];
            let sig = enter_args[2];
            let fnPtr = enter_args[3];
            let findModule = enter_args[4];
            let offsetAddr = ptr(fnPtr).sub(findModule.base);
            console.log(
                "[RegisterNatives] java_class:",
                className,
                "name:",
                name,
                "sig:",
                sig,
                "fnPtr:",
                fnPtr,
                "offset:",
                offsetAddr,
                "module_name:",
                findModule.name,
                "module_base:",
                findModule.base
            );
            const methodInfo = fnPtr + "/" + offsetAddr + "/" + name;
            Interceptor.attach(fnPtr, {
                onEnter(args) {
                    console.log(
                        methodInfo +
                        " called from:\n" +
                        Thread.backtrace(this.context, Backtracer.ACCURATE)
                            .map(DebugSymbol.fromAddress)
                            .join("\n")
                    );
                },
                onLeave(retsult) {
                },
            });
        },
        (result: any) => {
            const numBytes = result.toInt32();
            // if (numBytes > 0) {
            //   console.log(hexdump(this.buf, { length: numBytes, ansi: true }));
            // }
            // console.log("Result   : " + numBytes);
            // var env = Java.vm.getEnv();
            // var newRetval = env.newStringUtf(
            //   "stringFromJNI native函数 被frida hook了"
            // );
            // result.replace(ptr(newRetval));
        }
    );
    // exec("adb shell pm path com.fake", (error: any, stdout: any, stderr: any) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });
    //  Module.ensureInitialized("libguard.so");
    // var m = Module.load("/data/app/com.jamesfchen.titan-2/lib/arm64/libdynamic_so.so");
    // var entry_addr = m.getExportByName('entry')
    // var entry = new NativeFunction(entry_addr, "bool", []);
    // console.log("entry", entry());
    // var result = Memory.alloc(0x100);
    // console.log(result.readCString());

}

setImmediate(main);
// setTimeout(main, 4000);
