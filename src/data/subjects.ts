import type { Subject, SubjectId } from '../types';

export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Math',
    tagline: 'Algebra, geometry, calculus & statistics',
    color: '#0A84FF',
    colorSoft: 'rgba(10,132,255,0.28)',
    categories: ['algebra', 'geometry', 'calculus'],
  },
  {
    id: 'science',
    name: 'Science',
    tagline: 'Physics & chemistry',
    color: '#30D158',
    colorSoft: 'rgba(48,209,88,0.28)',
    categories: ['physics', 'chemistry'],
  },
  {
    id: 'tech',
    name: 'Tech',
    tagline: 'Computer science',
    color: '#FF375F',
    colorSoft: 'rgba(255,55,95,0.28)',
    categories: ['compsci'],
  },
];

export const subjectMap: Record<SubjectId, Subject> = subjects.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<SubjectId, Subject>,
);
