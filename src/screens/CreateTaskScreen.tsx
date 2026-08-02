import { useState } from 'react';

import { ChevronLeftIcon, Chip, PrimaryButton, SelectField } from '../components/ui';
import styles from './CreateTaskScreen.module.css';

const CATEGORY_OPTIONS = [
  'UI/UX Design',
  'Web Development',
  'Mobile App Development',
  'Graphic Design',
  'Content Writing',
  'Data Entry',
  'Video Editing',
  'Other',
] as const;

export type NewTaskDetails = {
  title: string;
  category: string;
  skills: string[];
  budget: number;
  deadline: string;
  description: string;
};

type Props = {
  onBack: () => void;
  onNext: (task: NewTaskDetails) => void;
  /** Pre-fill the form when editing an existing draft (from the Review page). */
  initial?: NewTaskDetails | null;
};

export default function CreateTaskScreen({ onBack, onNext, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [skills, setSkills] = useState<string[]>(
    initial ? initial.skills : ['UI/UX Design', 'Figma', 'Landing Page'],
  );
  const [addingSkill, setAddingSkill] = useState(false);
  const [skillDraft, setSkillDraft] = useState('');
  const [budget, setBudget] = useState(initial ? String(initial.budget) : '');
  const [deadline, setDeadline] = useState(initial?.deadline || '2026-08-24');
  const [description, setDescription] = useState(initial?.description ?? '');
  const heading = initial ? 'Edit Task' : 'Create a New Task';

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const commitSkillDraft = () => {
    const trimmed = skillDraft.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillDraft('');
    setAddingSkill(false);
  };

  const canSubmit =
    title.trim().length > 0 &&
    category.length > 0 &&
    skills.length > 0 &&
    budget.trim().length > 0 &&
    deadline.length > 0 &&
    description.trim().length > 0;

  const handleNext = () => {
    if (!canSubmit) return;
    onNext({
      title: title.trim(),
      category,
      skills,
      budget: parseFloat(budget) || 0,
      deadline,
      description: description.trim(),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={onBack} aria-label="Back">
            <ChevronLeftIcon size={24} />
          </button>
          <p className={styles.title}>{heading}</p>
        </header>

        <label className={styles.fieldLabel} htmlFor="taskTitle">
          Task Title
        </label>
        <input
          id="taskTitle"
          className={styles.textInput}
          placeholder="Design a Landing Page for a Fintech Startup"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p className={styles.fieldLabel}>Category</p>
        <SelectField
          placeholder="UI/UX Design"
          value={category}
          options={CATEGORY_OPTIONS}
          onSelect={setCategory}
        />

        <p className={styles.fieldLabel}>Skills Required</p>
        <div className={styles.chipsRow}>
          {skills.map((skill) => (
            <Chip key={skill} label={skill} selected onClick={() => removeSkill(skill)} />
          ))}
          {addingSkill ? (
            <input
              autoFocus
              className={styles.skillInput}
              value={skillDraft}
              placeholder="Skill name"
              onChange={(e) => setSkillDraft(e.target.value)}
              onBlur={commitSkillDraft}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitSkillDraft();
                if (e.key === 'Escape') {
                  setSkillDraft('');
                  setAddingSkill(false);
                }
              }}
            />
          ) : (
            <button className={styles.addSkillButton} onClick={() => setAddingSkill(true)}>
              + Add
            </button>
          )}
        </div>

        <label className={styles.fieldLabel} htmlFor="taskBudget">
          Budget ($)
        </label>
        <input
          id="taskBudget"
          className={styles.textInput}
          type="number"
          inputMode="decimal"
          placeholder="$10"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <label className={styles.fieldLabel} htmlFor="taskDeadline">
          Deadline
        </label>
        <input
          id="taskDeadline"
          className={styles.dateInput}
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <label className={styles.fieldLabel} htmlFor="taskDescription">
          Description
        </label>
        <textarea
          id="taskDescription"
          className={styles.textarea}
          rows={4}
          placeholder="We need a clean and responsive landing page for our Fintech startup. The design should be modern, professional and aligned with our brand."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={styles.submit}>
          <PrimaryButton
            label="Next"
            showIcon={false}
            fullWidth
            disabled={!canSubmit}
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
}