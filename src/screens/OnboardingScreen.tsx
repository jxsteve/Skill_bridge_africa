import { useState } from 'react';

import clientsImg from '../assets/images/onboarding_clients.png';
import paymentImg from '../assets/images/onboarding_payment.png';
import showcaseImg from '../assets/images/onboarding_showcase.png';
import styles from './OnboardingScreen.module.css';

type Page = {
  title: string;
  image: string;
  description: string;
  fullBleed: boolean;
};

const PAGES: Page[] = [
  {
    title: 'Showcase Your\nSkills',
    image: showcaseImg,
    description:
      'Build your profile, showcase your abilities and\nget paid for real world tasks',
    fullBleed: true,
  },
  {
    title: 'Connect with Trusted\nClients',
    image: clientsImg,
    description: 'Work with verified Clients who value your talent\nand pay fairly',
    fullBleed: true,
  },
  {
    title: 'Secure Payments Through\nSkillBridge',
    image: paymentImg,
    description:
      'We hold payments securely .\nYou get paid only after successful completion',
    fullBleed: false,
  },
];

export default function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [page, setPage] = useState(0);
  const isLast = page === PAGES.length - 1;
  const data = PAGES[page];

  const next = () => (isLast ? onFinish() : setPage((p) => p + 1));
  const skip = () => setPage(PAGES.length - 1);

  return (
    <div className={styles.container}>
      <div className={styles.pager}>
        <p className={styles.title}>{data.title}</p>
        <div className={styles.imageArea}>
          <img
            src={data.image}
            className={data.fullBleed ? styles.imageFull : styles.imageInset}
            alt=""
          />
        </div>
        <p className={styles.description}>{data.description}</p>
      </div>

      <div className={styles.dots}>
        {PAGES.map((_, i) => (
          <span key={i} className={`${styles.dot} ${i === page ? styles.dotActive : ''}`} />
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.skip} onClick={skip}>
          Skip
        </button>
        <button className={styles.next} onClick={next}>
          {isLast ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
