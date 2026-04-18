import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:logger/logger.dart';

import '../constants/app_constants.dart';
import '../errors/app_exception.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: dotenv.env['API_BASE_URL'] ?? 'http://10.0.2.2:4000/api',
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      sendTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  // Add interceptors
  dio.interceptors.addAll([
    _AuthInterceptor(ref),
    _ErrorInterceptor(),
    if (kDebugMode) _LoggingInterceptor(),
  ]);

  return dio;
});

// ============================================================
// AUTH INTERCEPTOR — Attaches JWT token to every request
// ============================================================
class _AuthInterceptor extends Interceptor {
  final Ref _ref;
  static const _storage = FlutterSecureStorage();

  _AuthInterceptor(this._ref);

  @override
  void onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _storage.read(key: AppConstants.tokenKey);
    if (token != null && token.isNotEmpty) {
      options.headers['Cookie'] = 'token=$token';
    }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    // Extract and store token from Set-Cookie header if present
    final cookies = response.headers['set-cookie'];
    if (cookies != null) {
      for (final cookie in cookies) {
        if (cookie.startsWith('token=')) {
          final token = cookie.split(';').first.replaceFirst('token=', '');
          if (token.isNotEmpty) {
            _storage.write(key: AppConstants.tokenKey, value: token);
          }
        }
      }
    }
    handler.next(response);
  }
}

// ============================================================
// ERROR INTERCEPTOR — Maps Dio errors to AppException
// ============================================================
class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: AppException.timeout(),
            type: err.type,
          ),
        );
        return;

      case DioExceptionType.connectionError:
        handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: AppException.noInternet(),
            type: err.type,
          ),
        );
        return;

      case DioExceptionType.badResponse:
        final statusCode = err.response?.statusCode ?? 0;
        if (statusCode == 401) {
          handler.reject(
            DioException(
              requestOptions: err.requestOptions,
              error: AppException.unauthorized(),
              type: err.type,
              response: err.response,
            ),
          );
          return;
        }
        final message = err.response?.data is Map
            ? err.response!.data['message'] ?? 'Server error'
            : 'Server error';
        handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: AppException(message: message, statusCode: statusCode),
            type: err.type,
            response: err.response,
          ),
        );
        return;

      default:
        handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: AppException.unknown(err.message),
            type: err.type,
          ),
        );
    }
  }
}

// ============================================================
// LOGGING INTERCEPTOR — Debug logging (only in debug mode)
// ============================================================
class _LoggingInterceptor extends Interceptor {
  final _logger = Logger(
    printer: PrettyPrinter(methodCount: 0, printTime: true),
  );

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    _logger.i('→ ${options.method} ${options.path}');
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    _logger.d('← ${response.statusCode} ${response.requestOptions.path}');
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    _logger.e('✖ ${err.response?.statusCode} ${err.requestOptions.path}',
        error: err.message);
    handler.next(err);
  }
}
