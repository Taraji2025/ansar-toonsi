import { useState } from 'react';

const R = '#e70013';

export default function PhotoEdit({ joueur, onClose, onSave }) {
  const [url, setUrl] = useState(joueur.photo || '');
  const [preview, setPreview] = useState(joueur.photo || '');
  const [imgOk, setImgOk] = useState(!!joueur.photo);

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(joueur.nom + ' football Tunisia')}&tbm=isch`;
  const tmUrl = `https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(joueur.nom)}`;

  function handlePreview() {
    setPreview(url);
    setImgOk(false);
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#10101e', border: '1px solid #1e1e30',
        borderTop: `3px solid ${R}`,
        borderRadius: 18, padding: 28, width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{ fontSize: 22 }}>📷</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Photo de {joueur.nom}</div>
            <div style={{ fontSize: 11, color: '#444' }}>Collez l'URL d'une image depuis le web</div>
          </div>
        </div>

        {/* Preview */}
        <div style={{
          width: '100%', height: 180, borderRadius: 12, marginBottom: 16,
          background: '#07070f', border: '1px solid #1a1a2e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
        }}>
          {preview ? (
            <img
              src={preview}
              alt={joueur.nom}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onLoad={() => setImgOk(true)}
              onError={() => setImgOk(false)}
            />
          ) : (
            <div style={{ fontSize: 11, color: '#333', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🖼️</div>
              Aperçu de la photo
            </div>
          )}
          {preview && !imgOk && (
            <div style={{ position: 'absolute', inset: 0, background: '#07070f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 11, color: '#e70013', textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 6 }}>⚠️</div>
                Image non accessible<br/>(CORS ou URL invalide)
              </div>
            </div>
          )}
        </div>

        {/* URL input */}
        <div style={{ marginBottom: 12 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePreview()}
            placeholder="https://... (URL de l'image)"
            style={{
              width: '100%', background: '#07070f', border: '1px solid #1a1a2e',
              borderRadius: 10, color: '#f0f0f0', fontSize: 13, padding: '10px 14px',
              outline: 'none', boxSizing: 'border-box', marginBottom: 8,
            }}
          />
          <button onClick={handlePreview} style={{
            width: '100%', padding: '9px', background: '#1a1a2e', border: '1px solid #2a2a40',
            borderRadius: 10, color: '#888', fontSize: 12, cursor: 'pointer',
          }}>Prévisualiser</button>
        </div>

        {/* Search links */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <a href={googleUrl} target="_blank" rel="noreferrer" style={{
            flex: 1, padding: '8px', background: '#0a3a0a', border: '1px solid #1a5a1a',
            borderRadius: 10, color: '#4ade80', fontSize: 11, textAlign: 'center',
            textDecoration: 'none', fontWeight: 600,
          }}>🔍 Google Images</a>
          <a href={tmUrl} target="_blank" rel="noreferrer" style={{
            flex: 1, padding: '8px', background: '#1a1000', border: '1px solid #3a2800',
            borderRadius: 10, color: '#f59e0b', fontSize: 11, textAlign: 'center',
            textDecoration: 'none', fontWeight: 600,
          }}>⚽ Transfermarkt</a>
        </div>

        <div style={{ fontSize: 10, color: '#333', marginBottom: 18, lineHeight: 1.5 }}>
          💡 <strong style={{ color: '#444' }}>Astuce :</strong> Faites un clic droit sur une image → "Copier l'adresse de l'image" puis collez l'URL ci-dessus.
          Préférez les images .jpg ou .png directes (pas de pages web).
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', background: 'transparent', border: '1px solid #2a2a3a',
            borderRadius: 10, color: '#555', fontSize: 13, cursor: 'pointer',
          }}>Annuler</button>
          {joueur.photo && (
            <button onClick={() => onSave(joueur.id, '')} style={{
              padding: '11px 14px', background: '#1a0005', border: '1px solid #3a000f',
              borderRadius: 10, color: '#e70013', fontSize: 12, cursor: 'pointer',
            }}>🗑️</button>
          )}
          <button
            onClick={() => imgOk && onSave(joueur.id, url)}
            disabled={!imgOk}
            style={{
              flex: 2, padding: '11px', cursor: imgOk ? 'pointer' : 'not-allowed',
              background: imgOk ? `linear-gradient(135deg, ${R}, #8a000c)` : '#1a0005',
              border: 'none', borderRadius: 10,
              color: imgOk ? '#fff' : '#444',
              fontSize: 13, fontWeight: 700,
              boxShadow: imgOk ? '0 4px 16px #e7001450' : 'none',
              transition: 'all 0.15s',
            }}
          >{imgOk ? '✓ Enregistrer' : 'Prévisualiser d\'abord'}</button>
        </div>
      </div>
    </div>
  );
}
