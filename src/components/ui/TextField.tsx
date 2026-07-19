import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import IconButton from './IconButton';
import { EyeIcon, EyeOffIcon } from './icons';

type Props = {
  icon?: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

/** Rounded input field with a leading icon and optional password toggle. */
export default function TextField({
  icon,
  placeholder,
  value,
  onChangeText,
  secure = false,
  keyboardType,
  autoCapitalize,
}: Props) {
  const [hidden, setHidden] = useState(true);
  return (
    <View style={styles.field}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={palette.gray400}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure && hidden}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? (secure ? 'none' : undefined)}
      />
      {secure && (
        <IconButton onPress={() => setHidden((h) => !h)}>
          {hidden ? (
            <EyeOffIcon size={20} color={palette.gray400} />
          ) : (
            <EyeIcon size={20} color={palette.gray400} />
          )}
        </IconButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DBE3',
    backgroundColor: palette.gray50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  icon: {
    width: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#111827',
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingVertical: 0,
  },
});
