import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/user_model.dart';
import '../../data/repositories/auth_repository.dart';

/// Holds the current authenticated user state.
/// null = not logged in, UserModel = logged in.
final authStateProvider = StateNotifierProvider<AuthStateNotifier, AsyncValue<UserModel?>>((ref) {
  return AuthStateNotifier(ref.watch(authRepositoryProvider));
});

class AuthStateNotifier extends StateNotifier<AsyncValue<UserModel?>> {
  final AuthRepository _authRepo;

  AuthStateNotifier(this._authRepo) : super(const AsyncValue.loading()) {
    _checkAuthOnBoot();
  }

  /// Called on app launch — check if a stored token exists and is valid
  Future<void> _checkAuthOnBoot() async {
    try {
      // Add a timeout so splash screen never gets stuck
      await Future.any([
        _doAuthCheck(),
        Future.delayed(const Duration(seconds: 5)),
      ]);
      // If still loading after timeout, just go to login
      if (state is AsyncLoading) {
        state = const AsyncValue.data(null);
      }
    } catch (e, st) {
      state = const AsyncValue.data(null);
    }
  }

  Future<void> _doAuthCheck() async {
    try {
      final hasToken = await _authRepo.hasStoredToken();
      if (!hasToken) {
        state = const AsyncValue.data(null);
        return;
      }

      final isValid = await _authRepo.isAuthenticated();
      if (!isValid) {
        await _authRepo.logout();
        state = const AsyncValue.data(null);
        return;
      }

      final user = await _authRepo.getUserData();
      state = AsyncValue.data(user);
    } catch (e, st) {
      state = const AsyncValue.data(null);
    }
  }

  /// Step 1 — Send OTP
  Future<Map<String, dynamic>> sendOtp(String phone) async {
    return _authRepo.sendOtp(phone);
  }

  /// Step 2 — Verify OTP → on success, fetch user data
  Future<bool> verifyOtp(String phone, String otp, {String? name}) async {
    final result = await _authRepo.verifyOtp(phone, otp, name: name);
    if (result['success'] == true) {
      final user = await _authRepo.getUserData();
      state = AsyncValue.data(user);
      return true;
    }
    return false;
  }

  /// Dev auto-login shortcut
  Future<bool> autoLoginDev({String? email, String? phone}) async {
    state = const AsyncValue.loading();
    try {
      final result = await _authRepo.autoLoginDev(email: email, phone: phone);
      if (result['success'] == true) {
        final user = await _authRepo.getUserData();
        state = AsyncValue.data(user);
        return true;
      }
      state = const AsyncValue.data(null);
      return false;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  /// Logout
  Future<void> logout() async {
    await _authRepo.logout();
    state = const AsyncValue.data(null);
  }

  /// Refresh user data
  Future<void> refreshUser() async {
    final user = await _authRepo.getUserData();
    state = AsyncValue.data(user);
  }

  // Convenience getters
  UserModel? get currentUser => state.valueOrNull;
  bool get isLoggedIn => state.valueOrNull != null;
}
