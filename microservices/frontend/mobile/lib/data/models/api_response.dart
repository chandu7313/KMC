/// Standard API response wrapper.
/// All backend endpoints return { success: bool, message?: string, ... }
class ApiResponse<T> {
  final bool success;
  final String? message;
  final T? data;

  const ApiResponse({
    required this.success,
    this.message,
    this.data,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>)? fromJsonT,
  ) {
    return ApiResponse(
      success: json['success'] ?? false,
      message: json['message'],
      data: fromJsonT != null && json.containsKey('data')
          ? fromJsonT(json['data'])
          : null,
    );
  }
}
