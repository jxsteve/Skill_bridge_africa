import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

type Props = {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  /** Success turns the boxes green and locks input. */
  status?: 'default' | 'success';
};

/** Segmented one-time-code input backed by a single hidden text field. */
export default function OtpInput({
  length = 6,
  value,
  onChange,
  status = 'default',
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const success = status === 'success';

  const handleChange = (text: string) => {
    onChange(text.replace(/\D/g, '').slice(0, length));
  };

  return (
    <Pressable
      style={styles.row}
      onPress={success ? undefined : () => inputRef.current?.focus()}
    >
      {Array.from({ length }, (_, i) => (
        <View
          key={i}
          style={[
            styles.box,
            !success && i === value.length && styles.boxActive,
            success && styles.boxSuccess,
          ]}
        >
          <Text style={[styles.digit, success && styles.digitSuccess]}>
            {value[i] ?? ''}
          </Text>
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
        editable={!success}
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
  boxSuccess: {
    borderColor: palette.green500,
    backgroundColor: '#E9FBF0',
  },
  digit: {
    color: '#111827',
    fontFamily: fonts.semiBold,
    fontSize: 20,
  },
  digitSuccess: {
    color: palette.green500,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
