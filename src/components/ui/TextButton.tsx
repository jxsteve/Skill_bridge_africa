import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { CornerUpLeftIcon } from './icons';

type Props = {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  showIcon?: boolean;
};

/** Inline text button (e.g. "Forgot Password"), per the design system. */
export default function TextButton({
  label = 'Forgot Password',
  onPress,
  disabled = false,
  showIcon = true,
}: Props) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.base, pressed && !disabled && styles.pressed]}
    >
      {({ pressed }) => {
        const color = disabled
          ? palette.gray400
          : pressed
            ? palette.blue700
            : palette.blue500;
        return (
          <>
            <Text style={[styles.label, { color }]}>{label}</Text>
            {showIcon && <CornerUpLeftIcon size={16} color={color} />}
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pressed: {
    backgroundColor: palette.blue100,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
});
