export type StudentProfile = {
  university: string;
  course: string;
  level: string;
  skills: string[];
  portfolio: string[];
  bio: string;
  available: boolean;
};

export const ACADEMIC_LEVELS = [
  '100 Level',
  '200 Level',
  '300 Level',
  '400 Level',
  '500 Level',
  'Postgraduate',
] as const;

/** Skill categories from the product requirements. */
export const SKILL_OPTIONS = [
  'UI/UX Design',
  'Graphic Design',
  'Writing',
  'Web Development',
  'Mobile Development',
  'Tutoring',
  'Video Editing',
  'Digital Marketing',
  'Photography',
  'Fashion Design',
  'Catering',
  'Virtual Assistant',
] as const;

export const MAX_SKILLS = 5;
