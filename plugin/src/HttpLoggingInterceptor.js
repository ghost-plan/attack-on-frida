Java.perform(function () {
    // 定义日志级别，对应原Java类的Level
    const Level = {
        NONE: 0,
        BASIC: 1,
        HEADERS: 2,
        BODY: 3
    };

    // 配置当前日志级别
    const LOG_LEVEL = Level.BODY;

    // 工具方法：判断是否为明文内容
    function isPlaintext(buffer) {
        try {
            const prefix = Java.use('okio.Buffer').$new();
            const byteCount = buffer.size() < 64 ? buffer.size() : 64;
            buffer.copyTo(prefix, 0, byteCount);

            for (let i = 0; i < 16; i++) {
                if (prefix.exhausted()) break;
                const codePoint = prefix.readUtf8CodePoint();
                if (Java.use('java.lang.Character').isISOControl(codePoint) &&
                    !Java.use('java.lang.Character').isWhitespace(codePoint)) {
                    return false;
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    // 工具方法：判断body是否经过编码
    function bodyEncoded(headers) {
        const contentEncoding = headers.get('Content-Encoding');
        return contentEncoding !== null && contentEncoding.toLowerCase() !== 'identity';
    }

    // 打印日志
    function log(message) {
        console.log(`[HttpLogging] ${message}`);
    }

    // 提取请求信息并打印
    function logRequest(request) {
        if (LOG_LEVEL === Level.NONE) return;

        const method = request.method();
        const url = request.url().toString();
        const hasRequestBody = request.body() !== null;

        // 基本信息
        let logMsg = `--> ${method} ${url}`;
        if (!isLogHeaders() && hasRequestBody) {
            logMsg += ` (${request.body().contentLength()}-byte body)`;
        }
        log(logMsg);

        if (isLogHeaders()) {
            // 打印请求头
            const headers = request.headers();
            for (let i = 0; i < headers.size(); i++) {
                const name = headers.name(i);
                // 跳过已经单独处理的Content-Type和Content-Length
                if (name.toLowerCase() !== 'content-type' && name.toLowerCase() !== 'content-length') {
                    log(`${name}: ${headers.value(i)}`);
                }
            }

            // 打印请求体信息
            if (hasRequestBody) {
                const body = request.body();
                if (body.contentType() !== null) {
                    log(`Content-Type: ${body.contentType()}`);
                }
                if (body.contentLength() !== -1) {
                    log(`Content-Length: ${body.contentLength()}`);
                }

                if (isLogBody() && !bodyEncoded(request.headers())) {
                    try {
                        const buffer = Java.use('okio.Buffer').$new();
                        body.writeTo(buffer);
                        const charset = body.contentType() ? body.contentType().charset(Java.use('java.nio.charset.StandardCharsets').UTF_8) : Java.use('java.nio.charset.StandardCharsets').UTF_8;

                        if (isPlaintext(buffer)) {
                            log('');
                            log(buffer.readString(charset));
                            log(`--> END ${method} (${body.contentLength()}-byte body)`);
                        } else {
                            log(`--> END ${method} (binary ${body.contentLength()}-byte body omitted)`);
                        }
                    } catch (e) {
                        log(`--> END ${method} (error reading body: ${e.message})`);
                    }
                } else {
                    log(`--> END ${method} (encoded body omitted)`);
                }
            } else {
                log(`--> END ${method}`);
            }
        }
    }

    // 提取响应信息并打印
    function logResponse(response, tookMs) {
        if (LOG_LEVEL === Level.NONE) return;

        const code = response.code();
        const message = response.message() || '';
        const url = response.request().url().toString();
        const responseBody = response.body();
        const contentLength = responseBody ? responseBody.contentLength() : -1;
        const bodySize = contentLength !== -1 ? `${contentLength}-byte` : 'unknown-length';

        // 基本响应信息
        let logMsg = `<-- ${code} ${message} ${url} (${tookMs}ms`;
        if (!isLogHeaders()) {
            logMsg += `, ${bodySize} body`;
        }
        logMsg += ')';
        log(logMsg);

        if (isLogHeaders() && responseBody) {
            // 打印响应头
            const headers = response.headers();
            for (let i = 0; i < headers.size(); i++) {
                log(`${headers.name(i)}: ${headers.value(i)}`);
            }

            if (isLogBody() && !bodyEncoded(response.headers())) {
                try {
                    const source = responseBody.source();
                    source.request(Java.use('java.lang.Long').MAX_VALUE); // 缓冲整个响应体
                    const buffer = source.buffer();

                    const charset = responseBody.contentType() ? responseBody.contentType().charset(Java.use('java.nio.charset.StandardCharsets').UTF_8) : Java.use('java.nio.charset.StandardCharsets').UTF_8;

                    if (!isPlaintext(buffer)) {
                        log('');
                        log(`<-- END HTTP (binary ${buffer.size()}-byte body omitted)`);
                        return;
                    }

                    if (contentLength > 0) {
                        log('');
                        log(buffer.clone().readString(charset));
                    }

                    log(`<-- END HTTP (${buffer.size()}-byte body)`);
                } catch (e) {
                    log(`<-- END HTTP (error reading body: ${e.message})`);
                }
            } else {
                log(`<-- END HTTP (encoded body omitted)`);
            }
        } else if (isLogHeaders()) {
            log('<-- END HTTP');
        }
    }

    // 判断是否需要记录头信息
    function isLogHeaders() {
        return LOG_LEVEL === Level.HEADERS || LOG_LEVEL === Level.BODY;
    }

    // 判断是否需要记录体信息
    function isLogBody() {
        return LOG_LEVEL === Level.BODY;
    }

    // Hook OkHttp的Interceptor.Chain的proceed方法
    const Chain = Java.use('okhttp3.Interceptor$Chain');
    Chain.proceed.implementation = function (request) {
        // 记录请求开始时间
        const startNs = Java.use('java.lang.System').nanoTime();

        // 打印请求信息
        logRequest(request);

        try {
            // 执行原方法获取响应
            const response = this.proceed(request);

            // 计算耗时
            const tookMs = Java.use('java.util.concurrent.TimeUnit').NANOSECONDS.toMillis(
                Java.use('java.lang.System').nanoTime() - startNs
            );

            // 打印响应信息
            logResponse(response, tookMs);

            return response;
        } catch (e) {
            log(`<-- HTTP FAILED: ${e.message}`);
            throw e;
        }
    };

    log('HttpLoggingInterceptor hooked successfully');
});