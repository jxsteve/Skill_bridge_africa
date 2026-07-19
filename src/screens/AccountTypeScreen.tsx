import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AccountType, AccountTypeCard } from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

type Props = {
  onSelect: (type: AccountType) => void;
};

export default function AccountTypeScreen({ onSelect }: Props) {
  const insets = useScreenInsets();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Text style={styles.title}>Choose Your{'\n'}Account Type</Text>
      <Text style={styles.subtitle}>
        Select how you want to use{'\n'}SkillBridge Africa
      </Text>
      <View style={styles.cards}>
        <AccountTypeCard type="student" onPress={() => onSelect('student')} />
        <AccountTypeCard type="client" onPress={() => onSelect('client')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBase,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 40,
    textAlign: 'center',
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 30,
    lineHeight: 40,
  },
  subtitle: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 25,
  },
  cards: {
    marginTop: 33,
    gap: 33,
  },
});
