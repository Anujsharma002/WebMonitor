export default function HistoryView({ history }) {
    if (!history || history.length === 0) return null;

    return (
        <div className="history-container" style={{ marginTop: '2rem' }}>
            <h3>Recent History</h3>
            <div className="history-list">
                {history.map((check) => (
                    <div key={check.id} className="card" style={{ padding: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>
                                {new Date(check.fetched_at).toLocaleString()}
                            </span>
                            <span className={`badge ${check.changed ? 'badge-error' : 'badge-ok'}`}>
                                {check.changed ? 'Changed' : 'No Change'}
                            </span>
                        </div>
                        {check.summary && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <strong>Summary:</strong>
                                <p className="summary" style={{ marginTop: '0.25rem' }}>{check.summary}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
