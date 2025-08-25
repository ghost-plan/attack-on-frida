package com.kd.http;

import android.util.Log;

import androidx.annotation.NonNull;

import java.io.EOFException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

import okhttp3.Connection;
import okhttp3.Headers;
import okhttp3.Interceptor;
import okhttp3.MediaType;
import okhttp3.Protocol;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okio.Buffer;
import okio.BufferedSource;

/**
 * 自定义 OkHttp 日志拦截器，支持详细的请求和响应日志记录
 */
public class HttpLoggingInterceptor implements Interceptor {
    private static final Charset UTF8 = StandardCharsets.UTF_8;

    public enum Level {
        NONE,       // 不记录日志
        BASIC,      // 仅记录请求方法、URL、响应状态码和执行时间
        HEADERS,    // 记录基本信息及请求和响应的所有 Headers
        BODY        // 记录基本信息、Headers 及请求和响应的 Body
    }

    private volatile Level level = Level.NONE;

    public HttpLoggingInterceptor() {
    }

    public HttpLoggingInterceptor(Level level) {
        this.level = level;
    }

    public void setLevel(Level level) {
        if (level == null) throw new NullPointerException("level == null. Use Level.NONE instead.");
        this.level = level;
    }

    public Level getLevel() {
        return level;
    }

    @NonNull
    @Override
    public Response intercept(Chain chain) throws IOException {
        Level level = this.level;

        Request request = chain.request();
        if (level == Level.NONE) {
            return chain.proceed(request);
        }

        boolean logBody = (level == Level.BODY);
        boolean logHeaders = (level == Level.BODY || level == Level.HEADERS);

        RequestBody requestBody = request.body();
        boolean hasRequestBody = requestBody != null;

        Connection connection = chain.connection();
        Protocol protocol = connection != null ? connection.protocol() : Protocol.HTTP_1_1;
        String requestStartMessage = "--> " + request.method() + ' ' + request.url() + ' ' + protocol;
        if (!logHeaders && hasRequestBody) {
            requestStartMessage += " (" + requestBody.contentLength() + "-byte body)";
        }
        println(requestStartMessage);

        if (logHeaders) {
            if (hasRequestBody) {
                // Request body headers are only present when installed as a network interceptor.
                // Force them to be included (when available) so there values are known.
                if (requestBody.contentType() != null) {
                    println("Content-Type: " + requestBody.contentType());
                }
                if (requestBody.contentLength() != -1) {
                    println("Content-Length: " + requestBody.contentLength());
                }
            }

            Headers headers = request.headers();
            for (int i = 0, count = headers.size(); i < count; i++) {
                String name = headers.name(i);
                // Skip headers from the request body as they are explicitly logged above.
                if (!"Content-Type".equalsIgnoreCase(name) && !"Content-Length".equalsIgnoreCase(name)) {
                    println(name + ": " + headers.value(i));
                }
            }

            if (!logBody || !hasRequestBody) {
                println("--> END " + request.method());
            } else if (bodyEncoded(request.headers())) {
                println("--> END " + request.method() + " (encoded body omitted)");
            } else {
                Buffer buffer = new Buffer();
                requestBody.writeTo(buffer);

                Charset charset = UTF8;
                MediaType contentType = requestBody.contentType();
                if (contentType != null) {
                    charset = contentType.charset(UTF8);
                }

                println("");
                if (isPlaintext(buffer)) {
                    println(buffer.readString(charset));
                    println("--> END " + request.method() + " (" + requestBody.contentLength() + "-byte body)");
                } else {
                    println("--> END " + request.method() + " (binary " + requestBody.contentLength() + "-byte body omitted)");
                }
            }
        }

        long startNs = System.nanoTime();
        Response response;
        try {
            response = chain.proceed(request);
        } catch (Exception e) {
            println("<-- HTTP FAILED: " + e);
            throw e;
        }
        long tookMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startNs);

        ResponseBody responseBody = response.body();
        long contentLength = responseBody.contentLength();
        String bodySize = contentLength != -1 ? contentLength + "-byte" : "unknown-length";
        println("<-- " + response.code() + (response.message().isEmpty() ? "" : ' ' + response.message())
                + ' ' + response.request().url() + " (" + tookMs + "ms" + (!logHeaders ? ", " + bodySize + " body" : "") + ')');

        if (logHeaders) {
            Headers headers = response.headers();
            for (int i = 0, count = headers.size(); i < count; i++) {
                println(headers.name(i) + ": " + headers.value(i));
            }

            if (!logBody || !responseBodySourceIsReadable(response)) {
                println("<-- END HTTP");
            } else if (bodyEncoded(response.headers())) {
                println("<-- END HTTP (encoded body omitted)");
            } else {
                BufferedSource source = responseBody.source();
                source.request(Long.MAX_VALUE); // Buffer the entire body.
                Buffer buffer = source.buffer();

                Charset charset = UTF8;
                MediaType contentType = responseBody.contentType();
                if (contentType != null) {
                    charset = contentType.charset(UTF8);
                }

                if (!isPlaintext(buffer)) {
                    println("");
                    println("<-- END HTTP (binary " + buffer.size() + "-byte body omitted)");
                    return response;
                }

                if (contentLength > 0) {
                    println("");
                    println(buffer.clone().readString(charset));
                }

                println("<-- END HTTP (" + buffer.size() + "-byte body)");
            }
        }

        return response;
    }

    private boolean responseBodySourceIsReadable(Response response) {
        // Prior to OkHttp 3.9, response.source() returns a BufferSource that
        // is missing the `buffer()` method.
        try {
            ResponseBody responseBody = response.body();
            if (responseBody == null) return false;
            BufferedSource source = responseBody.source();
            if (source == null) return false;
            //noinspection ResultOfMethodCallIgnored
            source.getClass().getMethod("buffer");
            return true;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }

    /**
     * Returns true if the body in question probably contains human readable text. Uses a small sample
     * of code points to detect unicode control characters commonly used in binary file signatures.
     */
    private static boolean isPlaintext(Buffer buffer) {
        try {
            Buffer prefix = new Buffer();
            long byteCount = buffer.size() < 64 ? buffer.size() : 64;
            buffer.copyTo(prefix, 0, byteCount);
            for (int i = 0; i < 16; i++) {
                if (prefix.exhausted()) {
                    break;
                }
                int codePoint = prefix.readUtf8CodePoint();
                if (Character.isISOControl(codePoint) && !Character.isWhitespace(codePoint)) {
                    return false;
                }
            }
            return true;
        } catch (EOFException e) {
            return false; // Truncated UTF-8 sequence.
        }
    }

    private boolean bodyEncoded(Headers headers) {
        String contentEncoding = headers.get("Content-Encoding");
        return contentEncoding != null && !contentEncoding.equalsIgnoreCase("identity");
    }

    private void println(String message) {
        // 这里使用 System.out.println，实际项目中建议使用日志框架如 Logger 或 Logcat
        Log.d("HttpLoggingInterceptor",message);
//        System.out.println(message);
    }
}