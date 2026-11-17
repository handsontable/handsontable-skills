import type { GridSettings } from 'handsontable/common';

export const settings: GridSettings = {
  formulas: { engine: HyperFormula },
  columns: [
    { type: 'numeric', numericFormat: { pattern: '0,0.00 $', culture: 'de-DE' } },
    {
      type: 'date',
      dateFormat: 'DD/MM/YYYY',
      correctFormat: true,
    },
  ],
};
