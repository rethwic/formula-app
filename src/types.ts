export interface Variable {
  symbol: string;
  meaning: string;
}

export type CategoryId =
  | 'algebra'
  | 'geometry'
  | 'calculus'
  | 'physics'
  | 'chemistry'
  | 'compsci';

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  color: string;
  colorSoft: string;
}

export type SubjectId = 'math' | 'science' | 'tech';

export interface Subject {
  id: SubjectId;
  name: string;
  tagline: string;
  color: string;
  colorSoft: string;
  categories: CategoryId[];
}

export interface Formula {
  id: string;
  category: CategoryId;
  label: string;
  title: string;
  latex: string;
  variables: Variable[];
  related?: string[];
  keywords?: string[];
}
