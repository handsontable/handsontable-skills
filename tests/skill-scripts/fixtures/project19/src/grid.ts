import Handsontable from 'handsontable/base';
import { registerPlugin, Loading, ExportFile } from 'handsontable/plugins';
import type { Settings } from 'handsontable/plugins/exportFile';
import 'handsontable/languages/sr-SP.js';

registerPlugin(Loading);
registerPlugin(ExportFile);

const hot = new Handsontable(document.getElementById('grid')!, {
  licenseKey: 'non-commercial-and-evaluation',
  language: 'sr-SP',
  height: 'auto',
  rowHeights: 40,
  colWidths: [120, 80],
  columns: [
    { data: 'name' },
    {
      data: 'status',
      type: 'dropdown',
      source: ['open', 'closed'],
      strict: false,
    },
  ],
  beforeInit() {
    console.log('init');
  },
});

hot.addHook('beforeInit', () => {});
hot.getPlugin('manualColumnResize').saveManualColumnWidths();
hot.getPlugin('exportFile').downloadFile('csv', { columnHeaders: true, filename: 'report' });
const exportOptions = {
  columnHeaders: true,
};
const prop = hot.colToProp(3);
hot.spliceCol(1, 1, 1);
import { NON_COMMERCIAL_LICENSE } from '@handsontable/angular-wrapper';
import type { DataProviderOptions } from 'handsontable/plugins/dataProvider';
import { iconsMap } from 'handsontable/themes/static/variables/helpers/iconsMap';
import { registerLanguageDictionary, srSP } from 'handsontable/i18n';
import type {
  Settings as ExportSettings,
} from 'handsontable/plugins/exportFile';

registerLanguageDictionary(srSP);
Handsontable.helper.sanitize('<b>x</b>');
hot.getCopyableData(0, 0);
hot.getPlugin('formulas').registerShortcuts();
hot.getPlugin('mergeCells').mergedCellsCollection.getTopMostRowIndex();
const dateFormat = new Intl.DateTimeFormat('sr-SP');
class StatusEditor extends Handsontable.editors.TextEditor {}
