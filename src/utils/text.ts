export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9а-щьюяєіїґ\- ]/gi,'').trim().replace(/\s+/g,'-');
}
export function renderMinimalMd(src: string): string {
  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let inUL = false, inOL = false;
  const flushLists = () => { if (inUL) { out.push('</ul>'); inUL=false; } if (inOL){ out.push('</ol>'); inOL=false; } };
  for (let raw of lines) {
    const line = raw.replace(/\t/g,'  ');
    if (/^#{1,6}\s+/.test(line)) { flushLists(); const level = (line.match(/^#+/)![0].length);
      const text = line.replace(/^#{1,6}\s+/,'').trim(); const id = slugify(text);
      out.push(`<h${level} id="${id}">${escapeInline(text)}</h${level}>`); continue; }
    if (/^\s*-\s+/.test(line)) { if (!inUL){ flushLists(); out.push('<ul>'); inUL=true; }
      out.push(`<li>${escapeInline(line.replace(/^\s*-\s+/,''))}</li>`); continue; }
    if (/^\s*\d+\.\s+/.test(line)) { if (!inOL){ flushLists(); out.push('<ol>'); inOL=true; }
      out.push(`<li>${escapeInline(line.replace(/^\s*\d+\.\s+/,''))}</li>`); continue; }
    if (line.trim()===''){ flushLists(); out.push(''); continue; }
    flushLists(); out.push(`<p>${escapeInline(line)}</p>`);
  } flushLists(); return out.join('\n');
}
function escapeInline(t: string) {
  let r = t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  r = r.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'); r = r.replace(/\*(.+?)\*/g,'<em>$1</em>'); return r;
}
export function readabilityMetrics(text: string) {
  const sentences = text.split(/[.!?]+/).map(s=>s.trim()).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const avgSentenceLen = sentences.length ? (words.length / sentences.length) : words.length;
  return { sentences: sentences.length, words: words.length, avgSentenceLen };
}
