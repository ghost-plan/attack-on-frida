import { getFieldValue } from "@attack/core/reflect";
import { js_log, j_v, j_debug, j_info, j_warn, j_error, c_v, c_debug, c_info, c_warn, c_error, } from "@attack/core/p";
Java.perform(function () {
    // js_log("attack", "hook okhttp!");
    var MyInterceptor = Java.registerClass({
        name: 'com.example.MyInterceptor',
        implements: [Java.use('okhttp3.Interceptor')],
        methods: {
            intercept: function (chain) {
                js_log("attack", "拦截器开始工作");
                // 获取原始请求
                var request = chain.request();
                js_log("attack", "请求URL: " + request.url().toString());
                js_log("attack", "请求方法: " + request.method());

                // 执行请求并获取响应
                var response = chain.proceed(request);
                js_log("attack", "响应状态码: " + response.code());

                // 返回响应
                return response;
            }
        }
    });

    // 2. Hook OkHttpClient的构造器
    var OkHttpClient = Java.use('okhttp3.OkHttpClient');
    OkHttpClient.$init.overload('okhttp3.OkHttpClient$Builder').implementation = function (builder) {
        //  // 可选：获取builder的属性
        // var connectTimeout = getFieldValue(builder, 'connectTimeout');
        // var readTimeout = getFieldValue(builder, 'readTimeout');
        // var writeTimeout = getFieldValue(builder, 'writeTimeout');

        // js_log("attack", "连接超时: " + connectTimeout + "ms");
        // js_log("attack", "读取超时: " + readTimeout + "ms");
        // js_log("attack", "写入超时: " + writeTimeout + "ms");
        var interceptor = MyInterceptor.$new();
        builder.addInterceptor(interceptor);
        return this.$init(builder);
    };
});