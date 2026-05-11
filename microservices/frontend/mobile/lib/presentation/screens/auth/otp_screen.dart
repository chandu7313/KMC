import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pinput/pinput.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/constants/app_constants.dart';
import '../../../presentation/providers/auth_provider.dart';

class OtpScreen extends ConsumerStatefulWidget {
  final String phone;
  final bool isNewUser;

  const OtpScreen({
    super.key,
    required this.phone,
    this.isNewUser = false,
  });

  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> {
  final _otpController = TextEditingController();
  final _nameController = TextEditingController();
  bool _isVerifying = false;
  bool _isResending = false;
  int _resendTimer = AppConstants.otpResendSeconds;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startResendTimer();
  }

  @override
  void dispose() {
    _otpController.dispose();
    _nameController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startResendTimer() {
    _resendTimer = AppConstants.otpResendSeconds;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendTimer > 0) {
        setState(() => _resendTimer--);
      } else {
        timer.cancel();
      }
    });
  }

  Future<void> _verifyOtp(String otp) async {
    if (otp.length != AppConstants.otpLength) return;
    setState(() => _isVerifying = true);

    try {
      final authNotifier = ref.read(authStateProvider.notifier);
      final success = await authNotifier.verifyOtp(
        widget.phone,
        otp,
        name: widget.isNewUser ? _nameController.text.trim() : null,
      );

      if (!success && mounted) {
        Fluttertoast.showToast(
          msg: 'Invalid OTP. Please try again.',
          backgroundColor: AppTheme.error,
        );
        _otpController.clear();
      }
      // If success, GoRouter redirect handles navigation to /home
    } catch (e) {
      if (mounted) {
        Fluttertoast.showToast(
          msg: e.toString(),
          backgroundColor: AppTheme.error,
        );
      }
    } finally {
      if (mounted) setState(() => _isVerifying = false);
    }
  }

  Future<void> _resendOtp() async {
    setState(() => _isResending = true);
    try {
      final authNotifier = ref.read(authStateProvider.notifier);
      final result = await authNotifier.sendOtp(widget.phone);
      if (result['success'] == true) {
        _startResendTimer();
        Fluttertoast.showToast(msg: 'OTP resent!');
      } else {
        Fluttertoast.showToast(
          msg: result['message'] ?? 'Failed to resend',
          backgroundColor: AppTheme.error,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(msg: e.toString(), backgroundColor: AppTheme.error);
    } finally {
      if (mounted) setState(() => _isResending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final defaultPinTheme = PinTheme(
      width: 56,
      height: 64,
      textStyle: GoogleFonts.inter(
        fontSize: 24,
        fontWeight: FontWeight.w800,
        color: AppTheme.secondary,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(16),
      ),
    );

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16),

              // Lock icon
              Container(
                width: 72,
                height: 72,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(22),
                ),
                child: const Icon(
                  Icons.sms_outlined,
                  size: 36,
                  color: AppTheme.primary,
                ),
              ),
              const SizedBox(height: 28),

              Text(
                'Verify Phone',
                style: GoogleFonts.inter(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.secondary,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 8),
              Text.rich(
                TextSpan(
                  text: 'We sent a 6-digit code to ',
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF64748B),
                  ),
                  children: [
                    TextSpan(
                      text: '+91 ${widget.phone}',
                      style: const TextStyle(fontWeight: FontWeight.w800, color: AppTheme.secondary),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 36),

              // Name field for new users
              if (widget.isNewUser) ...[
                TextFormField(
                  controller: _nameController,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    hintText: 'Your Name',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 24),
              ],

              // OTP Pinput
              Center(
                child: Pinput(
                  controller: _otpController,
                  length: AppConstants.otpLength,
                  defaultPinTheme: defaultPinTheme,
                  focusedPinTheme: defaultPinTheme.copyWith(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.primary, width: 2),
                    ),
                  ),
                  submittedPinTheme: defaultPinTheme.copyWith(
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.primary, width: 1.5),
                    ),
                  ),
                  hapticFeedbackType: HapticFeedbackType.lightImpact,
                  onCompleted: _verifyOtp,
                ),
              ),
              const SizedBox(height: 32),

              // Verify button
              ElevatedButton(
                onPressed: _isVerifying
                    ? null
                    : () => _verifyOtp(_otpController.text),
                child: _isVerifying
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 3,
                        ),
                      )
                    : const Text('Verify & Login'),
              ),
              const SizedBox(height: 24),

              // Resend
              Center(
                child: _resendTimer > 0
                    ? Text(
                        'Resend OTP in ${_resendTimer}s',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF94A3B8),
                        ),
                      )
                    : TextButton(
                        onPressed: _isResending ? null : _resendOtp,
                        child: Text(
                          _isResending ? 'Sending…' : 'Resend OTP',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.primary,
                          ),
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
