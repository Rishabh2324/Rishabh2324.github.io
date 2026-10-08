/**
 * A tiny declarative form engine — the same idea as the production engine,
 * scaled down: JSON schema in, reactive, validated UI out.
 */
export type FieldType = "text" | "email" | "select" | "range" | "checkbox" | "output";

export interface FieldSchema {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  validation?: { minLength?: number; maxLength?: number; pattern?: string };
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number | boolean;
  visibleWhen?: { field: string; equals: string | number | boolean };
  format?: "currency" | "number";
  compute?: { base?: number; terms: Record<string, number> };
}

export interface FormSchema {
  title: string;
  fields: FieldSchema[];
}

export type FormState = Record<string, string | number | boolean>;

const TYPES: FieldType[] = ["text", "email", "select", "range", "checkbox", "output"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Parses + structurally validates a schema string. Returns a readable error on failure. */
export function parseSchema(source: string): { schema?: FormSchema; error?: string } {
  let raw: any;
  try {
    raw = JSON.parse(source);
  } catch (e) {
    return { error: (e as Error).message.replace(/^JSON\.parse: /, "") };
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { error: "Schema must be an object" };
  if (typeof raw.title !== "string") return { error: '"title" must be a string' };
  if (!Array.isArray(raw.fields)) return { error: '"fields" must be an array' };
  const ids = new Set<string>();
  for (const [i, f] of raw.fields.entries()) {
    const at = `fields[${i}]`;
    if (!f || typeof f !== "object") return { error: `${at} must be an object` };
    if (typeof f.id !== "string" || !f.id) return { error: `${at}.id must be a non-empty string` };
    if (ids.has(f.id)) return { error: `Duplicate field id "${f.id}"` };
    ids.add(f.id);
    if (typeof f.label !== "string") return { error: `${at}.label must be a string` };
    if (!TYPES.includes(f.type)) return { error: `${at}.type must be one of ${TYPES.join(", ")}` };
    if (f.type === "select" && (!Array.isArray(f.options) || f.options.length === 0))
      return { error: `${at}.options must be a non-empty array` };
    if (f.type === "output" && (!f.compute || typeof f.compute.terms !== "object"))
      return { error: `${at}.compute.terms is required for output fields` };
  }
  return { schema: raw as FormSchema };
}

const defaultFor = (f: FieldSchema): string | number | boolean => {
  if (f.defaultValue !== undefined) return f.defaultValue;
  if (f.type === "checkbox") return false;
  if (f.type === "range") return f.min ?? 0;
  if (f.type === "select") return f.options?.[0] ?? "";
  return "";
};

function compute(f: FieldSchema, state: FormState) {
  const { base = 0, terms } = f.compute!;
  return Object.entries(terms).reduce((sum, [key, coef]) => {
    const v = state[key];
    return sum + (typeof v === "boolean" ? (v ? coef : 0) : (Number(v) || 0) * coef);
  }, base);
}

function validate(f: FieldSchema, value: unknown): string | null {
  if (f.type !== "text" && f.type !== "email") return null;
  const v = String(value ?? "").trim();
  if (f.required && !v) return "Required";
  if (!v) return null;
  if (f.type === "email" && !EMAIL.test(v)) return "Enter a valid email";
  const rules = f.validation;
  if (rules?.minLength && v.length < rules.minLength) return `At least ${rules.minLength} characters`;
  if (rules?.maxLength && v.length > rules.maxLength) return `At most ${rules.maxLength} characters`;
  if (rules?.pattern) {
    try {
      if (!new RegExp(rules.pattern).test(v)) return "Invalid format";
    } catch {
      return "Invalid pattern in schema";
    }
  }
  return null;
}

const formatOutput = (f: FieldSchema, n: number) =>
  f.format === "currency" ? `$${Math.round(n).toLocaleString("en-US")}` : n.toLocaleString("en-US");

export interface MountedForm {
  state: FormState;
  fields: HTMLElement[];
  errors: Record<string, string>;
  renderMs: number;
}

export interface MountOptions {
  onChange(form: MountedForm, changedKey?: string): void;
  onVisibility?(el: HTMLElement, visible: boolean): void;
}

let uid = 0;

export function mountForm(container: HTMLElement, schema: FormSchema, opts: MountOptions): MountedForm {
  const t0 = performance.now();
  const prefix = `ef${++uid}`;
  const state: FormState = {};
  const touched = new Set<string>();
  const form: MountedForm = { state, fields: [], errors: {}, renderMs: 0 };
  const nodes = new Map<string, { el: HTMLElement; f: FieldSchema; err?: HTMLElement; out?: HTMLElement; val?: HTMLElement }>();

  schema.fields.forEach((f) => (state[f.id] = f.type === "output" ? 0 : defaultFor(f)));

  container.replaceChildren();
  const title = document.createElement("p");
  title.className = "ef-title";
  title.textContent = schema.title;
  title.dataset.ef = "";
  container.append(title);
  form.fields.push(title);

  for (const f of schema.fields) {
    const id = `${prefix}-${f.id}`;
    const el = document.createElement("div");
    el.className = `ef ef--${f.type}`;
    el.dataset.ef = f.id;
    const entry: { el: HTMLElement; f: FieldSchema; err?: HTMLElement; out?: HTMLElement; val?: HTMLElement } = { el, f };

    const label = document.createElement("label");
    label.htmlFor = id;
    label.className = "ef-label";
    label.textContent = f.label + (f.required ? " *" : "");

    if (f.type === "text" || f.type === "email") {
      const input = document.createElement("input");
      Object.assign(input, { id, type: f.type, placeholder: f.placeholder ?? "", value: String(state[f.id]), autocomplete: "off" });
      input.className = "ef-input";
      input.addEventListener("input", () => update(f.id, input.value));
      input.addEventListener("blur", () => {
        touched.add(f.id);
        update(f.id, input.value);
      });
      entry.err = document.createElement("span");
      entry.err.className = "ef-error";
      entry.err.setAttribute("aria-live", "polite");
      input.setAttribute("aria-describedby", `${id}-err`);
      entry.err.id = `${id}-err`;
      el.append(label, input, entry.err);
    } else if (f.type === "select") {
      const wrap = document.createElement("div");
      wrap.className = "ef-select";
      const select = document.createElement("select");
      select.id = id;
      for (const o of f.options!) select.add(new Option(o, o, false, o === state[f.id]));
      select.addEventListener("change", () => update(f.id, select.value));
      wrap.append(select);
      el.append(label, wrap);
    } else if (f.type === "range") {
      const row = document.createElement("div");
      row.className = "ef-row";
      entry.val = document.createElement("output");
      entry.val.className = "ef-value";
      entry.val.textContent = String(state[f.id]);
      row.append(label, entry.val);
      const input = document.createElement("input");
      Object.assign(input, { id, type: "range", min: String(f.min ?? 0), max: String(f.max ?? 100), step: String(f.step ?? 1), value: String(state[f.id]) });
      input.className = "ef-range";
      const paint = () => {
        const pct = ((Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min))) * 100;
        input.style.setProperty("--fill", `${pct}%`);
      };
      paint();
      input.addEventListener("input", () => {
        paint();
        entry.val!.textContent = input.value;
        update(f.id, Number(input.value));
      });
      el.append(row, input);
    } else if (f.type === "checkbox") {
      const toggle = document.createElement("label");
      toggle.className = "ef-toggle";
      toggle.htmlFor = id;
      const input = document.createElement("input");
      Object.assign(input, { id, type: "checkbox", checked: Boolean(state[f.id]) });
      input.setAttribute("role", "switch");
      input.addEventListener("change", () => update(f.id, input.checked));
      const sw = document.createElement("span");
      sw.className = "ef-switch";
      sw.setAttribute("aria-hidden", "true");
      const text = document.createElement("span");
      text.textContent = f.label;
      toggle.append(input, sw, text);
      el.append(toggle);
    } else {
      const lbl = document.createElement("span");
      lbl.className = "ef-label";
      lbl.textContent = f.label;
      entry.out = document.createElement("output");
      entry.out.className = "ef-output";
      entry.out.setAttribute("aria-live", "polite");
      el.append(lbl, entry.out);
    }

    nodes.set(f.id, entry);
    container.append(el);
    form.fields.push(el);
  }

  const isVisible = (f: FieldSchema) => !f.visibleWhen || state[f.visibleWhen.field] === f.visibleWhen.equals;

  function sync(changedKey?: string, initial = false) {
    form.errors = {};
    for (const { el, f, err, out } of nodes.values()) {
      const visible = isVisible(f);
      if (visible !== !el.hidden || initial) {
        if (initial) el.hidden = !visible;
        else opts.onVisibility ? opts.onVisibility(el, visible) : (el.hidden = !visible);
      }
      if (f.type === "output") {
        state[f.id] = compute(f, state);
        out!.textContent = formatOutput(f, state[f.id] as number);
      }
      const message = visible ? validate(f, state[f.id]) : null;
      if (message) form.errors[f.id] = message;
      if (err) {
        const show = message && touched.has(f.id) ? message : "";
        err.textContent = show;
        el.classList.toggle("is-invalid", Boolean(show));
        el.classList.toggle("is-valid", touched.has(f.id) && !message);
      }
    }
    opts.onChange(form, changedKey);
  }

  function update(key: string, value: string | number | boolean) {
    state[key] = value;
    if (typeof value === "string" && value.length > 0) touched.add(key);
    sync(key);
  }

  form.renderMs = performance.now() - t0;
  sync(undefined, true);
  return form;
}

/** Visible-field snapshot for the live state panel. */
export function visibleState(schema: FormSchema, state: FormState): FormState {
  const out: FormState = {};
  for (const f of schema.fields) {
    if (!f.visibleWhen || state[f.visibleWhen.field] === f.visibleWhen.equals) out[f.id] = state[f.id];
  }
  return out;
}
