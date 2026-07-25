/** Mock marketplace data used until a backend is connected. */

export type TaskCategory = string;

export type TaskStatus = 'open' | 'assigned' | 'in_progress' | 'completed';

export type AssignedStudent = {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewCount: number;
  school: string;
  skills: string[];
  avatarUrl?: string;
};

export type Task = {
  id: string;
  title: string;
  client: string;
  category: TaskCategory;
  dueInDays: number;
  dueDate: string;
  budget: number;
  status: TaskStatus;
  assignedStudentId?: string;
  assignedStudent?: AssignedStudent;
  featured?: boolean;
  description: string;
  skills: string[];
  attachments: { name: string; size: string; kind: 'pdf' | 'image' }[];
};

export const STUDENTS: AssignedStudent[] = [
  {
    id: 'student-1',
    name: 'Miracle Igboanusi',
    role: 'UI/UX Designer',
    rating: 4.8,
    reviewCount: 32,
    school: 'University of Lagos',
    skills: ['UI/UX Design', 'Figma', 'Landing Page'],
  },
  {
    id: 'student-2',
    name: 'Amina Bello',
    role: 'Front-End Developer',
    rating: 4.9,
    reviewCount: 28,
    school: 'University of Ibadan',
    skills: ['React', 'TypeScript', 'CSS'],
  },
];

function findStudentById(studentId: string) {
  return STUDENTS.find((student) => student.id === studentId) ?? null;
}

export function assignStudent(taskId: string, studentId: string) {
  const task = TASKS.find((item) => item.id === taskId);
  if (!task) return null;
  if (task.status !== 'open') return null;

  const student = findStudentById(studentId);
  if (!student) return null;

  task.status = 'assigned';
  task.assignedStudentId = student.id;
  task.assignedStudent = student;
  return task;
}

export function assignFirstAvailableStudent(taskId: string) {
  const student = STUDENTS[0] ?? null;
  if (!student) return null;
  return assignStudent(taskId, student.id);
}

export const TASKS: Task[] = [
  {
    id: 'mobile-app-ui',
    title: 'Mobile App UI Design',
    client: 'TechNova Ltd',
    category: 'Design',
    dueInDays: 5,
    dueDate: 'August 20, 2026',
    budget: 10,
    status: 'open',
    featured: true,
    description:
      'We need a clean and modern UI design for our mobile application. The app is for booking services across Nigeria and should feel friendly, fast and trustworthy. Deliver screens for onboarding, home, booking and payments.',
    skills: ['UI/UX Design', 'Figma', 'Mobile Design'],
    attachments: [
      { name: 'BRIEF.pdf', size: '1.2 MB', kind: 'pdf' },
      { name: 'Wireframe.sketch', size: '2.4 MB', kind: 'image' },
    ],
  },
  {
    id: 'landing-page',
    title: 'Website Landing Page',
    client: 'StartupBase',
    category: 'Development',
    dueInDays: 7,
    dueDate: 'August 22, 2026',
    budget: 25,
    status: 'open',
    description:
      'Build a responsive marketing landing page from an existing Figma design. Should be fast, accessible and easy to update.',
    skills: ['React', 'HTML/CSS', 'Responsive'],
    attachments: [{ name: 'design.fig', size: '3.1 MB', kind: 'image' }],
  },
  {
    id: 'blog-articles',
    title: 'SEO Blog Articles',
    client: 'GreenLeaf Media',
    category: 'Writing',
    dueInDays: 4,
    dueDate: 'August 19, 2026',
    budget: 15,
    status: 'open',
    description:
      'Write four SEO-optimised blog articles (800–1000 words each) on sustainable living for a Nigerian audience.',
    skills: ['Writing', 'SEO', 'Research'],
    attachments: [{ name: 'topics.pdf', size: '0.4 MB', kind: 'pdf' }],
  },
];

export type BidStatus = 'Approved' | 'Rejected' | 'Pending';

export type Bid = {
  id: string;
  title: string;
  client: string;
  dueInDays: number;
  budget: number;
  status: BidStatus;
  group: 'Active' | 'Pending' | 'Won';
};

export const BIDS: Bid[] = [
  {
    id: 'b1',
    title: 'Mobile App UI Design',
    client: 'TechNova Ltd',
    dueInDays: 5,
    budget: 10,
    status: 'Approved',
    group: 'Active',
  },
  {
    id: 'b2',
    title: 'Website Landing Page',
    client: 'StartupBase',
    dueInDays: 7,
    budget: 25,
    status: 'Rejected',
    group: 'Active',
  },
  {
    id: 'b3',
    title: 'Social Media Post Design',
    client: 'ShopEasy',
    dueInDays: 2,
    budget: 10,
    status: 'Pending',
    group: 'Pending',
  },
];

export type Project = {
  id: string;
  title: string;
  client: string;
  dueInDays: number;
  budget: number;
  status: 'In Progress' | 'Completed';
};

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Mobile App UI Design',
    client: 'SkillBridge Africa',
    dueInDays: 5,
    budget: 10,
    status: 'In Progress',
  },
];

export const DELIVERY_OPTIONS = [
  '1 day',
  '2 days',
  '3 days',
  '5 days',
  '1 week',
  '2 weeks',
] as const;
