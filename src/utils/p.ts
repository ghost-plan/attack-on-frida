function js_log(tag: string, message: any): void {
  console.log(tag + ": " + message);
}

function j_v(tag: string, msg: string): void {
  const Log = Java.use("android.util.Log");
  Log.v(tag, msg);
}
function j_debug(tag: string, msg: string): void {
  const Log = Java.use("android.util.Log");
  Log.d(tag, msg);
}
function j_info(tag: string, msg: string): void {
  const Log = Java.use("android.util.Log");
  Log.i(tag, msg);
}
function j_warn(tag: string, msg: string): void {
  const Log = Java.use("android.util.Log");
  Log.w(tag, msg);
}
function j_error(tag: string, msg: string): void {
  const Log = Java.use("android.util.Log");
  Log.e(tag, msg);
}
enum LogPriority {
  /** For internal use only.  */
  ANDROID_LOG_UNKNOWN = 0,
  /** The default priority, for internal use only.  */
  ANDROID_LOG_DEFAULT /* only for SetMinPriority() */,
  /** Verbose logging. Should typically be disabled for a release apk. */
  ANDROID_LOG_VERBOSE,
  /** Debug logging. Should typically be disabled for a release apk. */
  ANDROID_LOG_DEBUG,
  /** Informational logging. Should typically be disabled for a release apk. */
  ANDROID_LOG_INFO,
  /** Warning logging. For use with recoverable failures. */
  ANDROID_LOG_WARN,
  /** Error logging. For use with unrecoverable failures. */
  ANDROID_LOG_ERROR,
  /** Fatal logging. For use when aborting. */
  ANDROID_LOG_FATAL,
  /** For internal use only.  */
  ANDROID_LOG_SILENT /* only for SetMinPriority(); must be last */,
}

function native_log(prio: LogPriority, tag: string, msg: string) {
  var tag_new = Memory.allocUtf8String(tag);
  var msg_new = Memory.allocUtf8String(msg);
  var param_type_list = ["int", "pointer", "pointer", "..."];
  var print_ptr = Module.getExportByName("liblog.so", "__android_log_print");
  const print = new NativeFunction(print_ptr, "int", param_type_list);
  print(prio, tag_new, msg_new);
}
function c_v(tag: string, msg: string): void {
  native_log(LogPriority.ANDROID_LOG_VERBOSE, tag, msg);
}
function c_debug(tag: string, msg: string): void {
  native_log(LogPriority.ANDROID_LOG_DEBUG, tag, msg);
}
function c_info(tag: string, msg: string): void {
  native_log(LogPriority.ANDROID_LOG_INFO, tag, msg);
}
function c_warn(tag: string, msg: string): void {
  native_log(LogPriority.ANDROID_LOG_WARN, tag, msg);
}

function c_error(tag: string, msg: string): void {
  native_log(LogPriority.ANDROID_LOG_ERROR, tag, msg);
}
export {
  js_log,
  j_v,
  j_debug,
  j_info,
  j_warn,
  j_error,
  c_v,
  c_debug,
  c_info,
  c_warn,
  c_error,
};
