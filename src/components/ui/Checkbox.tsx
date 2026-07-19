import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { palette } from '../../theme/colors';
import { CheckIcon } from './icons';

type Props = {
  checked: boolean;
  onToggle: () => void;
};

/** Rounded square checkbox used for consent rows. */
export default function Checkbox({ checked, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      style={[styles.box, checked && styles.checked]}
    >
      {checked && <CheckIcon size={14} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    backgroundColor: palette.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: palette.blue500,
    borderColor: palette.blue500,
  },
});
