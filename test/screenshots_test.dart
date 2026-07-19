import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:skillbridge_africa/main.dart';
import 'package:skillbridge_africa/screens/onboarding_screen.dart';
import 'package:skillbridge_africa/screens/splash_screen.dart';

Future<void> _loadFonts() async {
  final loader = FontLoader('Manrope');
  for (final weight in ['regular', '500', '600', '700', '800']) {
    loader.addFont(rootBundle.load('assets/fonts/manrope-v20-latin-$weight.ttf'));
  }
  await loader.load();
}

Future<void> _precacheImages(WidgetTester tester) async {
  final context = tester.element(find.byType(Scaffold).first);
  await tester.runAsync(() async {
    for (final name in [
      'logo_mark',
      'onboarding_showcase',
      'onboarding_clients',
      'onboarding_payment',
    ]) {
      await precacheImage(AssetImage('assets/images/$name.png'), context);
    }
  });
  await tester.pumpAndSettle();
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUpAll(_loadFonts);

  Future<void> configureView(WidgetTester tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);
  }

  testWidgets('splash screen renders', (tester) async {
    await configureView(tester);
    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(useMaterial3: true, fontFamily: 'Manrope'),
        home: const SplashScreen(),
      ),
    );
    await _precacheImages(tester);
    await expectLater(
      find.byType(SplashScreen),
      matchesGoldenFile('goldens/splash.png'),
    );
    // Let the splash timer fire and settle before teardown.
    await tester.pumpAndSettle(const Duration(seconds: 3));
  });

  testWidgets('onboarding pages render', (tester) async {
    await configureView(tester);
    await tester.pumpWidget(const SkillBridgeApp());
    await tester.pumpAndSettle(const Duration(seconds: 3));
    await _precacheImages(tester);

    await expectLater(
      find.byType(OnboardingScreen),
      matchesGoldenFile('goldens/onboarding_1.png'),
    );

    await tester.tap(find.text('Next'));
    await tester.pumpAndSettle();
    await expectLater(
      find.byType(OnboardingScreen),
      matchesGoldenFile('goldens/onboarding_2.png'),
    );

    await tester.tap(find.text('Next'));
    await tester.pumpAndSettle();
    await expectLater(
      find.byType(OnboardingScreen),
      matchesGoldenFile('goldens/onboarding_3.png'),
    );
  });
}
