import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useScreenInsets } from '../hooks/useScreenInsets';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

type PageData = {
  key: string;
  title: string;
  image: ImageSourcePropType;
  imageAspectRatio: number;
  description: string;
  fullBleed: boolean;
};

const PAGES: PageData[] = [
  {
    key: 'showcase',
    title: 'Showcase Your\nSkills',
    image: require('../../assets/images/onboarding_showcase.png'),
    imageAspectRatio: 390 / 374,
    description:
      'Build your profile, showcase your abilities and\nget paid for real world tasks',
    fullBleed: true,
  },
  {
    key: 'clients',
    title: 'Connect with Trusted\nClients',
    image: require('../../assets/images/onboarding_clients.png'),
    imageAspectRatio: 390 / 354,
    description:
      'Work with verified Clients who value your talent\nand pay fairly',
    fullBleed: true,
  },
  {
    key: 'payment',
    title: 'Secure Payments Through\nSkillBridge',
    image: require('../../assets/images/onboarding_payment.png'),
    imageAspectRatio: 321 / 259,
    description:
      'We hold payments securely .\nYou get paid only after successful completion',
    fullBleed: false,
  },
];

type Props = {
  onFinish: () => void;
};

export default function OnboardingScreen({ onFinish }: Props) {
  const insets = useScreenInsets();
  const listRef = useRef<FlatList<PageData>>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const [pagerHeight, setPagerHeight] = useState(0);

  const isLastPage = pageIndex === PAGES.length - 1;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      setPageIndex(Math.min(Math.max(index, 0), PAGES.length - 1));
    },
    [width],
  );

  const goToPage = useCallback((index: number) => {
    listRef.current?.scrollToOffset({ offset: index * width, animated: true });
    setPageIndex(index);
  }, [width]);

  const handleNext = useCallback(() => {
    if (isLastPage) {
      onFinish();
    } else {
      goToPage(pageIndex + 1);
    }
  }, [isLastPage, onFinish, goToPage, pageIndex]);

  const handleSkip = useCallback(() => {
    goToPage(PAGES.length - 1);
  }, [goToPage]);

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View
        style={styles.pagerArea}
        onLayout={(e) => setPagerHeight(e.nativeEvent.layout.height)}
      >
        {width > 0 && (
        <FlatList
          ref={listRef}
          data={PAGES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <Page data={item} width={width} height={pagerHeight} />
          )}
          keyExtractor={(item) => item.key}
        />
        )}
      </View>

      <View style={styles.dotsRow}>
        {PAGES.map((page, i) => (
          <View
            key={page.key}
            style={[
              styles.dot,
              { backgroundColor: i === pageIndex ? colors.primaryBlue : colors.dotInactive },
            ]}
          />
        ))}
      </View>

      <View style={styles.actionsRow}>
        <Pressable onPress={handleSkip} hitSlop={12}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextLabel}>{isLastPage ? 'Get Started' : 'Next'}</Text>
        </Pressable>
      </View>

      <View style={{ height: 60 + insets.bottom }} />
    </View>
  );
}

function Page({
  data,
  width,
  height,
}: {
  data: PageData;
  width: number;
  height: number;
}) {
  return (
    <View style={[styles.page, { width, height: height || undefined }]}>
      <Text style={styles.title}>{data.title}</Text>
      <View style={styles.imageArea}>
        <Image
          source={data.image}
          style={
            data.fullBleed
              ? { width, aspectRatio: data.imageAspectRatio }
              : { width: width * 0.82, aspectRatio: data.imageAspectRatio }
          }
          resizeMode="contain"
        />
      </View>
      <Text style={styles.description}>{data.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  pagerArea: {
    flex: 1,
  },
  page: {
    paddingTop: 14,
  },
  title: {
    textAlign: 'center',
    color: colors.titleDark,
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 31,
  },
  imageArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    height: 64,
    textAlign: 'center',
    color: colors.bodyGrey,
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22.5,
    marginBottom: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  actionsRow: {
    marginTop: 56,
    paddingLeft: 48,
    paddingRight: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skip: {
    color: colors.primaryBlue,
    fontFamily: fonts.medium,
    fontSize: 17,
  },
  nextButton: {
    height: 47,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLabel: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
});
