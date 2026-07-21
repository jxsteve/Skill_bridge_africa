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
  ChevronLeftIcon,
  PrimaryButton,
  UploadCloudIcon,
} from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';

const MAX_MESSAGE = 200;

type Props = {
  onBack: () => void;
  onSubmit: () => void;
};

export default function SubmitWorkScreen({ onBack, onSubmit }: Props) {
  const insets = useScreenInsets();
  const [message, setMessage] = useState('');

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

        <Text style={styles.heading}>Submit Your Work</Text>

        <Text style={styles.label}>Upload Files</Text>
        <Pressable style={styles.upload}>
          <View style={styles.uploadIcon}>
            <UploadCloudIcon size={28} />
          </View>
          <Text style={styles.uploadText}>Upload File</Text>
        </Pressable>
        <Text style={styles.hint}>PNG, JPG or PDF (Max. 10MB)</Text>

        <Text style={styles.label}>Message (Optional)</Text>
        <View style={styles.textareaField}>
          <TextInput
            style={styles.textarea}
            placeholder="Add a short note about your work"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={MAX_MESSAGE}
            value={message}
            onChangeText={setMessage}
          />
          <Text style={styles.counter}>
            {message.length}/{MAX_MESSAGE}
          </Text>
        </View>

        <Text style={styles.label}>Project preview (Optional)</Text>
        <View style={styles.previewRow}>
          <View style={styles.previewTile}>
            <Text style={styles.previewMore}>+4</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton label="Submit Work" showIcon={false} fullWidth onPress={onSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.splashBase },
  content: { paddingHorizontal: 24 },
  back: { alignSelf: 'flex-start' },
  heading: {
    marginTop: 18,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 26,
  },
  label: {
    marginTop: 24,
    color: colors.titleDark,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  upload: {
    marginTop: 12,
    height: 150,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: palette.blue500,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.blue50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: { color: palette.blue500, fontFamily: fonts.semiBold, fontSize: 15 },
  hint: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  textareaField: {
    marginTop: 12,
    minHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DBE3',
    backgroundColor: colors.white,
    padding: 14,
  },
  textarea: {
    flex: 1,
    minHeight: 60,
    color: '#111827',
    fontFamily: fonts.regular,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  counter: {
    alignSelf: 'flex-end',
    color: '#9CA3AF',
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  previewRow: { marginTop: 12, flexDirection: 'row', gap: 12 },
  previewTile: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: palette.blue50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewMore: { color: palette.blue500, fontFamily: fonts.semiBold, fontSize: 18 },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.splashBase,
    borderTopWidth: 1,
    borderTopColor: '#ECECEF',
  },
});
