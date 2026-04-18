import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../../../core/theme/app_theme.dart';
import '../../../presentation/providers/auth_provider.dart';

class PhoneLoginScreen extends ConsumerStatefulWidget {
  const PhoneLoginScreen({super.key});

  @override
  ConsumerState<PhoneLoginScreen> createState() => _PhoneLoginScreenState();
}

class _PhoneLoginScreenState extends ConsumerState<PhoneLoginScreen> {
  final _phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      final authNotifier = ref.read(authStateProvider.notifier);
      final result = await authNotifier.sendOtp(_phoneController.text.trim());

      if (!mounted) return;

      if (result['success'] == true) {
        context.push('/otp', extra: {
          'phone': _phoneController.text.trim(),
          'isNewUser': result['isNewUser'] ?? false,
        });
      } else {
        Fluttertoast.showToast(
          msg: result['message'] ?? 'Failed to send OTP',
          backgroundColor: AppTheme.error,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: e.toString(),
        backgroundColor: AppTheme.error,
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _devAutoLogin({String? email, String? phone}) async {
    setState(() => _isLoading = true);
    try {
      final success = await ref.read(authStateProvider.notifier)
          .autoLoginDev(email: email, phone: phone);
      if (!success && mounted) {
        Fluttertoast.showToast(msg: 'Dev login failed');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 48),

                // Icon
                Container(
                  width: 80,
                  height: 80,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Icon(
                    Icons.eco,
                    size: 44,
                    color: AppTheme.primary,
                  ),
                ),
                const SizedBox(height: 32),

                // Title
                Text(
                  'Welcome to KMC',
                  style: GoogleFonts.inter(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: AppTheme.secondary,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Enter your phone number to get started.\nWe\'ll send you a verification code.',
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF64748B),
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 40),

                // Phone input
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  maxLength: 10,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2,
                  ),
                  decoration: InputDecoration(
                    counterText: '',
                    hintText: '10-digit phone number',
                    prefixIcon: Padding(
                      padding: const EdgeInsets.only(left: 20, right: 12),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '🇮🇳 +91',
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.secondary,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Container(
                            width: 1,
                            height: 28,
                            color: const Color(0xFFE2E8F0),
                          ),
                        ],
                      ),
                    ),
                    prefixIconConstraints: const BoxConstraints(minWidth: 0),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) return 'Phone number required';
                    if (value.length != 10) return 'Enter valid 10-digit number';
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                // Send OTP button
                ElevatedButton(
                  onPressed: _isLoading ? null : _sendOtp,
                  child: _isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 3,
                          ),
                        )
                      : const Text('Send OTP'),
                ),
                const SizedBox(height: 48),

                // Dev shortcuts
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF1F5F9)),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'DEV SHORTCUTS',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2,
                          color: const Color(0xFF94A3B8),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          _DevButton(
                            label: 'Admin',
                            icon: Icons.admin_panel_settings,
                            color: const Color(0xFF7C3AED),
                            onTap: () => _devAutoLogin(phone: '9999999999'),
                          ),
                          const SizedBox(width: 8),
                          _DevButton(
                            label: 'Farmer',
                            icon: Icons.agriculture,
                            color: AppTheme.primary,
                            onTap: () => _devAutoLogin(email: 'amit@example.com'),
                          ),
                          const SizedBox(width: 8),
                          _DevButton(
                            label: 'Officer',
                            icon: Icons.badge,
                            color: const Color(0xFF0EA5E9),
                            onTap: () => _devAutoLogin(email: 'john.fo@agridust.com'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _DevButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _DevButton({
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(height: 4),
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: color,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
