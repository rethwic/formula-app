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
}

export type SubjectId = 'math' | 'science' | 'tech';

export interface Subject {
  id: SubjectId;
  name: string;
  tagline: string;
  categories: CategoryId[];
}

export interface CalcVar {
  key: string;
  symbol: string;
  defaultValue?: number;
}

export interface FormulaCalc {
  vars: CalcVar[];
  residual: (values: Record<string, number>) => number;
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
  calc?: FormulaCalc;
}
