export type StudentProfile = {
  avatarUri: string;
  bio: string;
  university: string;
  department: string;
  regNumber: string;
  linkedin: string;
  skills: string[];
  portfolio: string[];
  available: boolean;
};

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

/** Common departments offered during profile setup. */
export const DEPARTMENTS = [
  'Accounting',
  'Computer Science',
  'Medicine & Surgery',
  'Law',
  'Business Administration',
  'Economics',
  'Mass Communication',
  'Electrical/Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Microbiology',
  'Biochemistry',
  'Nursing Science',
  'Pharmacy',
  'Political Science',
  'International Relations',
  'Banking & Finance',
  'Marketing',
  'Architecture',
  'Psychology',
] as const;

/** Top Nigerian universities offered during profile setup. */
export const UNIVERSITIES = [
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'University of Nigeria, Nsukka (UNN)',
  'Ahmadu Bello University, Zaria (ABU)',
  'Obafemi Awolowo University, Ile-Ife (OAU)',
  'University of Benin (UNIBEN)',
  'University of Port Harcourt (UNIPORT)',
  'University of Ilorin (UNILORIN)',
  'Covenant University, Ota',
  'Lagos State University (LASU)',
  'Federal University of Technology, Akure (FUTA)',
  'Federal University of Technology, Minna (FUTMINNA)',
  'Nnamdi Azikiwe University, Awka (UNIZIK)',
  'Bayero University, Kano (BUK)',
  'University of Jos (UNIJOS)',
  'University of Calabar (UNICAL)',
  'University of Abuja (UNIABUJA)',
  'Rivers State University',
  'Babcock University, Ilishan-Remo',
  'Afe Babalola University, Ado-Ekiti (ABUAD)',
] as const;
