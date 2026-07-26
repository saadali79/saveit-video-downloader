// nexus-shim.js — replaces Zaro workspace bindings with localStorage
// so the SaveIt app runs anywhere (browser, Capacitor, Electron, etc.)

const LS_DOWNLOADS = 'saveit.downloads';
const LS_SETTINGS  = 'saveit.settings';

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// Seed empty stores
if (!localStorage.getItem(LS_DOWNLOADS)) save(LS_DOWNLOADS, []);
if (!localStorage.getItem(LS_SETTINGS)) save(LS_SETTINGS, [
  { id: 1, key: 'theme', value: 'light' },
  { id: 2, key: 'download_folder', value: '/Downloads/SaveIt' },
  { id: 3, key: 'auto_save_gallery', value: 'true' },
  { id: 4, key: 'auto_delete_failed', value: 'false' },
  { id: 5, key: 'notifications', value: 'true' },
  { id: 6, key: 'language', value: 'en' },
]);

// window.__nexusData — read at app start
window.__nexusData = {
  downloads: load(LS_DOWNLOADS, []),
  settings:  load(LS_SETTINGS,  []),
};

// window.__nexusTableSql — tiny SQL-like handler for the queries this app uses
window.__nexusTableSql = async (tablePath, sql, params = []) => {
  const key = tablePath.includes('downloads') ? LS_DOWNLOADS : LS_SETTINGS;
  const rows = load(key, []);
  const s = sql.trim().toLowerCase();

  try {
    // SELECT
    if (s.startsWith('select')) {
      let out = [...rows];
      if (s.includes('order by id desc')) out.sort((a,b) => b.id - a.id);
      return { success: true, rows: out };
    }
    // INSERT
    if (s.startsWith('insert')) {
      // downloads: (id,title,platform,url,thumbnail,quality,format,size_mb,duration,status,created_at)
      if (key === LS_DOWNLOADS) {
        const [id, title, platform, url, thumbnail, quality, format, size_mb, duration, status, created_at] = params;
        rows.push({ id, title, platform, url, thumbnail, quality, format, size_mb, duration, status, created_at });
      } else {
        const [id, k, v] = params;
        rows.push({ id, key: k, value: v });
      }
      save(key, rows);
      // Refresh __nexusData
      window.__nexusData[key === LS_DOWNLOADS ? 'downloads' : 'settings'] = load(key, []);
      return { success: true, affected: 1 };
    }
    // UPDATE — supports 'update ? set X = ? where Y = ?'
    if (s.startsWith('update')) {
      // parse SET column and WHERE column
      const m = s.match(/set\s+(\w+)\s*=\s*\?\s+where\s+(\w+)\s*=\s*\?/);
      if (!m) return { success: false, error: 'unsupported update' };
      const setCol = m[1], whereCol = m[2];
      const [newVal, whereVal] = params;
      let affected = 0;
      rows.forEach(r => {
        // eslint-disable-next-line eqeqeq
        if (r[whereCol] == whereVal) { r[setCol] = newVal; affected++; }
      });
      save(key, rows);
      window.__nexusData[key === LS_DOWNLOADS ? 'downloads' : 'settings'] = load(key, []);
      return { success: true, affected };
    }
    // DELETE — supports 'delete from ? where id = ?' and 'delete from ? where id > ?'
    if (s.startsWith('delete')) {
      const m = s.match(/where\s+(\w+)\s*(=|>|<|>=|<=)\s*\?/);
      if (!m) return { success: false, error: 'unsupported delete' };
      const col = m[1], op = m[2], val = params[0];
      const before = rows.length;
      const filtered = rows.filter(r => {
        // eslint-disable-next-line eqeqeq
        if (op === '=')  return !(r[col] == val);
        if (op === '>')  return !(r[col] >  val);
        if (op === '<')  return !(r[col] <  val);
        if (op === '>=') return !(r[col] >= val);
        if (op === '<=') return !(r[col] <= val);
        return true;
      });
      save(key, filtered);
      window.__nexusData[key === LS_DOWNLOADS ? 'downloads' : 'settings'] = load(key, []);
      return { success: true, affected: before - filtered.length };
    }
    return { success: false, error: 'unknown sql' };
  } catch (e) {
    return { success: false, error: String(e) };
  }
};

// Stubs — SaveIt doesn't call these, but expose no-ops so any leftover ref won't crash
window.__nexusMutate = () => {};
window.__nexusAction = async () => ({ success: false, error: 'not implemented outside Zaro' });
window.__refreshNexusData = async () => window.__nexusData;
window.__nexusUploadFile = async () => ({ success: false, error: 'not implemented outside Zaro' });
