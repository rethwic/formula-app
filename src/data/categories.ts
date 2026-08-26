import type { Category, CategoryId } from '../types';

export const categories: Category[] = [
  { id: 'algebra', name: 'Algebra & Precalculus', short: 'Algebra', color: '#0A84FF', colorSoft: 'rgba(10,132,255,0.28)' },
  { id: 'geometry', name: 'Geometry & Trigonometry', short: 'Geometry', color: '#5AC8FA', colorSoft: 'rgba(90,200,250,0.28)' },
  { id: 'calculus', name: 'Calculus & Statistics', short: 'Calc & Stats', color: '#BF5AF2', colorSoft: 'rgba(191,90,242,0.28)' },
  { id: 'physics', name: 'Physics', short: 'Physics', color: '#FF9F0A', colorSoft: 'rgba(255,159,10,0.28)' },
  { id: 'chemistry', name: 'Chemistry', short: 'Chemistry', color: '#30D158', colorSoft: 'rgba(48,209,88,0.28)' },
  { id: 'compsci', name: 'Computer Science', short: 'CS & Tech', color: '#FF375F', colorSoft: 'rgba(255,55,95,0.28)' },
];

export const categoryMap: Record<CategoryId, Category> = categories.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CategoryId, Category>,
);
