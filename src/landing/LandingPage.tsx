/**
 * SkillBridge marketing landing page — a full-screen web page (rendered outside
 * the mobile phone frame). Styled after a clean product landing: floating pill
 * nav, two-tone hero headline, a phone mockup ringed by "verified" cards, then
 * how-it-works, features, a clients band, a CTA, and a footer. CTAs enter the app.
 */
import { useEffect } from 'react';

import {
  ActivityIcon,
  BellIcon,
  BriefcaseBusinessIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  CopyIcon,
  DollarSignIcon,
  EyeIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  WalletIcon,
} from '../components/ui';
import logoMark from '../assets/images/logo_mark.png';
import s from './landing.module.css';

type Props = {
  onGetStarted: () => void;
  onLogin: () => void;
};

const STEPS = [
  {
    icon: GraduationCapIcon,
    title: 'Create & verify your profile',
    body: 'Sign up with your school email, add your skills and portfolio, and get a verified badge.',
  },
  {
    icon: ClipboardListIcon,
    title: 'Bid on real tasks',
    body: 'Browse tasks posted by clients, place a bid or request the ones that match your skills.',
  },
  {
    icon: WalletIcon,
    title: 'Deliver & get paid',
    body: 'Do the work and get paid. Funds stay in escrow until the client approves.',
  },
];

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: 'Verified student talent',
    body: 'Every student is verified through their university, so clients hire with confidence.',
  },
  {
    icon: WalletIcon,
    title: 'Escrow-secured payments',
    body: 'Clients fund tasks up front. Money is released to students only when work is approved.',
  },
  {
    icon: DollarSignIcon,
    title: 'Built-in wallets',
    body: 'Each user gets a secure embedded wallet at sign-up, with no crypto experience needed.',
  },
  {
    icon: BriefcaseBusinessIcon,
    title: 'Real clients and tasks',
    body: 'Design, development and writing work from startups and businesses across the country.',
  },
];

export default function LandingPage({ onGetStarted, onLogin }: Props) {
  // Reveal sections as they scroll into view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(`.${s.reveal}`));
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add(s.revealed));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(s.revealed);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.page}>
      {/* Nav */}
      <header className={s.navWrap}>
        <nav className={s.nav}>
          <div className={s.brand}>
            <img src={logoMark} className={s.brandMark} alt="" />
            <span className={s.brandText}>
              Skill<span style={{ color: 'var(--brand-green)' }}>Bridge</span>
            </span>
          </div>
          <div className={s.navLinks}>
            <a className={s.navLink} href="#how">How it works</a>
            <a className={s.navLink} href="#features">Why SkillBridge</a>
            <a className={s.navLink} href="#clients">For clients</a>
          </div>
          <div className={s.navActions}>
            <button className={s.navLogin} onClick={onLogin}>Log in</button>
            <button className={s.navCta} onClick={onGetStarted}>Get started</button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className={s.hero}>
        <div className={s.eyebrow}>Built for African student talent</div>

        <h1 className={s.headline}>
          Where student skills meet{' '}
          <span className={s.headlineAccent}>real work.</span>
        </h1>
        <p className={s.subhead}>
          SkillBridge connects verified students with clients who need great work done.
          Payments stay in escrow until the job is complete.
        </p>

        <div className={s.heroCtas}>
          <button className={s.primaryBtn} onClick={onGetStarted}>Get started</button>
          <a className={s.secondaryBtn} href="#how">See how it works</a>
        </div>

        {/* Phone mockup + floating cards */}
        <div className={s.mockup}>
          <FloatingCard className={s.cardTopLeft} title="Bid approved" body="Mobile App UI · $10" />
          <FloatingCard className={s.cardTopRight} title="Student verified" body="University of Lagos" />
          <FloatingCard className={s.cardBottomLeft} title="New task posted" body="Landing page · $25" />
          <FloatingCard className={s.cardBottomRight} title="Payment released" body="$95 to your wallet" />

          <div className={s.phone}>
            <div className={s.phoneScreen}>
              <div className={s.phoneStatus}>
                <span>9:41</span>
                <span className={s.statusIcons}>
                  <span className={s.statSignal} />
                  <span className={s.statWifi} />
                  <span className={s.statBatt} />
                </span>
              </div>

              <div className={s.dashHeader}>
                <div className={s.dashLogo}>
                  <img src={logoMark} className={s.dashLogoMark} alt="" />
                  <div>
                    <p className={s.dashWordmark}>
                      Skill<span style={{ color: 'var(--brand-green)' }}>Bridge</span>
                    </p>
                    <p className={s.dashAfrica}>–AFRICA–</p>
                  </div>
                </div>
                <span className={s.dashBell}>
                  <BellIcon size={18} color="#111827" />
                  <span className={s.dashBellDot} />
                </span>
              </div>

              <div className={s.dashWelcome}>
                <div>
                  <p className={s.dashHi}>Welcome,</p>
                  <p className={s.dashName}>Miracle Igboanusi</p>
                </div>
                <span className={s.dashAvatar}>M</span>
              </div>

              <div className={s.walletCard}>
                <div className={s.walletTop}>
                  <span className={s.walletLabel}>Wallet Balance</span>
                  <EyeIcon size={16} color="#ffffff" />
                </div>
                <p className={s.walletBalance}>$0.00</p>
                <div className={s.walletAddrRow}>
                  <div>
                    <p className={s.walletAddrLabel}>Wallet Address (Solana)</p>
                    <p className={s.walletAddr}>6x1a7….x9kL2</p>
                  </div>
                  <CopyIcon size={15} color="#ffffff" />
                </div>
              </div>

              <div className={s.statRow}>
                {[
                  { label: 'Active Bids', value: '0', bg: '#ede4fc', color: '#6014e0', Icon: ActivityIcon },
                  { label: 'Earnings', value: '$0.00', bg: '#dcfce7', color: '#16a34a', Icon: DollarSignIcon },
                  { label: 'Profile Views', value: '0', bg: '#fef3c7', color: '#d97706', Icon: EyeIcon },
                ].map((st) => (
                  <div key={st.label} className={s.statTile}>
                    <span className={s.statTileLabel}>{st.label}</span>
                    <div className={s.statTileRow}>
                      <span className={s.statTileVal}>{st.value}</span>
                      <span className={s.statTileIcon} style={{ background: st.bg }}>
                        <st.Icon size={10} color={st.color} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={s.emptyCard}>
                <p className={s.emptyTitle}>No Active Tasks</p>
                <span className={s.emptyIcon}><ClipboardListIcon size={30} color="#6014e0" /></span>
                <p className={s.emptyText}>You don’t have any active tasks yet. Browse tasks and place a bid</p>
                <div className={s.browseBtn}>Browse Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className={`${s.section} ${s.reveal}`}>
        <p className={s.kicker}>For students</p>
        <h2 className={s.h2}>How it works</h2>
        <div className={s.steps}>
          {STEPS.map((step, i) => (
            <div key={step.title} className={s.step}>
              <span className={s.stepNum}>{i + 1}</span>
              <span className={s.stepIcon}><step.icon size={24} color="#124cc9" /></span>
              <p className={s.stepTitle}>{step.title}</p>
              <p className={s.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`${s.sectionAlt} ${s.reveal}`}>
        <p className={s.kicker}>Why SkillBridge</p>
        <h2 className={s.h2}>How we keep work and payments safe</h2>
        <div className={s.features}>
          {FEATURES.map((f) => (
            <div key={f.title} className={s.feature}>
              <span className={s.featureIcon}><f.icon size={22} color="#107535" /></span>
              <p className={s.featureTitle}>{f.title}</p>
              <p className={s.featureBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For clients */}
      <section id="clients" className={`${s.clients} ${s.reveal}`}>
        <div className={s.clientsText}>
          <p className={s.kicker}>For clients</p>
          <h2 className={s.h2} style={{ textAlign: 'left' }}>Need work done? Hire verified students.</h2>
          <ul className={s.clientsList}>
            {[
              'Post a task in minutes and set your budget',
              'Review bids from verified, skilled students',
              'Fund escrow and pay only when you approve the work',
            ].map((li) => (
              <li key={li} className={s.clientsItem}>
                <CheckCircleIcon size={20} color="#107535" />
                <span>{li}</span>
              </li>
            ))}
          </ul>
          <button className={s.primaryBtn} onClick={onGetStarted}>Post a task</button>
        </div>
        <div className={s.clientsCard}>
          <p className={s.appSection} style={{ marginTop: 0 }}>Create a task</p>
          <MiniField label="Task title" value="Design a landing page" />
          <MiniField label="Category" value="UI/UX Design" />
          <MiniField label="Budget" value="$25.00" />
          <div className={s.clientsCardBtn}>Post task</div>
        </div>
      </section>

      {/* CTA band */}
      <section className={`${s.ctaBand} ${s.reveal}`}>
        <h2 className={s.ctaTitle}>Start earning with SkillBridge</h2>
        <p className={s.ctaSub}>Create your profile and start bidding on real work.</p>
        <button className={s.ctaBtn} onClick={onGetStarted}>Get started</button>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.footerBrand}>
          <img src={logoMark} className={s.brandMark} alt="" />
          <span className={s.brandText} style={{ color: '#fff' }}>
            Skill<span style={{ color: '#6ee7a0' }}>Bridge</span>
          </span>
        </div>
        <div className={s.footerLinks}>
          <a href="#how" className={s.footerLink}>How it works</a>
          <a href="#features" className={s.footerLink}>Why SkillBridge</a>
          <a href="#clients" className={s.footerLink}>For clients</a>
          <button className={s.footerLink} onClick={onLogin}>Log in</button>
        </div>
        <p className={s.footerCopy}>© 2026 SkillBridge Africa. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FloatingCard({ className, title, body }: { className: string; title: string; body: string }) {
  return (
    <div className={`${s.floatCard} ${className}`}>
      <span className={s.floatCheck}><CheckCircleIcon size={18} color="#107535" /></span>
      <div>
        <p className={s.floatTitle}>{title}</p>
        <p className={s.floatBody}>{body}</p>
      </div>
    </div>
  );
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.miniField}>
      <span className={s.miniLabel}>{label}</span>
      <span className={s.miniValue}>{value}</span>
    </div>
  );
}
