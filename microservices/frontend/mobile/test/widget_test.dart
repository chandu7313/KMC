// Basic smoke test for the KMC Mobile app.
// Verifies the app boots without crashing under a ProviderScope.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:kmc_mobile/main.dart';

void main() {
  testWidgets('App starts without crashing', (WidgetTester tester) async {
    // Render the app inside a ProviderScope (required for Riverpod)
    await tester.pumpWidget(
      const ProviderScope(
        child: KmcMobileApp(),
      ),
    );

    // Allow async operations (router, providers) to settle
    await tester.pump(const Duration(seconds: 1));

    // Verify that MaterialApp rendered something on screen
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
