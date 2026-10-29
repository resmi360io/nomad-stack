// Breaks one long block of prose into several paragraphs at sentence boundaries, for reading
// comfort only. The words are untouched: joining the result with single spaces gives back the
// original text, so what a crawler or screen reader gets is the same content in more <p>s.
//
// A boundary is ". ", "! " or "? " followed by a capital, a digit or an opening quote or bracket,
// and never after the abbreviations below, so "U.S. Bank" or "e.g. Payoneer" does not split.
const NO_SPLIT_AFTER = /(?:\b(?:U\.S|U\.K|e\.g|i\.e|vs|No|approx|St|Inc|Ltd|Co|Mr|Ms|Dr|Jr|Sr|Ave|etc)|\b[A-Z])\.$/;

export function splitParagraphs(text: string, target = 320, minLength = 420): string[] {
  if (text.length < minLength) return [text];
  const sentences: string[] = [];
  let start = 0;
  const boundary = /[.!?]["')\]]?\s+(?=["'(\[]?[A-Z0-9])/g;
  let m: RegExpExecArray | null;
  while ((m = boundary.exec(text)) !== null) {
    const end = m.index + m[0].trimEnd().length;
    const candidate = text.slice(start, end);
    if (NO_SPLIT_AFTER.test(candidate)) continue;
    sentences.push(candidate);
    start = m.index + m[0].length;
  }
  sentences.push(text.slice(start));

  const out: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    current = current ? `${current} ${sentence}` : sentence;
    if (current.length >= target) {
      out.push(current);
      current = '';
    }
  }
  if (current) {
    // A short tail reads better attached to the paragraph before it.
    if (out.length > 0 && current.length < target / 2) out[out.length - 1] += ` ${current}`;
    else out.push(current);
  }
  return out;
}
