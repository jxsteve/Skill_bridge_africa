import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  BookmarkIcon,
  ChevronLeftIcon,
  DownloadIcon,
  FileIcon,
  PrimaryButton,
} from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { Task } from '../data/marketplace';

type Props = {
  task: Task;
  onBack: () => void;
  onPlaceBid: () => void;
};

export default function TaskDetailScreen({ task, onBack, onPlaceBid }: Props) {
  const insets = useScreenInsets();
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Pressable hitSlop={10} onPress={onBack}>
            <ChevronLeftIcon />
          </Pressable>
          <Pressable
            style={styles.saveButton}
            hitSlop={8}
            onPress={() => setSaved((s) => !s)}
          >
            <BookmarkIcon size={18} filled={saved} />
          </Pressable>
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.postedBy}>
          Posted by <Text style={styles.client}>{task.client}</Text>
        </Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>

        <Text style={styles.metaLabel}>Budget</Text>
        <Text style={styles.metaValue}>${task.budget.toFixed(2)}</Text>

        <Text style={styles.metaLabel}>Due date</Text>
        <Text style={styles.metaValueLarge}>{task.dueDate}</Text>

        <Text style={styles.sectionTitle}>Skills Required</Text>
        <View style={styles.skillsRow}>
          {task.skills.map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          Attachments ({task.attachments.length})
        </Text>
        {task.attachments.map((file) => (
          <View key={file.name} style={styles.fileRow}>
            <View
              style={[
                styles.fileIcon,
                { backgroundColor: file.kind === 'pdf' ? '#FDECEC' : '#FEF3C7' },
              ]}
            >
              <FileIcon size={20} color={file.kind === 'pdf' ? '#DC2626' : '#D97706'} />
            </View>
            <View style={styles.fileText}>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileSize}>{file.size}</Text>
            </View>
            <DownloadIcon />
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.footerButton}>
          <PrimaryButton label="Place a Bid" showIcon={false} fullWidth onPress={onPlaceBid} />
        </View>
        <View style={styles.footerSave}>
          <BookmarkIcon size={20} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.splashBase },
  content: { paddingHorizontal: 24 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: palette.blue50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 22,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 26,
  },
  postedBy: {
    marginTop: 6,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  client: { color: colors.titleDark, fontFamily: fonts.semiBold },
  sectionTitle: {
    marginTop: 24,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  description: {
    marginTop: 10,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
  },
  metaLabel: {
    marginTop: 20,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  metaValue: {
    marginTop: 4,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 22,
  },
  metaValueLarge: {
    marginTop: 4,
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 22,
  },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  skillChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: palette.blue50,
  },
  skillText: { color: palette.blue500, fontFamily: fonts.medium, fontSize: 13 },
  fileRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EAECEF',
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileText: { flex: 1 },
  fileName: { color: colors.titleDark, fontFamily: fonts.semiBold, fontSize: 14 },
  fileSize: {
    marginTop: 2,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.splashBase,
    borderTopWidth: 1,
    borderTopColor: '#ECECEF',
  },
  footerButton: { flex: 1 },
  footerSave: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: palette.blue50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
