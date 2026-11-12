// Deliberately broken settings for test-skill-scripts.sh.
export default {
  data: [[1, 2]],
  notifications: true,
  persistentState: true,
  afterChang() {},
  persistentStateSave() {},
  columns: [
    { type: 'numeric', numericFormat: { pattern: '0.0', culture: 'de-DE' } },
    { type: 'date', dateFormat: 'DD/MM/YYYY', correctFormat: true },
    { type: 'dropdwn', afterChange() {} },
    { readonly: true },
  ],
};
