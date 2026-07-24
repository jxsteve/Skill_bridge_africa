import { CheckIcon, ClockIcon, LockIcon, ShieldCheckIcon, ThumbsUpIcon, UserIcon } from '../components/ui';
import logoMark from '../assets/images/logo_mark.png';
import styles from './WhyChooseUsScreen.module.css';

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const FEATURES: Feature[] = [
  {
    title: 'Verified Student Talent',
    description: 'Every student is verified by our admin team. You work with trusted, skilled talent.',
    icon: <ShieldCheckIcon size={22} color="#16A34A" />,
  },
  {
    title: 'Quality You can Trust',
    description: 'We ensure high standards through manual review and quality control.',
    icon: <ThumbsUpIcon size={22} color="var(--primary-blue)" />,
  },
  {
    title: 'On-Time Delivery',
    description: 'Students are committed to deadlines. We keep your projects on track.',
    icon: <ClockIcon size={22} color="var(--violet)" />,
  },
  {
    title: 'Secure Blockchain Payments',
    description: 'Your funds are safe in our platform wallet and released only after you approve.',
    icon: <LockIcon size={22} color="#D97706" />,
  },
];

const GUARANTEES = [
  'We match you with the right talent',
  'Quality work or we reassign',
  'Secure payments, always',
  'Dedicated support at every step',
];

type Props = {
  testimonial?: {
    quote: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  onGetStarted: () => void;
};

const DEFAULT_TESTIMONIAL = {
  quote:
    'SkillBridge Africa has helped us complete projects faster and at affordable rates. The quality and communication are top-notch.',
  name: 'Thomas Daniel',
  role: 'Product Manager',
};

export default function WhyChooseUsScreen({
  testimonial = DEFAULT_TESTIMONIAL,
  onGetStarted,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
         <div className={styles.brandRow}>
                  <img src={logoMark} className={styles.brandMark} alt="" />
                  <div>
                    <p className={styles.brandWordmark}>
                      <span style={{ color: 'var(--primary-blue)' }}>Skill</span>
                      <span style={{ color: 'var(--brand-green)' }}>Bridge</span>
                    </p>
                    <p className={styles.brandAfrica}>–AFRICA–</p>
                  </div>
                </div>

        <p className={styles.eyebrow}>Why Clients Choose Us</p>
        <h1 className={styles.heading}>More than just a Freelance Platform</h1>
        <p className={styles.subheading}>We give you confidence, quality and complete control</p>

        <div className={styles.featureList}>
          {FEATURES.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <div>
                <p className={styles.featureTitle}>{feature.title}</p>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <section className={styles.testimonialCard}>
          <p className={styles.testimonialQuote}>{testimonial.quote}</p>
          <div className={styles.testimonialAuthorRow}>
            <div className={styles.testimonialAvatar}>
              {testimonial.avatarUrl ? (
                <img className={styles.testimonialAvatarImage} src={testimonial.avatarUrl} alt="" />
              ) : (
                <UserIcon size={20} color="#111827" />
              )}
            </div>
            <div>
              <p className={styles.testimonialName}>{testimonial.name}</p>
              <p className={styles.testimonialRole}>{testimonial.role}</p>
            </div>
          </div>
        </section>

        <section className={styles.guaranteeCard}>
          <p className={styles.guaranteeTitle}>Our Guarantee To You</p>
          <ul className={styles.guaranteeList}>
            {GUARANTEES.map((item) => (
              <li key={item} className={styles.guaranteeItem}>
                <CheckIcon size={14} color="#16A34A" strokeWidth={3} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.ctaCard}>
          <p className={styles.ctaTitle}>Ready to get started?</p>
          <p className={styles.ctaSubtitle}>Fund your wallet, post a task and get quality work done</p>
          <button className={styles.ctaButton} onClick={onGetStarted}>
            Fund Wallet
          </button>
        </section>
      </div>
    </div>
  );
}