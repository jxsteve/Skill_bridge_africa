import {
  ChevronRightIcon,
  ClipboardListIcon,
  ClockIcon,
  FileIcon,
  HandCoinsIcon,
  HourglassIcon,
  ShieldCheckIcon,
  UsersIcon,
  WalletIcon,
} from '../components/ui';
import logoMark from '../assets/images/logo_mark.png';
import HeroImg from '../assets/images/hero-img.jpg';
import styles from './HowItWorksScreen.module.css';

type TimelineStep = {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const TIMELINE: TimelineStep[] = [
  {
    number: 1,
    title: 'Fund Your Wallet',
    description: 'Add funds to your platform wallet using our secure blockchain payment system',
    icon: <WalletIcon size={20} />,
  },
  {
    number: 2,
    title: 'Post a Task',
    description: 'Tell us what you need done. Add details, skills required and your deadline.',
    icon: <ClipboardListIcon size={20} color="var(--primary-blue)" />,
  },
  {
    number: 3,
    title: 'We Assign a Verified Student',
    description: 'Our admin team reviews your task and assigns the best verified student for the job',
    icon: <ShieldCheckIcon size={20} />,
  },
  {
    number: 4,
    title: 'Work in progress',
    description: 'Track progress as your assigned student works on your task in real time',
    icon: <ClockIcon size={20} />,
  },
  {
    number: 5,
    title: 'You Review & Approve',
    description: 'Review the work. If it meets your expectations, you approve it',
    icon: <HourglassIcon size={20} />,
  },
  {
    number: 6,
    title: 'We Release Payment',
    description: 'Once approved, we release payment from your wallet to the student instantly.',
    icon: <HandCoinsIcon size={20} />,
  },
];

type Props = {
  onGetStarted: () => void;
};

export default function HowItWorksScreen({ onGetStarted }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.contentPadding}>
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

          <span className={styles.badge}>
            <UsersIcon size={14} color="var(--primary-blue)" />
            For Clients / Businesses
          </span>

          <h1 className={styles.heading}>Get Quality work done by verified student talent.</h1>
          <p className={styles.subheading}>
            Post tasks, we handle the verification and matching. You get results, on time.
          </p>

          <div className={styles.diagram}>
            <div className={styles.diagramTopCard}>
              <FileIcon size={18} color="var(--primary-blue)" />
              <span>Quality Work</span>
            </div>

            <div className={styles.diagramMiddleRow}>
              <div className={styles.diagramSideCard}>
                <ShieldCheckIcon size={18} />
                <span>Verified Students</span>
              </div>

              <img
                src={HeroImg}
                alt="Student working on a laptop"
                className={styles.diagramPhoto}
              />

              <div className={styles.diagramSideCard}>
                <ClockIcon size={18} />
                <span>On-time Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.statsBarBackground}>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <p className={styles.statValue}>2,500+</p>
              <p className={styles.statLabel}>Verified Students</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statValue}>1,200+</p>
              <p className={styles.statLabel}>Projects Completed</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statValue}>98%</p>
              <p className={styles.statLabel}>Client's Satisfaction</p>
            </div>
          </div>
        </div>


        <div className={styles.contentPadding}>
          <p className={styles.sectionEyebrow}>How it works</p>
          <h2 className={styles.sectionHeading}>Simple. Transparent. Secure.</h2>
          <p className={styles.sectionSubheading}>
            We make it easy for you to get the right work done with peace of mind.
          </p>

          <ol className={styles.timeline}>
            {TIMELINE.map((step, index) => (
              <li key={step.number} className={styles.timelineItem}>
                <div className={styles.timelineMarkerCol}>
                  <span className={styles.timelineNumber}>{step.number}</span>
                  {index < TIMELINE.length - 1 && <span className={styles.timelineConnector} />}
                </div>
                <div className={styles.timelineBody}>
                  <p className={styles.timelineTitle}>{step.title}</p>
                  <div className={styles.timelineDescriptionRow}>
                    <span className={styles.timelineIcon}>{step.icon}</span>
                    <p className={styles.timelineDescription}>{step.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <button className={styles.getStartedButton} onClick={onGetStarted}>
            Get Started Now
            <ChevronRightIcon size={18} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
}