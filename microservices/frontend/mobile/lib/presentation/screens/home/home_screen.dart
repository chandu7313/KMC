import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_theme.dart';
import '../../../presentation/providers/auth_provider.dart';

/// Home screen — shown after successful authentication.
/// Placeholder for now — will be expanded with bottom nav tabs
/// for Soil, Market, Shop, Profile.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final user = authState.valueOrNull;

    return Scaffold(
      backgroundColor: AppTheme.surface,
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.eco, color: AppTheme.primary, size: 20),
            ),
            const SizedBox(width: 10),
            Text(
              'KMC',
              style: GoogleFonts.inter(
                fontWeight: FontWeight.w900,
                color: AppTheme.secondary,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Color(0xFF94A3B8)),
            onPressed: () {
              ref.read(authStateProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting
              Text(
                'Hello, ${user?.name ?? "Farmer"} 👋',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.secondary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Welcome to Kissan Mithar Consultancy',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: 32),

              // Quick access cards
              Expanded(
                child: GridView.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 1.1,
                  children: [
                    _QuickCard(
                      icon: Icons.science,
                      label: 'Soil Analysis',
                      subtitle: 'Test & recommendations',
                      color: const Color(0xFF16A34A),
                      onTap: () {
                        // TODO: Navigate to soil module
                      },
                    ),
                    _QuickCard(
                      icon: Icons.trending_up,
                      label: 'Mandi Prices',
                      subtitle: 'Market intelligence',
                      color: const Color(0xFF0EA5E9),
                      onTap: () {
                        // TODO: Navigate to market module
                      },
                    ),
                    _QuickCard(
                      icon: Icons.shopping_bag,
                      label: 'Shop',
                      subtitle: 'Seeds, fertilizers & more',
                      color: const Color(0xFFF59E0B),
                      onTap: () {
                        // TODO: Navigate to marketplace
                      },
                    ),
                    _QuickCard(
                      icon: Icons.article,
                      label: 'Knowledge',
                      subtitle: 'Blogs & success stories',
                      color: const Color(0xFF7C3AED),
                      onTap: () {
                        // TODO: Navigate to info module
                      },
                    ),
                    _QuickCard(
                      icon: Icons.calendar_month,
                      label: 'Book Visit',
                      subtitle: 'Farm consultation',
                      color: const Color(0xFFEC4899),
                      onTap: () {
                        // TODO: Navigate to booking
                      },
                    ),
                    _QuickCard(
                      icon: Icons.person,
                      label: 'Profile',
                      subtitle: 'Account settings',
                      color: const Color(0xFF64748B),
                      onTap: () {
                        // TODO: Navigate to profile
                      },
                    ),
                    if (user?.isAdmin == true)
                      _QuickCard(
                        icon: Icons.admin_panel_settings,
                        label: 'Admin',
                        subtitle: 'Dashboard & management',
                        color: const Color(0xFFDC2626),
                        onTap: () {
                          // TODO: Navigate to admin module
                        },
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuickCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _QuickCard({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF1F5F9)),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.06),
              blurRadius: 20,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.secondary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
