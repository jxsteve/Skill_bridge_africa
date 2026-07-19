import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// Landing stub shown after onboarding. Auth and home flows plug in here.
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.splashBase,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset('assets/images/logo_mark.png', width: 56),
            const SizedBox(height: 20),
            RichText(
              text: const TextSpan(
                style: TextStyle(
                  fontFamily: 'Manrope',
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
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
            const SizedBox(height: 12),
            const Text(
              'Welcome! Your journey starts here.',
              style: TextStyle(
                color: AppColors.bodyGrey,
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
