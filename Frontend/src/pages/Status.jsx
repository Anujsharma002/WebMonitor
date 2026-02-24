import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Database, Cpu, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import { getStatus } from "../api";

export default function Status() {
  const [status, setStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    setRefreshing(true);
    try {
      const data = await getStatus();
      setStatus(data);
    } catch (err) {
      console.error("Connection failed:", err);
      setStatus({
        backend: "Offline",
        database: "Disconnected",
        llm: "Disconnected"
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (!status) return (
    <div className="status-loading">
      <div className="animate-spin"><Activity size={48} /></div>
      <p>Fetching system health statistics...</p>
    </div>
  );

  const stats = [
    {
      name: "Backend Server",
      val: status.backend,
      icon: Cpu,
      desc: "Core FastAPI engine running in Python"
    },
    {
      name: "Database (SQLite)",
      val: status.database,
      icon: Database,
      desc: "Primary storage for links and check history"
    },
    {
      name: "AI Summary Engine",
      val: status.llm,
      icon: ShieldCheck,
      desc: "Large Language Model for content analysis"
    }
  ];

  const isOk = (val) => val === "ok";

  return (
    <div className="status-page animate-fade-in">
      <header className="page-header">
        <div className="flex-between">
          <div className="header-meta">
            <h1 className="gradient-text">System Health</h1>
            <p className="subtitle">Real-time infrastructure monitoring</p>
          </div>
          <button
            className="btn-primary"
            onClick={fetchStatus}
            disabled={refreshing}
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh Status</span>
          </button>
        </div>
      </header>

      <div className="status-grid-large">
        {stats.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card status-card-premium"
          >
            <div className="status-card-header">
              <div className="status-icon-box">
                <item.icon size={24} />
              </div>
              <span className={`badge ${isOk(item.val) ? 'badge-success' : 'badge-error'}`}>
                {isOk(item.val) ? 'Operational' : 'Issue Detected'}
              </span>
            </div>
            <div className="status-card-body">
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
            {!isOk(item.val) && (
              <div className="status-error-msg">
                <AlertCircle size={14} />
                <span>{item.val}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="glass-card status-info-footer">
        <h3>About System Health</h3>
        <p>
          We monitor the health of our core components every time you press refresh button.
          If you encounter issues with AI summaries, ensure your <code>GROQ_API_KEY</code>
          is correctly configured in the backend environment.
        </p>
      </div>
    </div>
  );
}