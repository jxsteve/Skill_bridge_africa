import 'dart:async';

import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import 'onboarding_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer(const Duration(milliseconds: 2800), _goToOnboarding);
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _goToOnboarding() {
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 450),
        pageBuilder: (_, _, _) => const OnboardingScreen(),
        transitionsBuilder: (_, animation, _, child) =>
            FadeTransition(opacity: animation, child: child),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.splashBase,
      body: Stack(
        children: [
          // Soft decorative blobs
          const Positioned(
            top: -30,
            left: -50,
            child: _Blob(size: 220, color: Color(0xFFE9F1F3)),
          ),
          const Positioned(
            bottom: 20,
            right: -40,
            child: _Blob(size: 200, color: Color(0xFFE9F1F3)),
          ),
          // Large glow behind the logo
          Center(
            child: Container(
              width: 460,
              height: 460,
              margin: const EdgeInsets.only(bottom: 24),
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    Color(0xFFE2EEF8),
                    Color(0xFFEBF3F8),
                    Color(0x00F8FAFB),
                  ],
                  stops: [0.0, 0.55, 1.0],
                ),
              ),
            ),
          ),
          Center(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset(
                    'assets/images/logo_mark.png',
                    width: 66,
                    fit: BoxFit.contain,
                  ),
                  const SizedBox(height: 16),
                  RichText(
                    text: const TextSpan(
                      style: TextStyle(
                        fontFamily: 'Manrope',
                        fontSize: 36,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                        height: 1.0,
                      ),
                      children: [
                        TextSpan(
                          text: 'Skill',
                          style: TextStyle(color: AppColors.primaryBlue),
                        ),
                        TextSpan(
                          text: 'Bridge',
                          style: TextStyle(color: AppColors.brandGreen),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '–AFRICA–',
                    style: TextStyle(
                      color: AppColors.primaryBlue,
                      fontSize: 19,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 4,
                    ),
                  ),
                  const SizedBox(height: 34),
                  const Text(
                    'Your Skills. Our Bridge',
                    style: TextStyle(
                      color: AppColors.bodyGrey,
                      fontSize: 17,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Blob extends StatelessWidget {
  const _Blob({required this.size, required this.color});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [color, color.withValues(alpha: 0)],
          stops: const [0.45, 1.0],
        ),
      ),
    );
  }
}
