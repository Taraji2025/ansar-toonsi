import { useState } from 'react';
import { POSTES, NIVEAUX } from '../data/joueurs';

const STATUTS = [
  { val: 'confirmed',         label: '✓ Confirmé' },
  { val: 'reported_eligible', label: '~ Éligible' },
  { val: 'a_confirmer',       label: '? À confirmer' },
];

export default function EditJoueurModal({ joueur, onSave, onClose }) {
  const [form, setForm] = useState({
    nom:               joueur.nom,
    poste:             joueur.poste,
    niveau:            joueur.niveau,
    club:              joueur.club,
    pays_club:         joueur.pays_club,
    age:               joueur.age ?? '',
    selection:         joueur.selection,
    matchs_selection:  joueur.matchs_selection,
    photo:             joueur.photo,
    statut:            joueur.statut,
    matchs:            joueur.stats.matchs,
    buts:              joueur.stats.buts,
    passes:            joueur.stats.passes,
    cartons_jaunes:    joueur.stats.cartons_jaunes,
    cartons_rouges:    joueur.stats.cartons_rouges,
    clean_sheets:      joueur.stats.clean_sheets,
  });

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function handleSave(e) {
    e.preventDefault();
    onSave({
      ...joueur,
      nom:              form.nom,
      poste:            form.poste,
      niveau:           form.niveau,
      club:             form.club,
      pays_club:        form.pays_club,
      age:              form.age === '' ? null : Number(form.age),
      selection:        form.selection,
      matchs_selection: Number(form.matchs_selection),
      photo:            form.photo,
      statut:           form.statut,
      stats: {
        matchs:         Number(form.matchs),
        buts:           Number(form.buts),
        passes:         Number(form.passes),
        cartons_jaunes: Number(form.cartons_jaunes),
        cartons_rouges: Number(form.cartons_rouges),
        clean_sheets:   Number(form.clean_sheets),
      },
    });
  }

  return (
    <div className="at-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="at-modal" style={{ maxWidth: 520 }}>

        <div className="at-modal-header-bg">
          <div className="at-modal-header-glow" style={{ background: '#e70013' }} />
          <button className="at-modal-close" onClick={onClose}>×</button>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
            ✏️ Modifier · {joueur.nom}
          </div>
        </div>

        <form onSubmit={handleSave} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>

          {/* Identité */}
          <div className="at-edit-section-title">Identité</div>
          <div className="at-edit-row">
            <label>Nom complet</label>
            <input className="at-input" value={form.nom} onChange={e => set('nom', e.target.value)} />
          </div>
          <div className="at-edit-grid">
            <div className="at-edit-row">
              <label>Poste</label>
              <select className="at-select" value={form.poste} onChange={e => set('poste', e.target.value)}>
                {POSTES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="at-edit-row">
              <label>Niveau</label>
              <select className="at-select" value={form.niveau} onChange={e => set('niveau', e.target.value)}>
                {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="at-edit-row">
              <label>Âge</label>
              <input className="at-input" type="number" min="14" max="45" value={form.age} onChange={e => set('age', e.target.value)} placeholder="—" />
            </div>
            <div className="at-edit-row">
              <label>Statut éligibilité</label>
              <select className="at-select" value={form.statut} onChange={e => set('statut', e.target.value)}>
                {STATUTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Club */}
          <div className="at-edit-section-title">Club</div>
          <div className="at-edit-grid">
            <div className="at-edit-row">
              <label>Club</label>
              <input className="at-input" value={form.club} onChange={e => set('club', e.target.value)} />
            </div>
            <div className="at-edit-row">
              <label>Pays</label>
              <input className="at-input" value={form.pays_club} onChange={e => set('pays_club', e.target.value)} />
            </div>
          </div>

          {/* Photo */}
          <div className="at-edit-section-title">Photo</div>
          <div className="at-edit-row">
            <label>URL de la photo</label>
            <input className="at-input" value={form.photo} onChange={e => set('photo', e.target.value)} placeholder="https://..." />
          </div>
          {form.photo && (
            <img
              src={form.photo}
              alt="preview"
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', alignSelf: 'center' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}

          {/* Sélection */}
          <div className="at-edit-section-title">Sélection nationale</div>
          <div className="at-edit-grid">
            <div className="at-edit-row" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <label>En sélection</label>
              <input type="checkbox" checked={form.selection} onChange={e => set('selection', e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#e70013' }} />
            </div>
            <div className="at-edit-row">
              <label>Matchs sélection</label>
              <input className="at-input" type="number" min="0" value={form.matchs_selection} onChange={e => set('matchs_selection', e.target.value)} />
            </div>
          </div>

          {/* Stats */}
          <div className="at-edit-section-title">Statistiques saison</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { key: 'matchs',         label: 'Matchs' },
              { key: 'buts',           label: 'Buts' },
              { key: 'passes',         label: 'Passes D.' },
              { key: 'cartons_jaunes', label: 'Cartons J.' },
              { key: 'cartons_rouges', label: 'Cartons R.' },
              { key: 'clean_sheets',   label: 'Clean Sheets' },
            ].map(({ key, label }) => (
              <div key={key} className="at-edit-row">
                <label>{label}</label>
                <input className="at-input" type="number" min="0" value={form[key]} onChange={e => set(key, e.target.value)} />
              </div>
            ))}
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '11px 0', background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              Annuler
            </button>
            <button type="submit" style={{
              flex: 2, padding: '11px 0', background: '#e70013', border: 'none',
              borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              💾 Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
