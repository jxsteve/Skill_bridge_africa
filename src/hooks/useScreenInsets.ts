import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WEB_STATUS_BAR_HEIGHT } from '../components/PhoneFrame';

const WEB_BOTTOM_INSET = 34;

/**
 * Safe-area insets that also account for the simulated status bar and
 * home-indicator area of the web phone frame.
 */
export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  if (Platform.OS === 'web') {
    return { top: WEB_STATUS_BAR_HEIGHT, bottom: WEB_BOTTOM_INSET };
  }
  return { top: insets.top, bottom: insets.bottom };
}
