import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WEB_STATUS_BAR_HEIGHT, useWebFrame } from '../components/PhoneFrame';

const WEB_FRAME_BOTTOM_INSET = 34;
const WEB_FRAMELESS_TOP_INSET = 20;
const WEB_FRAMELESS_BOTTOM_INSET = 16;

/**
 * Safe-area insets that account for the desktop web phone frame's simulated
 * status bar and home indicator. Phone-sized browsers get compact insets
 * (the browser supplies its own chrome), and native uses real device insets.
 */
export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  const framed = useWebFrame();
  if (Platform.OS === 'web') {
    return framed
      ? { top: WEB_STATUS_BAR_HEIGHT, bottom: WEB_FRAME_BOTTOM_INSET }
      : {
          top: Math.max(insets.top, WEB_FRAMELESS_TOP_INSET),
          bottom: Math.max(insets.bottom, WEB_FRAMELESS_BOTTOM_INSET),
        };
  }
  return { top: insets.top, bottom: insets.bottom };
}
