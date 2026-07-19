import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { ChevronRightIcon } from './icons';

type Props = {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  showIcon?: boolean;
};

/** Primary action button: solid blue with a chevron, per the design system. */
export default function PrimaryButton({
  label = 'Create Account',
  onPress,
  disabled = false,
  loading = false,
  showIcon = true,
}: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={inactive ? undefined : onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        disabled
          ? styles.disabled
          : pressed
            ? styles.pressed
            : styles.default,
      ]}
    >
      <View style={[styles.content, loading && styles.contentLoading]}>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
        {showIcon && (
          <ChevronRightIcon
            size={20}
            color={disabled ? palette.gray400 : palette.textInverse}
          />
        )}
      </View>
      {loading && (
        <ActivityIndicator style={StyleSheet.absoluteFill} color={palette.textInverse} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: palette.blue500,
  },
  pressed: {
    backgroundColor: palette.blue700,
  },
  disabled: {
    backgroundColor: palette.gray300,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentLoading: {
    opacity: 0.15,
  },
  label: {
    color: palette.textInverse,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  labelDisabled: {
    color: palette.gray400,
  },
});
