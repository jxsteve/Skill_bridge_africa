import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '../../theme/colors';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

type Props = {
  step: number;
  totalSteps: number;
};

/** "Step X of Y" label with a segmented progress bar. */
export default function StepProgress({ step, totalSteps }: Props) {
  return (
    <View>
      <Text style={styles.label}>
        Step {step} of {totalSteps}
      </Text>
      <View style={styles.track}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            style={[styles.segment, i < step && styles.segmentDone]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.bodyGrey,
    fontFamily: fonts.medium,
    fontSize: 13,
    marginBottom: 8,
  },
  track: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.gray300,
  },
  segmentDone: {
    backgroundColor: palette.blue500,
  },
});
