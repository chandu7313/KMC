/// Custom exception class for all API and app errors.
/// Provides user-friendly messages for UI display.
class AppException implements Exception {
  final String message;
  final int? statusCode;
  final String? rawError;

  const AppException({
    required this.message,
    this.statusCode,
    this.rawError,
  });

  @override
  String toString() => message;

  // --- Factory helpers ---

  factory AppException.unauthorized() => const AppException(
        message: 'Session expired. Please login again.',
        statusCode: 401,
      );

  factory AppException.serverError([String? details]) => AppException(
        message: 'Something went wrong on our end. Please try again later.',
        statusCode: 500,
        rawError: details,
      );

  factory AppException.noInternet() => const AppException(
        message: 'No internet connection. Please check your network.',
        statusCode: 0,
      );

  factory AppException.timeout() => const AppException(
        message: 'Request timed out. Please try again.',
        statusCode: 408,
      );

  factory AppException.unknown([String? details]) => AppException(
        message: details ?? 'An unexpected error occurred.',
      );
}
