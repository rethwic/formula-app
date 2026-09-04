import { createContext, useContext } from 'react';
import type { Formula } from '../types';

export interface DetailContextValue {
  openDetail: (formula: Formula, rect: DOMRect | null) => void;
}

export const DetailContext = createContext<DetailContextValue | null>(null);

export function useDetail(): DetailContextValue {
  const ctx = useContext(DetailContext);
  if (!ctx) throw new Error('useDetail must be used within DetailContext.Provider');
  return ctx;
}
