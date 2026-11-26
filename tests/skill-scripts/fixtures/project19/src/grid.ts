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
