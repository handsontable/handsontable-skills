// A file that has nothing to do with the grid.
export const layout = { height: 'auto', rowHeights: 10 };
export const report = () => downloadFile('r.csv', { columnHeaders: true });
export const clean = (s: string) => helper.sanitize(s);
