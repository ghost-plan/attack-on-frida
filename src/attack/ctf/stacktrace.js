Java.perform(function () {
  var Cipher = Java.use("javax.crypto.Cipher");
  var Exception = Java.use("java.lang.Exception");
  var Log = Java.use("android.util.Log");

  var init = Cipher.init.overload("int", "java.security.Key");
  init.implementation = function (opmode, key) {
    var result = init.call(this, opmode, key);

    console.log("Cipher.init() opmode:", opmode, "key:", key);
    console.log(stackTraceHere());

    return result;
  };

  function stackTraceHere() {
    return Log.getStackTraceString(Exception.$new());
  }
});
