// Shared features store — merges UC_FEATURES_SEED with user overrides in localStorage.
// Used by the roadmap tab, the features/Atlas tab, and the edit panel.
// Overrides store per-feature: status, quarter, shipped_at, notes, description (if edited), family (re-classify), customTitle.

const FEATURES_STORAGE_KEY = 'mhwar:features.overrides.v1';

// ---------- Quarters ----------
const QUARTERS = [
  { id: 'q4_2025', label: 'Q4 2025', shortLabel: 'Q4·25', year: 2025, order: 0 },
  { id: 'q1_2026', label: 'Q1 2026', shortLabel: 'Q1·26', year: 2026, order: 1 },
  { id: 'q2_2026', label: 'Q2 2026', shortLabel: 'Q2·26', year: 2026, order: 2 },
  { id: 'q3_2026', label: 'Q3 2026', shortLabel: 'Q3·26', year: 2026, order: 3 },
  { id: 'q4_2026', label: 'Q4 2026', shortLabel: 'Q4·26', year: 2026, order: 4 },
  { id: 'q1_2027', label: 'Q1 2027', shortLabel: 'Q1·27', year: 2027, order: 5 },
  { id: 'backlog', label: 'لاحقًا',  shortLabel: 'لاحقًا',  year: null, order: 6 },
];

// ---------- Statuses — extend the existing 4 with 'on_hold' (kept backwards-compat) ----------
// Existing statuses from features-data.jsx: live, dev, planned, idea
// Add: on_hold.
const EXTENDED_STATUSES = [
  { id: 'live',     label: 'منشور',        short: 'منشور حيّ',              hue: 145, dot: '●', done: true },
  { id: 'dev',      label: 'قيد التطوير',   short: 'شغل جارٍ الآن',          hue: 45,  dot: '◐' },
  { id: 'planned',  label: 'مخطّط',         short: 'ضمن خطة المنتج',         hue: 220, dot: '○' },
  { id: 'idea',     label: 'فكرة',          short: 'اقتراح لم يُقيَّم',       hue: 265, dot: '◇' },
  { id: 'on_hold',  label: 'مؤجّل',         short: 'موقوف بقرار',            hue: 10,  dot: '⏸' },
];

// ---------- Load & save overrides ----------
function _loadOverrides() {
  try {
    const raw = localStorage.getItem(FEATURES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function _saveOverrides(obj) {
  try { localStorage.setItem(FEATURES_STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
}

// ---------- Subscription system ----------
const _subscribers = new Set();
function _notify() { _subscribers.forEach(fn => { try { fn(); } catch (e) {} }); }

// ---------- Public store API ----------
function _getMerged() {
  const overrides = _loadOverrides();
  const seed = window.UC_FEATURES_SEED || [];
  return seed.map(f => {
    const o = overrides[f.id] || {};
    return {
      ...f,
      ...o, // overrides win: status, quarter, shipped_at, notes, desc, name, family, category, order
      _override: o, // for debugging / knowing what's been touched
    };
  });
}

function _update(featureId, patch) {
  const overrides = _loadOverrides();
  overrides[featureId] = { ...(overrides[featureId] || {}), ...patch };
  // clean out empty strings so "reset" works
  Object.keys(overrides[featureId]).forEach(k => {
    if (overrides[featureId][k] === undefined) delete overrides[featureId][k];
  });
  _saveOverrides(overrides);
  _notify();
}

function _resetFeature(featureId) {
  const overrides = _loadOverrides();
  delete overrides[featureId];
  _saveOverrides(overrides);
  _notify();
}

function _resetAll() {
  _saveOverrides({});
  _notify();
}

function _subscribe(fn) {
  _subscribers.add(fn);
  return () => _subscribers.delete(fn);
}

// ---------- Derived helpers ----------
function _isShipped(f) { return f.status === 'live'; }
function _statusMeta(id) { return EXTENDED_STATUSES.find(s => s.id === id) || EXTENDED_STATUSES[0]; }
function _quarterMeta(id) { return QUARTERS.find(q => q.id === id) || QUARTERS[QUARTERS.length - 1]; }

function _stats(features) {
  const total = features.length;
  const shipped = features.filter(_isShipped).length;
  const dev = features.filter(f => f.status === 'dev').length;
  const planned = features.filter(f => f.status === 'planned').length;
  const idea = features.filter(f => f.status === 'idea').length;
  const onHold = features.filter(f => f.status === 'on_hold').length;
  return {
    total, shipped, dev, planned, idea, onHold,
    shippedPct: total ? (shipped / total) : 0,
    remaining: total - shipped,
  };
}

// ---------- React hook for components ----------
function useFeatures() {
  const [, setT] = React.useState(0);
  React.useEffect(() => _subscribe(() => setT(x => x + 1)), []);
  return React.useMemo(() => _getMerged(), []);  // re-evaluated each render because we bumped state
}

// ---------- Export on window ----------
window.featuresStore = {
  getMerged: _getMerged,
  update: _update,
  resetFeature: _resetFeature,
  resetAll: _resetAll,
  subscribe: _subscribe,
  QUARTERS,
  EXTENDED_STATUSES,
  statusMeta: _statusMeta,
  quarterMeta: _quarterMeta,
  stats: _stats,
  isShipped: _isShipped,
  storageKey: FEATURES_STORAGE_KEY,
};
window.useFeatures = useFeatures;

// Dispatch event so slow-loading consumers know the store is ready
try { window.dispatchEvent(new CustomEvent('mhwar:features-store-ready')); } catch (e) {}
