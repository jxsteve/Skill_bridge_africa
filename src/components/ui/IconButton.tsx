import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { palette } from '../../theme/colors';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

/** Small icon-only button (e.g. password visibility toggle). */
export default function IconButton({ children, onPress, disabled = false }: Props) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [styles.base, pressed && !disabled && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 32,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: palette.gray200,
  },
});
