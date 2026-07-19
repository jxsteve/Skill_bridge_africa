/** Manrope family names as registered with expo-font in App.tsx. */
export const fonts = {
  regular: 'Manrope-Regular',
  medium: 'Manrope-Medium',
  semiBold: 'Manrope-SemiBold',
  bold: 'Manrope-Bold',
  extraBold: 'Manrope-ExtraBold',
} as const;

export const fontSources = {
  [fonts.regular]: require('../../assets/fonts/manrope-v20-latin-regular.ttf'),
  [fonts.medium]: require('../../assets/fonts/manrope-v20-latin-500.ttf'),
  [fonts.semiBold]: require('../../assets/fonts/manrope-v20-latin-600.ttf'),
  [fonts.bold]: require('../../assets/fonts/manrope-v20-latin-700.ttf'),
  [fonts.extraBold]: require('../../assets/fonts/manrope-v20-latin-800.ttf'),
};
