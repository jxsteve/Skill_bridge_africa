import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import 'welcome_screen.dart';

class _OnboardingPageData {
  const _OnboardingPageData({
    required this.title,
    required this.image,
    required this.description,
    this.fullBleed = true,
  });

  final String title;
  final String image;
  final String description;
  final bool fullBleed;
}

const List<_OnboardingPageData> _pages = [
  _OnboardingPageData(
    title: 'Showcase Your\nSkills',
    image: 'assets/images/onboarding_showcase.png',
    description:
        'Build your profile, showcase your abilities and\nget paid for real world tasks',
  ),
  _OnboardingPageData(
    title: 'Connect with Trusted\nClients',
    image: 'assets/images/onboarding_clients.png',
    description:
        'Work with verified Clients who value your talent\nand pay fairly',
  ),
  _OnboardingPageData(
    title: 'Secure Payments Through\nSkillBridge',
    image: 'assets/images/onboarding_payment.png',
    description:
        'We hold payments securely .\nYou get paid only after successful completion',
    fullBleed: false,
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int _currentPage = 0;

  bool get _isLastPage => _currentPage == _pages.length - 1;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onNext() {
    if (_isLastPage) {
      _finish();
    } else {
      _controller.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeOut,
      );
    }
  }

  void _onSkip() {
    _controller.animateToPage(
      _pages.length - 1,
      duration: const Duration(milliseconds: 400),
      curve: Curves.easeOut,
    );
  }

  void _finish() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const WelcomeScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _pages.length,
                onPageChanged: (index) =>
                    setState(() => _currentPage = index),
                itemBuilder: (context, index) =>
                    _OnboardingPage(data: _pages[index]),
              ),
            ),
            _PageDots(current: _currentPage, count: _pages.length),
            const SizedBox(height: 56),
            Padding(
              padding: const EdgeInsets.only(left: 48, right: 23),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    onPressed: _onSkip,
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.primaryBlue,
                      padding: EdgeInsets.zero,
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: const Text(
                      'Skip',
                      style: TextStyle(
                        fontFamily: 'Manrope',
                        fontSize: 17,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 47,
                    child: ElevatedButton(
                      onPressed: _onNext,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryBlue,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: Text(
                        _isLastPage ? 'Get Started' : 'Next',
                        style: const TextStyle(
                          fontFamily: 'Manrope',
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 60 + MediaQuery.paddingOf(context).bottom),
          ],
        ),
      ),
    );
  }
}

class _OnboardingPage extends StatelessWidget {
  const _OnboardingPage({required this.data});

  final _OnboardingPageData data;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 14),
        Text(
          data.title,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: AppColors.titleDark,
            fontSize: 24,
            fontWeight: FontWeight.w700,
            height: 1.3,
          ),
        ),
        Expanded(
          child: Center(
            child: data.fullBleed
                ? Image.asset(
                    data.image,
                    width: double.infinity,
                    fit: BoxFit.fitWidth,
                  )
                : FractionallySizedBox(
                    widthFactor: 0.82,
                    child: Image.asset(data.image, fit: BoxFit.fitWidth),
                  ),
          ),
        ),
        SizedBox(
          height: 64,
          child: Text(
            data.description,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppColors.bodyGrey,
              fontSize: 15,
              fontWeight: FontWeight.w500,
              height: 1.5,
            ),
          ),
        ),
        const SizedBox(height: 12),
      ],
    );
  }
}

class _PageDots extends StatelessWidget {
  const _PageDots({required this.current, required this.count});

  final int current;
  final int count;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(count, (i) {
        return AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          margin: const EdgeInsets.symmetric(horizontal: 4),
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: i == current
                ? AppColors.primaryBlue
                : AppColors.dotInactive,
          ),
        );
      }),
    );
  }
}
