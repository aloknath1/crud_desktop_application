import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function refresh() { try { setRecords(await window.recordsAPI.list()); } catch (e) { setError(e.message || 'Could not load records.'); } finally { setLoading(false); } }
  useEffect(() => { refresh(); }, []);
  const filtered = useMemo(() => { const q = search.trim().toLowerCase(); return records.filter(r => [r.name, r.email, r.phone].some(v => (v || '').toLowerCase().includes(q))); }, [records, search]);
  function resetForm() { setForm({ name: '', email: '', phone: '' }); setEditingId(null); setError(''); }
  async function submit(e) {
    e.preventDefault(); setError('');
    if (!form.name.trim()) { setError('Please enter a name.'); return; }
    try { await window.recordsAPI.save({ ...form, id: editingId }); await refresh(); resetForm(); }
    catch (e) { setError(e.message || 'Could not save record.'); }
  }
  function edit(record) { setForm({ name: record.name, email: record.email || '', phone: record.phone || '' }); setEditingId(record.id); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function remove(record) { if (!window.confirm(`Delete ${record.name}? This cannot be undone.`)) return; try { await window.recordsAPI.remove(record.id); if (editingId === record.id) resetForm(); await refresh(); } catch (e) { setError(e.message || 'Could not delete record.'); } }
  const date = value => value ? new Date(value).toLocaleDateString() : '—';

  return <main className="shell">
    <header className="topbar"><div className="brand-mark">C</div><div><div className="eyebrow">OFFLINE DESKTOP TOOL</div><h1>CRUD Desktop</h1><p className="subtitle">Manage your contacts in one simple place.</p></div><div className="local-badge"><span/> Saved locally</div></header>
    <section className="stats"><div className="stat-card"><span className="stat-icon">▤</span><div><p>Total records</p><strong>{records.length}</strong></div></div><div className="stat-card"><span className="stat-icon green">✓</span><div><p>Storage</p><strong className="small-stat">On this device</strong></div></div></section>
    <section className="panel form-panel"><div className="section-heading"><div><h2>{editingId ? 'Edit contact' : 'Add a contact'}</h2><p>{editingId ? 'Update the details below.' : 'Enter contact details to create a new record.'}</p></div>{editingId && <button className="button ghost" onClick={resetForm}>Cancel edit</button>}</div>
      <form onSubmit={submit}><div className="fields"><label>Full name <span>*</span><input value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Priya Sharma" autoFocus required maxLength={120}/></label><label>Email address<input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="name@example.com" maxLength={254}/></label><label>Phone number<input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="e.g. +91 98765 43210" maxLength={40}/></label></div>
      {error && <div className="error" role="alert">{error}</div>}<div className="form-actions"><span className="hint">* Required field</span><button className="button primary" type="submit">{editingId ? '✓  Save changes' : '+  Add contact'}</button></div></form>
    </section>
    <section className="panel list-panel"><div className="section-heading list-heading"><div><h2>Your contacts <span className="count">{filtered.length}</span></h2><p>Search, edit or remove saved records.</p></div><div className="search-wrap"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." aria-label="Search contacts"/></div></div>
      {loading ? <div className="empty">Loading contacts…</div> : filtered.length === 0 ? <div className="empty"><div className="empty-icon">⌕</div><strong>{search ? 'No matching contacts' : 'No contacts yet'}</strong><p>{search ? 'Try another search term.' : 'Add your first contact using the form above.'}</p></div> : <div className="table-scroll"><table><thead><tr><th>CONTACT</th><th>EMAIL</th><th>PHONE</th><th>ADDED</th><th className="actions-head">ACTIONS</th></tr></thead><tbody>{filtered.map(r => <tr key={r.id}><td><div className="person"><div className="avatar">{r.name.trim().charAt(0).toUpperCase()}</div><strong>{r.name}</strong></div></td><td className="muted">{r.email || '—'}</td><td className="muted">{r.phone || '—'}</td><td className="muted">{date(r.createdAt)}</td><td><div className="row-actions"><button className="icon-button" onClick={() => edit(r)} title="Edit contact" aria-label={`Edit ${r.name}`}>✎</button><button className="icon-button delete" onClick={() => remove(r)} title="Delete contact" aria-label={`Delete ${r.name}`}>⌫</button></div></td></tr>)}</tbody></table></div>}
    </section><footer><span>CRUD Desktop <span className="dot">•</span> Version 1.0.0</span><span>Your data stays on this device.</span></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
