import { useRef, useState } from 'react';

import {
  Chip,
  ChevronLeftIcon,
  CloseIcon,
  GraduationCapIcon,
  PlusIcon,
  PrimaryButton,
  SelectField,
  StepProgress,
  TextButton,
  TextField,
  UserIcon,
} from '../components/ui';
import {
  ACADEMIC_LEVELS,
  COURSES,
  MAX_SKILLS,
  SKILL_OPTIONS,
  UNIVERSITIES,
} from '../types/profile';
import type { StudentProfile } from '../types/profile';
import styles from './ProfileSetupScreen.module.css';

const TOTAL_STEPS = 4;

type Props = {
  initialProfile?: StudentProfile | null;
  onComplete: (profile: StudentProfile) => void;
};

export default function ProfileSetupScreen({ initialProfile, onComplete }: Props) {
  const [step, setStep] = useState(1);

  const [university, setUniversity] = useState(initialProfile?.university ?? '');
  const [course, setCourse] = useState(initialProfile?.course ?? '');
  const [level, setLevel] = useState(initialProfile?.level ?? '');
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills ?? []);
  const [portfolio, setPortfolio] = useState<string[]>(initialProfile?.portfolio ?? []);
  const [bio, setBio] = useState(initialProfile?.bio ?? '');
  const [available, setAvailable] = useState(initialProfile?.available ?? true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canContinue =
    step === 1
      ? university !== '' && course !== '' && level !== ''
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

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const uris = Array.from(files).map((f) => URL.createObjectURL(f));
      setPortfolio((current) => [...current, ...uris].slice(0, 6));
    }
    e.target.value = '';
  };

  const removePortfolioImage = (uri: string) => {
    setPortfolio((current) => current.filter((u) => u !== uri));
  };

  const handleContinue = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      onComplete({
        university,
        course,
        level,
        skills,
        portfolio,
        bio: bio.trim(),
        available,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <button
            type="button"
            className={`${styles.back} ${step === 1 ? styles.backHidden : ''}`}
            onClick={step > 1 ? () => setStep(step - 1) : undefined}
          >
            <ChevronLeftIcon />
          </button>
        </div>
        <StepProgress step={step} totalSteps={TOTAL_STEPS} />
      </div>

      <div className={styles.scroll}>
        <div className={styles.content}>
          {step === 1 && (
            <>
              <span className={styles.title}>Your University</span>
              <p className={styles.subtitle}>
                Tell us where you study — this is how
                <br />
                you get verified
              </p>
              <div className={styles.form}>
                <SelectField
                  icon={<GraduationCapIcon size={20} color="#6b7280" />}
                  placeholder="University"
                  value={university}
                  options={UNIVERSITIES}
                  onSelect={setUniversity}
                />
                <SelectField
                  icon={<UserIcon />}
                  placeholder="Course of Study"
                  value={course}
                  options={COURSES}
                  onSelect={setCourse}
                />
                <span className={styles.fieldLabel}>Current level</span>
                <div className={styles.chipWrap}>
                  {ACADEMIC_LEVELS.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      selected={level === option}
                      onClick={() => setLevel(option)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <span className={styles.title}>Your Skills</span>
              <p className={styles.subtitle}>
                Pick up to {MAX_SKILLS} skills you want to
                <br />
                offer clients
              </p>
              <div className={`${styles.chipWrap} ${styles.form}`}>
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
              <span className={styles.title}>Your Portfolio</span>
              <p className={styles.subtitle}>
                Show off your best work — you can
                <br />
                always add more later
              </p>
              <div className={styles.portfolioGrid}>
                {portfolio.map((uri) => (
                  <div key={uri} className={styles.portfolioTile}>
                    <img src={uri} className={styles.portfolioImage} alt="" />
                    <button
                      type="button"
                      className={styles.removeBadge}
                      onClick={() => removePortfolioImage(uri)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
                {portfolio.length < 6 && (
                  <button
                    type="button"
                    className={styles.addTile}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PlusIcon />
                    <span className={styles.addTileLabel}>Add work</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className={styles.hiddenInput}
                onChange={handleFilesSelected}
              />
            </>
          )}

          {step === 4 && (
            <>
              <span className={styles.title}>Almost Done</span>
              <p className={styles.subtitle}>Tell clients a little about yourself</p>
              <div className={styles.form}>
                <TextField
                  placeholder="Short bio — what do you do best?"
                  value={bio}
                  onChange={setBio}
                  multiline
                />
                <div className={styles.availabilityRow}>
                  <div className={styles.availabilityText}>
                    <span className={styles.availabilityTitle}>Available for work</span>
                    <span className={styles.availabilityHint}>
                      Clients can send you offers
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={available}
                    className={`${styles.toggle} ${available ? styles.toggleOn : ''}`}
                    onClick={() => setAvailable((v) => !v)}
                  >
                    <span className={styles.knob} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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
