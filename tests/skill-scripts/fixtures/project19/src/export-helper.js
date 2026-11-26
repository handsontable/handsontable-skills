export const exportCsv = hot => hot.getPlugin('exportFile').downloadFile('csv', { columnHeaders: true });
