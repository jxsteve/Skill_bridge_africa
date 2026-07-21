import { useRef, useState } from 'react';

import {
  CameraIcon,
  ChevronLeftIcon,
  Chip,
  CloseIcon,
  PlusIcon,
  PrimaryButton,
  SelectField,
  TextButton,
  UserIcon,
} from '../components/ui';
import {
  DEPARTMENTS,
  MAX_SKILLS,
  SKILL_OPTIONS,
  UNIVERSITIES,
  type StudentProfile,
} from '../types/profile';
import styles from './ProfileSetupScreen.module.css';

const TOTAL_STEPS = 3;

type Props = {
  initialProfile?: StudentProfile | null;
  onComplete: (profile: StudentProfile) => void;
};

export default function ProfileSetupScreen({ initialProfile, onComplete }: Props) {
  const [step, setStep] = useState(1);

  const [avatarUri, setAvatarUri] = useState(initialProfile?.avatarUri ?? '');
  const [bio, setBio] = useState(initialProfile?.bio ?? '');
  const [university, setUniversity] = useState(initialProfile?.university ?? '');
  const [department, setDepartment] = useState(initialProfile?.department ?? '');
  const [regNumber, setRegNumber] = useState(initialProfile?.regNumber ?? '');
  const [linkedin, setLinkedin] = useState(initialProfile?.linkedin ?? '');
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills ?? []);
  const [portfolio, setPortfolio] = useState<string[]>(
    initialProfile?.portfolio ?? [],
  );
  const [available, setAvailable] = useState(initialProfile?.available ?? true);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const canContinue =
    step === 1
      ? university !== '' && department !== '' && regNumber.trim() !== ''
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUri(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      setPortfolio((current) =>
        [...current, ...files.map((f) => URL.createObjectURL(f))].slice(0, 6),
      );
    }
    e.target.value = '';
  };

  const handleContinue = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      onComplete({
        avatarUri,
        bio: bio.trim(),
        university,
        department: department.trim(),
        regNumber: regNumber.trim(),
        linkedin: linkedin.trim(),
        skills,
        portfolio,
        available,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        {/* Header */}
        <div className={styles.headerRow}>
          <button
            className={`${styles.back} ${step === 1 ? styles.backHidden : ''}`}
            onClick={step > 1 ? () => setStep(step - 1) : undefined}
          >
            <ChevronLeftIcon />
          </button>
        </div>
        <p className={styles.title}>Complete Your Profile</p>
        <p className={styles.stepLabel}>
          Step {step} of {TOTAL_STEPS}
        </p>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <>
            {/* Avatar */}
            <div className={styles.avatarWrap}>
              <button
                className={styles.avatar}
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarUri ? (
                  <img src={avatarUri} className={styles.avatarImage} alt="" />
                ) : (
                  <UserIcon size={44} color="#111827" strokeWidth={1.6} />
                )}
                <span className={styles.cameraBadge}>
                  <CameraIcon size={14} />
                </span>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={handleAvatarChange}
              />
            </div>

            <label className={styles.fieldLabel}>Bio</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <label className={styles.fieldLabel}>University</label>
            <SelectField
              placeholder="Type your University"
              value={university}
              options={UNIVERSITIES}
              onSelect={setUniversity}
            />

            <label className={styles.fieldLabel}>Department</label>
            <SelectField
              placeholder="Type your Faculty"
              value={department}
              options={DEPARTMENTS}
              onSelect={setDepartment}
            />

            <label className={styles.fieldLabel}>Reg Number</label>
            <input
              className={styles.input}
              placeholder="Your Registration number"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
            />

            <p className={styles.sectionTitle}>Portfolio Links</p>
            <div className={styles.linkRow}>
              <span className={styles.linkedinBadge}>in</span>
              <input
                className={`${styles.input} ${styles.linkInput}`}
                placeholder="https://linkedin.com.in/yourprofile"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className={styles.stepTitle}>Your Skills</p>
            <p className={styles.stepSubtitle}>
              {'Pick up to 5 skills you want to\noffer clients'}
            </p>
            <div className={styles.chipWrap}>
              {SKILL_OPTIONS.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  selected={skills.includes(skill)}
                  onClick={() => toggleSkill(skill)}
                />
              ))}
            </div>
            <p className={styles.helper}>
              {skills.length}/{MAX_SKILLS} selected
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <p className={styles.stepTitle}>Your Portfolio</p>
            <p className={styles.stepSubtitle}>
              {'Show off your best work — you can\nalways add more later'}
            </p>
            <div className={styles.portfolioGrid}>
              {portfolio.map((uri) => (
                <div key={uri} className={styles.portfolioTile}>
                  <img src={uri} className={styles.portfolioImage} alt="" />
                  <button
                    className={styles.removeBadge}
                    onClick={() =>
                      setPortfolio((current) => current.filter((u) => u !== uri))
                    }
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
              {portfolio.length < 6 && (
                <button
                  className={styles.addTile}
                  onClick={() => portfolioInputRef.current?.click()}
                >
                  <PlusIcon />
                  <span className={styles.addTileLabel}>Add work</span>
                </button>
              )}
            </div>
            <input
              ref={portfolioInputRef}
              type="file"
              accept="image/*"
              multiple
              className={styles.hiddenInput}
              onChange={handlePortfolioChange}
            />

            <div className={styles.availabilityRow}>
              <div className={styles.availabilityText}>
                <span className={styles.availabilityTitle}>Available for work</span>
                <span className={styles.availabilityHint}>
                  Clients can send you offers
                </span>
              </div>
              <button
                role="switch"
                aria-checked={available}
                className={`${styles.toggle} ${available ? styles.toggleOn : ''}`}
                onClick={() => setAvailable((a) => !a)}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>
          </>
        )}
      </div>

      <div className={styles.footer}>
        <PrimaryButton
          label={step === TOTAL_STEPS ? 'Complete Profile' : 'Continue'}
          showIcon={false}
          fullWidth
          disabled={!canContinue}
          onClick={handleContinue}
        />
        {step === 3 && portfolio.length === 0 && (
          <div className={styles.skipRow}>
            <TextButton label="Skip for now" showIcon={false} onClick={handleContinue} />
          </div>
        )}
      </div>
    </div>
  );
}
