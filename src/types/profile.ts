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

/** Popular courses of study offered during profile setup. */
export const COURSES = [
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
