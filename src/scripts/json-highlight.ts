const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],])/g;

/** Wraps JSON tokens in spans; tolerant of invalid JSON so it can run while typing. */
export function highlightJson(source: string): string {
  let out = "";
  let last = 0;
  for (const m of source.matchAll(TOKEN)) {
    out += escape(source.slice(last, m.index));
    const [whole, str, colon, lit, num, punct] = m;
    if (str) out += colon ? `<span class="tk-key">${escape(str)}</span>${colon}` : `<span class="tk-str">${escape(str)}</span>`;
    else if (lit) out += `<span class="tk-lit">${lit}</span>`;
    else if (num) out += `<span class="tk-num">${num}</span>`;
    else if (punct) out += `<span class="tk-punct">${punct}</span>`;
    else out += escape(whole);
    last = (m.index ?? 0) + whole.length;
  }
  return out + escape(source.slice(last));
}

const MAX_INLINE = 60;

const inline = (v: unknown) =>
  JSON.stringify(v, null, 1)
    .replace(/\n\s*/g, " ")
    .replace(/\[ /g, "[")
    .replace(/ \]/g, "]");

function fmt(v: unknown, depth: number, key: string | null, last: boolean, out: string[], force = false) {
  const pad = "  ".repeat(depth);
  const prefix = pad + (key !== null ? `${JSON.stringify(key)}: ` : "");
  const comma = last ? "" : ",";
  const one = inline(v);
  if (v === null || typeof v !== "object" || (!force && prefix.length + one.length + comma.length <= MAX_INLINE)) {
    out.push(prefix + one + comma);
    return;
  }
  const isArray = Array.isArray(v);
  const entries: [string | null, unknown][] = isArray
    ? (v as unknown[]).map((x) => [null, x])
    : Object.entries(v as Record<string, unknown>);
  out.push(prefix + (isArray ? "[" : "{"));
  entries.forEach(([k, x], i) => fmt(x, depth + 1, k, i === entries.length - 1, out));
  out.push(pad + (isArray ? "]" : "}") + comma);
}

/**
 * Compact, editor-style formatting for a `{ title, fields[] }` schema. Small
 * objects/arrays stay inline; each field is its own block, and the line range
 * of every field is returned so the UI can assemble in sync with the code.
 */
export function formatSchema(schema: { fields: unknown[]; [key: string]: unknown }) {
  const lines: string[] = ["{"];
  for (const [k, v] of Object.entries(schema)) {
    if (k !== "fields") fmt(v, 1, k, false, lines);
  }
  lines.push('  "fields": [');
  const ranges: [number, number][] = [];
  schema.fields.forEach((field, i) => {
    const start = lines.length;
    fmt(field, 2, null, i === schema.fields.length - 1, lines, true);
    ranges.push([start, lines.length - 1]);
  });
  lines.push("  ]", "}");
  return { text: lines.join("\n"), lines, ranges };
}

/** One highlighted HTML string per source line. Assumes tokens never span lines (true for JSON). */
export function highlightLines(source: string): string[] {
  return source.split("\n").map((line) => highlightJson(line));
}
