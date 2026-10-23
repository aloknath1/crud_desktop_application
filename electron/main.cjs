const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const dataFile = () => path.join(app.getPath('userData'), 'records.json');
async function readRecords() {
  try { return JSON.parse(await fs.readFile(dataFile(), 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return []; throw e; }
}
async function writeRecords(records) {
  const file = dataFile();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(records, null, 2), 'utf8');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100, height: 760, minWidth: 760, minHeight: 560,
    title: 'CRUD Desktop',
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  if (!app.isPackaged) win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173');
  else win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

ipcMain.handle('records:list', () => readRecords());
ipcMain.handle('records:save', async (_event, input) => {
  if (!input || typeof input.name !== 'string' || !input.name.trim()) throw new Error('Name is required.');
  const records = await readRecords();
  const now = new Date().toISOString();
  if (input.id) {
    const index = records.findIndex(r => r.id === input.id);
    if (index < 0) throw new Error('Record not found.');
    records[index] = { ...records[index], name: input.name.trim(), email: String(input.email || '').trim(), phone: String(input.phone || '').trim(), updatedAt: now };
    await writeRecords(records);
    return records[index];
  }
  const record = { id: crypto.randomUUID(), name: input.name.trim(), email: String(input.email || '').trim(), phone: String(input.phone || '').trim(), createdAt: now, updatedAt: now };
  records.unshift(record); await writeRecords(records); return record;
});
ipcMain.handle('records:delete', async (_event, id) => {
  const records = await readRecords();
  const next = records.filter(r => r.id !== id);
  await writeRecords(next);
  return { success: next.length !== records.length };
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
