import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ArrowRightCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  PrimaryButton,
} from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { DELIVERY_OPTIONS } from '../data/marketplace';

type Props = {
  onBack: () => void;
  onSubmit: () => void;
};

export default function PlaceBidScreen({ onBack, onSubmit }: Props) {
  const insets = useScreenInsets();
  const [amount, setAmount] = useState('');
  const [delivery, setDelivery] = useState('');
  const [note, setNote] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const canSubmit = amount.trim() !== '' && delivery !== '';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable hitSlop={10} onPress={onBack} style={styles.back}>
          <ChevronLeftIcon />
        </Pressable>

        <Text style={styles.label}>Your Bid ($)</Text>
        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="$23"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Text style={styles.label}>Delivery Time</Text>
        <Pressable style={styles.field} onPress={() => setPickerOpen((o) => !o)}>
          <Text style={[styles.input, !delivery && styles.placeholder]}>
            {delivery || 'Select Delivery Time'}
          </Text>
          <ChevronDownIcon />
        </Pressable>
        {pickerOpen && (
          <View style={styles.options}>
            {DELIVERY_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                style={styles.option}
                onPress={() => {
                  setDelivery(opt);
                  setPickerOpen(false);
                }}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.label}>Cover Note (Optional)</Text>
        <View style={[styles.field, styles.textareaField]}>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="I can Deliver a modern and user-friendly design that fits your brand"
            placeholderTextColor="#9CA3AF"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        <Text style={styles.label}>Attachment (Optional)</Text>
        <Pressable style={styles.addFile}>
          <ArrowRightCircleIcon size={20} />
          <Text style={styles.addFileText}>Add File</Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          label="Submit Bid"
          showIcon={false}
          fullWidth
          disabled={!canSubmit}
          onPress={onSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.splashBase },
  content: { paddingHorizontal: 24 },
  back: { alignSelf: 'flex-start' },
  label: {
    marginTop: 22,
    color: colors.titleDark,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  field: {
    marginTop: 10,
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DBE3',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontFamily: fonts.regular,
    fontSize: 15,
    paddingVertical: 14,
  },
  placeholder: { color: '#9CA3AF' },
  textareaField: { minHeight: 120, alignItems: 'flex-start' },
  textarea: { height: 96, textAlignVertical: 'top' },
  options: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEF0F3',
  },
  optionText: { color: '#111827', fontFamily: fonts.regular, fontSize: 15 },
  addFile: {
    marginTop: 10,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DBE3',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addFileText: { color: palette.blue500, fontFamily: fonts.semiBold, fontSize: 15 },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.splashBase,
    borderTopWidth: 1,
    borderTopColor: '#ECECEF',
  },
});
