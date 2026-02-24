export default function LinkList({ links, onCheck, loading }) {
  if (!links.length) return <p style={{ color: 'var(--text-muted)' }}>No links added yet.</p>;

  return (
    <>
      <h3>Monitored Links</h3>
      <div className="link-list">
        {links.map(l => (
          <div key={l.id} className="link-row">
            <span style={{ fontWeight: 500 }}>{l.url}</span>
            <button
              onClick={() => onCheck(l)}
              disabled={loading}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {loading ? "Checking..." : "Check Now"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}