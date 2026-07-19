import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

type Props = {
  length?: number;
  value: string;
  onChange: (code: string) => void;
};

/** Segmented one-time-code input backed by a single hidden text field. */
export default function OtpInput({ length = 6, value, onChange }: Props) {
  const inputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    onChange(text.replace(/\D/g, '').slice(0, length));
  };

  return (
    <Pressable style={styles.row} onPress={() => inputRef.current?.focus()}>
      {Array.from({ length }, (_, i) => (
        <View key={i} style={[styles.box, i === value.length && styles.boxActive]}>
          <Text style={styles.digit}>{value[i] ?? ''}</Text>
        </View>
      ))}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  box: {
    flex: 1,
    maxWidth: 44,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.blue500,
    backgroundColor: palette.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    borderWidth: 2,
    borderColor: palette.blue200,
  },
  digit: {
    color: '#111827',
    fontFamily: fonts.semiBold,
    fontSize: 20,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
