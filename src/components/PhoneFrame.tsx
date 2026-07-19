import React, { PropsWithChildren } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export const FRAME_WIDTH = 390;
export const FRAME_HEIGHT = 844;
export const WEB_STATUS_BAR_HEIGHT = 47;

/** Viewports narrower than this are treated as real phones: no fake frame. */
const FRAMELESS_MAX_WIDTH = 520;

/** True when the web build should draw the desktop phone frame. */
export function useWebFrame() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= FRAMELESS_MAX_WIDTH;
}

/**
 * On desktop web, presents the app inside a fixed phone-sized frame with an
 * iOS-style status bar, so it looks like the design screens. On phone-sized
 * browsers the app fills the viewport, and on native the device itself
 * provides the frame.
 */
export default function PhoneFrame({ children }: PropsWithChildren) {
  const { width, height } = useWindowDimensions();
  const framed = useWebFrame();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  if (!framed) {
    return <View style={styles.fullBleed}>{children}</View>;
  }

  const scale = Math.min(
    1,
    (width - 24) / FRAME_WIDTH,
    (height - 24) / FRAME_HEIGHT,
  );

  return (
    <View style={styles.backdrop}>
      <View style={[styles.frame, { transform: [{ scale }] }]}>
        {children}
        <StatusBarMock />
      </View>
    </View>
  );
}

function StatusBarMock() {
  return (
    <View style={styles.statusBar} pointerEvents="none">
      <Text style={styles.time}>9:41</Text>
      <Svg width={74} height={14} viewBox="0 0 74 14">
        {/* Cellular signal */}
        <Rect x={0} y={9} width={3} height={4} rx={1} fill={colors.titleDark} />
        <Rect x={5} y={7} width={3} height={6} rx={1} fill={colors.titleDark} />
        <Rect x={10} y={4.5} width={3} height={8.5} rx={1} fill={colors.titleDark} />
        <Rect x={15} y={2} width={3} height={11} rx={1} fill={colors.titleDark} />
        {/* Wi-Fi */}
        <Path
          d="M24 6.7a10.5 10.5 0 0 1 15 0"
          stroke={colors.titleDark}
          strokeWidth={2.2}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M27.2 9.7a6 6 0 0 1 8.6 0"
          stroke={colors.titleDark}
          strokeWidth={2.2}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={31.5} cy={12.2} r={1.7} fill={colors.titleDark} />
        {/* Battery */}
        <Rect
          x={47}
          y={1.5}
          width={21}
          height={11}
          rx={3.5}
          stroke={colors.titleDark}
          strokeOpacity={0.4}
          strokeWidth={1}
          fill="none"
        />
        <Rect x={49} y={3.5} width={13} height={7} rx={2} fill={colors.titleDark} />
        <Path
          d="M69.5 5v4a2.2 2.2 0 0 0 0-4Z"
          fill={colors.titleDark}
          fillOpacity={0.4}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  fullBleed: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#EDF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    shadowColor: '#0F172A',
    shadowOpacity: 0.18,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 18 },
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: WEB_STATUS_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 27,
    paddingRight: 25,
  },
  time: {
    color: colors.titleDark,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
