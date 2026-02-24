import { ExternalLink, RefreshCw, Trash2, Clock } from "lucide-react";

export default function LinkCard({ link, onCheck, onDelete, loading }) {
    return (
        <div className="glass-card link-card animate-fade-in">
            <div className="link-card-header">
                <div className="url-display">
                    <ExternalLink size={16} className="url-icon" />
                    <span title={link.url}>{link.url}</span>
                </div>
                <div className="link-actions">
                    <button
                        className="btn-icon"
                        onClick={() => onCheck(link)}
                        disabled={loading}
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    {/* onDelete can be implemented if the backend supports it */}
                </div>
            </div>
            <div className="link-card-meta">
                <div className="meta-item">
                    <Clock size={14} />
                    <span>Added {new Date(link.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}
