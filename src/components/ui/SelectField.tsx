import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { palette } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { FRAME_WIDTH, useWebFrame } from '../PhoneFrame';
import { CheckIcon, ChevronDownIcon } from './icons';

type Props = {
  icon?: React.ReactNode;
  placeholder: string;
  value: string;
  options: readonly string[];
  onSelect: (option: string) => void;
};

/** Dropdown field styled like TextField; options open in a bottom sheet. */
export default function SelectField({
  icon,
  placeholder,
  value,
  options,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  // Inside the desktop web frame the options render as a centered,
  // frame-width card; elsewhere they slide up as a bottom sheet.
  const framed = useWebFrame();

  return (
    <>
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <ChevronDownIcon />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={[styles.backdrop, framed && styles.backdropCentered]}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={[styles.sheet, framed && styles.sheetFramed]}
            onPress={() => {}}
          >
            {!framed && <View style={styles.grabber} />}
            <Text style={styles.sheetTitle}>{placeholder}</Text>
            <FlatList
              data={[...options]}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <Pressable
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[styles.optionLabel, selected && styles.optionLabelSelected]}
                    >
                      {item}
                    </Text>
                    {selected && <CheckIcon size={16} color={palette.blue500} />}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
  value: {
    flex: 1,
    color: '#111827',
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  placeholder: {
    color: palette.gray400,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  sheetFramed: {
    width: FRAME_WIDTH - 32,
    maxHeight: '62%',
    borderRadius: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.gray300,
    marginTop: 10,
  },
  sheetTitle: {
    marginTop: 14,
    marginBottom: 8,
    color: '#111827',
    fontFamily: fonts.semiBold,
    fontSize: 17,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: palette.blue50,
  },
  optionLabel: {
    flex: 1,
    color: '#111827',
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  optionLabelSelected: {
    color: palette.blue600,
    fontFamily: fonts.medium,
  },
});
