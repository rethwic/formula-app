import { useMemo } from 'react';
import katex from 'katex';

export function Katex({ math, block = false }: { math: string; block?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, { throwOnError: false, displayMode: block });
    } catch {
      return math;
    }
  }, [math, block]);
  // eslint-disable-next-line react/no-danger
  return <span className="katex-wrap" dangerouslySetInnerHTML={{ __html: html }} />;
}
