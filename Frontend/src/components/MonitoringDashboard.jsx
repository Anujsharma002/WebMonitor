import { Terminal, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function MonitoringDashboard({ selected }) {
    if (!selected) return null;

    return (
        <div className="dashboard-grid animate-fade-in">
            {/* Summary Section */}
            <div className="glass-card dashboard-section summary-section">
                <div className="section-header">
                    <Terminal size={20} className="section-icon" />
                    <h3>AI Analysis</h3>
                </div>
                <div className="summary-content">
                    {selected.summary || "No changes detected. The page content remains the same."}
                </div>
            </div>

            {/* Status Badge */}
            <div className={`status-banner glass ${selected.changed ? 'changed' : 'no-change'}`}>
                {selected.changed ? (
                    <><XCircle size={20} /> <span>Changes Detected</span></>
                ) : (
                    <><CheckCircle2 size={20} /> <span>No Changes Found</span></>
                )}
            </div>

            {/* History Section */}
            <div className="glass-card dashboard-section history-section">
                <div className="section-header">
                    <Clock size={20} className="section-icon" />
                    <h3>Recent Activity</h3>
                </div>
                <div className="history-timeline">
                    {selected.history?.length > 0 ? selected.history.map((check, idx) => (
                        <div key={check.id} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <div className="timeline-time">
                                    {new Date(check.fetched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className={`timeline-status ${check.changed ? 'text-error' : 'text-success'}`}>
                                    {check.changed ? 'Significant Change' : 'Identical Fetch'}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="no-history">No history available for this link.</div>
                    )}
                </div>
            </div>

            {/* Diff Section */}
            {selected.diff_text && (
                <div className="glass-card dashboard-section diff-section">
                    <div className="section-header">
                        <FileText size={20} className="section-icon" />
                        <h3>Raw Changes (Diff)</h3>
                    </div>
                    <pre className="diff-view">
                        <code>{selected.diff_text}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}
