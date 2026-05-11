import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../core/constants/app_constants.dart';
import '../../core/errors/app_exception.dart';
import '../../core/network/dio_client.dart';
import '../models/user_model.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(dioProvider));
});

class AuthRepository {
  final Dio _dio;
  static const _storage = FlutterSecureStorage();

  AuthRepository(this._dio);

  /// Step 1 — Send OTP to phone number
  Future<Map<String, dynamic>> sendOtp(String phone) async {
    try {
      final response = await _dio.post(AppConstants.sendOtp, data: {
        'phone': phone,
      });
      return response.data;
    } on DioException catch (e) {
      throw _extractError(e);
    }
  }

  /// Step 2 — Verify OTP → returns success and sets httpOnly cookie
  Future<Map<String, dynamic>> verifyOtp(String phone, String otp, {String? name}) async {
    try {
      final response = await _dio.post(AppConstants.verifyOtp, data: {
        'phone': phone,
        'otp': otp,
        if (name != null) 'name': name,
      });
      return response.data;
    } on DioException catch (e) {
      throw _extractError(e);
    }
  }

  /// Auto-login for dev shortcuts (admin/farmer/field-officer)
  Future<Map<String, dynamic>> autoLoginDev({String? email, String? phone}) async {
    try {
      final response = await _dio.post(AppConstants.autoLogin, data: {
        if (email != null) 'email': email,
        if (phone != null) 'phone': phone,
      });
      return response.data;
    } on DioException catch (e) {
      throw _extractError(e);
    }
  }

  /// Check if current session is valid
  Future<bool> isAuthenticated() async {
    try {
      final response = await _dio.get(AppConstants.isAuth);
      return response.data['success'] == true;
    } catch (_) {
      return false;
    }
  }

  /// Get current user data
  Future<UserModel?> getUserData() async {
    try {
      final response = await _dio.post(AppConstants.getUserData);
      if (response.data['success'] == true && response.data['userData'] != null) {
        return UserModel.fromJson(response.data['userData']);
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  /// Logout — clear local token + call backend logout
  Future<void> logout() async {
    try {
      await _dio.post(AppConstants.logout);
    } catch (_) {
      // Ignore errors — always clear local data
    }
    if (!kIsWeb) {
      await _storage.delete(key: AppConstants.tokenKey);
    }
  }

  /// Check if a stored token exists locally
  /// On web, the browser manages cookies — just try the is-auth endpoint
  Future<bool> hasStoredToken() async {
    if (kIsWeb) {
      // On web, cookies are managed by the browser.
      // We can't check them directly, so return true to trigger isAuthenticated().
      return true;
    }
    final token = await _storage.read(key: AppConstants.tokenKey);
    return token != null && token.isNotEmpty;
  }

  /// Extract user-friendly error from DioException
  AppException _extractError(DioException e) {
    if (e.error is AppException) return e.error as AppException;
    final data = e.response?.data;
    if (data is Map && data['message'] != null) {
      return AppException(message: data['message']);
    }
    return AppException.unknown(e.message);
  }
}
