import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {
  CloseIcon,
  Chip,
  ChevronLeftIcon,
  GraduationCapIcon,
  PlusIcon,
  PrimaryButton,
  StepProgress,
  TextButton,
  TextField,
  UserIcon,
} from '../components/ui';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors, palette } from '../theme/colors';
import { fonts } from '../theme/fonts';
import {
  ACADEMIC_LEVELS,
  MAX_SKILLS,
  SKILL_OPTIONS,
  StudentProfile,
} from '../types/profile';

const TOTAL_STEPS = 4;

type Props = {
  onComplete: (profile: StudentProfile) => void;
};

export default function ProfileSetupScreen({ onComplete }: Props) {
  const insets = useScreenInsets();
  const [step, setStep] = useState(1);

  const [university, setUniversity] = useState('');
  const [course, setCourse] = useState('');
  const [level, setLevel] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [available, setAvailable] = useState(true);

  const canContinue =
    step === 1
      ? university.trim().length > 1 && course.trim().length > 1 && level !== ''
      : step === 2
        ? skills.length > 0
        : true;

  const toggleSkill = (skill: string) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((s) => s !== skill)
        : current.length < MAX_SKILLS
          ? [...current, skill]
          : current,
    );
  };

  const addPortfolioImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPortfolio((current) =>
        [...current, ...result.assets.map((a) => a.uri)].slice(0, 6),
      );
    }
  };

  const removePortfolioImage = (uri: string) => {
    setPortfolio((current) => current.filter((u) => u !== uri));
  };

  const handleContinue = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      onComplete({
        university: university.trim(),
        course: course.trim(),
        level,
        skills,
        portfolio,
        bio: bio.trim(),
        available,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={step > 1 ? () => setStep(step - 1) : undefined}
            hitSlop={12}
            style={[styles.back, step === 1 && styles.backHidden]}
          >
            <ChevronLeftIcon />
          </Pressable>
        </View>
        <StepProgress step={step} totalSteps={TOTAL_STEPS} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          <>
            <Text style={styles.title}>Your University</Text>
            <Text style={styles.subtitle}>
              Tell us where you study — this is how{'\n'}you get verified
            </Text>
            <View style={styles.form}>
              <TextField
                icon={<GraduationCapIcon size={20} color={palette.gray400} />}
                placeholder="University"
                value={university}
                onChangeText={setUniversity}
                autoCapitalize="words"
              />
              <TextField
                icon={<UserIcon />}
                placeholder="Course of Study"
                value={course}
                onChangeText={setCourse}
                autoCapitalize="words"
              />
              <Text style={styles.fieldLabel}>Current level</Text>
              <View style={styles.chipWrap}>
                {ACADEMIC_LEVELS.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    selected={level === option}
                    onPress={() => setLevel(option)}
                  />
                ))}
              </View>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Your Skills</Text>
            <Text style={styles.subtitle}>
              Pick up to {MAX_SKILLS} skills you want to{'\n'}offer clients
            </Text>
            <View style={[styles.chipWrap, styles.form]}>
              {SKILL_OPTIONS.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  selected={skills.includes(skill)}
                  onPress={() => toggleSkill(skill)}
                />
              ))}
            </View>
            <Text style={styles.helper}>
              {skills.length}/{MAX_SKILLS} selected
            </Text>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Your Portfolio</Text>
            <Text style={styles.subtitle}>
              Show off your best work — you can{'\n'}always add more later
            </Text>
            <View style={styles.portfolioGrid}>
              {portfolio.map((uri) => (
                <View key={uri} style={styles.portfolioTile}>
                  <Image source={{ uri }} style={styles.portfolioImage} />
                  <Pressable
                    style={styles.removeBadge}
                    hitSlop={8}
                    onPress={() => removePortfolioImage(uri)}
                  >
                    <CloseIcon />
                  </Pressable>
                </View>
              ))}
              {portfolio.length < 6 && (
                <Pressable style={styles.addTile} onPress={addPortfolioImages}>
                  <PlusIcon />
                  <Text style={styles.addTileLabel}>Add work</Text>
                </Pressable>
              )}
            </View>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>Almost Done</Text>
            <Text style={styles.subtitle}>
              Tell clients a little about yourself
            </Text>
            <View style={styles.form}>
              <TextField
                placeholder="Short bio — what do you do best?"
                value={bio}
                onChangeText={setBio}
                multiline
              />
              <View style={styles.availabilityRow}>
                <View style={styles.availabilityText}>
                  <Text style={styles.availabilityTitle}>Available for work</Text>
                  <Text style={styles.availabilityHint}>
                    Clients can send you offers
                  </Text>
                </View>
                <Switch
                  value={available}
                  onValueChange={setAvailable}
                  trackColor={{ false: palette.gray300, true: palette.blue500 }}
                  thumbColor={colors.white}
                  {...(Platform.OS === 'web'
                    ? ({ activeThumbColor: colors.white } as object)
                    : {})}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <PrimaryButton
          label={step === TOTAL_STEPS ? 'Complete Profile' : 'Continue'}
          showIcon={false}
          fullWidth
          disabled={!canContinue}
          onPress={handleContinue}
        />
        {step === 3 && portfolio.length === 0 && (
          <View style={styles.skipRow}>
            <TextButton
              label="Skip for now"
              showIcon={false}
              onPress={handleContinue}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBase,
  },
  header: {
    paddingHorizontal: 24,
  },
  headerRow: {
    height: 32,
    justifyContent: 'center',
  },
  back: {
    alignSelf: 'flex-start',
  },
  backHidden: {
    opacity: 0,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    marginTop: 22,
    textAlign: 'center',
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
  },
  form: {
    marginTop: 26,
    gap: 12,
  },
  fieldLabel: {
    marginTop: 8,
    color: colors.bodyGrey,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  helper: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  portfolioGrid: {
    marginTop: 26,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  portfolioTile: {
    width: 104,
    height: 104,
    borderRadius: 12,
    overflow: 'hidden',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  removeBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(17, 24, 39, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    width: 104,
    height: 104,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: palette.gray300,
    backgroundColor: palette.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addTileLabel: {
    color: palette.gray400,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  availabilityRow: {
    marginTop: 6,
    padding: 16,
    borderRadius: 12,
    backgroundColor: palette.gray100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityText: {
    flex: 1,
    paddingRight: 12,
  },
  availabilityTitle: {
    color: colors.titleDark,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  availabilityHint: {
    marginTop: 2,
    color: colors.bodyGrey,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  skipRow: {
    marginTop: 12,
    alignItems: 'center',
  },
});
