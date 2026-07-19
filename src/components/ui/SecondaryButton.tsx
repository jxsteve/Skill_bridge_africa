import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { ChevronRightIcon } from './icons';

type Props = {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  showIcon?: boolean;
};

/** Secondary action button: outlined blue, per the design system. */
export default function SecondaryButton({
  label = 'Cancel',
  onPress,
  disabled = false,
  showIcon = true,
}: Props) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        disabled
          ? styles.disabled
          : pressed
            ? styles.pressed
            : styles.default,
      ]}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      {showIcon && (
        <ChevronRightIcon
          size={20}
          color={disabled ? palette.gray400 : palette.blue500}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  default: {
    borderColor: palette.blue500,
    backgroundColor: 'transparent',
  },
  pressed: {
    borderColor: palette.blue500,
    backgroundColor: palette.blue100,
  },
  disabled: {
    borderColor: palette.gray300,
    backgroundColor: palette.blue100,
  },
  label: {
    color: palette.blue500,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  labelDisabled: {
    color: palette.gray400,
  },
});
