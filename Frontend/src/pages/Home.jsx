import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Globe, LayoutDashboard, AlertCircle } from "lucide-react";
import { getLinks, addLink, checkLink, getHistory } from "../api";
import LinkCard from "../components/LinkCard";
import MonitoringDashboard from "../components/MonitoringDashboard";

export default function Home() {
  const [links, setLinks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  async function refresh() {
    const data = await getLinks();
    setLinks(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newUrl) return;
    setAdding(true);
    setError(null);
    try {
      await addLink(newUrl);
      setNewUrl("");
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleSelect(link) {
    if (selected?.id === link.id) return;
    try {
      const history = await getHistory(link.id);
      const latest = history[0] || {};
      setSelected({
        ...latest,
        id: link.id,
        url: link.url,
        history
      });
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }

  async function handleCheck(link) {
    setLoadingId(link.id);
    try {
      const result = await checkLink(link.id);
      const history = await getHistory(link.id);
      setSelected({
        ...result,
        history,
        id: link.id,
        url: link.url
      });
    } catch (err) {
      console.error("Failed to check link:", err);
      setError("Check failed. Please try again later.");
    } finally {
      setLoadingId(null);
    }
  }

  const filteredLinks = links.filter(l =>
    l.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-content">
      <header className="page-header">
        <div className="header-meta">
          <h1 className="gradient-text">Web Dashboard</h1>
          <p className="subtitle">Real-time monitoring and AI content analysis</p>
        </div>
        <form onSubmit={handleAdd} className="add-form glass">
          <div className="input-with-icon">
            <Globe size={18} className="input-icon" />
            <input
              className="input-glass"
              placeholder="Enter website URL..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              disabled={adding}
            />
          </div>
          <button className="btn-primary" disabled={adding}>
            {adding ? <div className="animate-spin"><Plus size={18} /></div> : <Plus size={18} />}
            <span>Add Link</span>
          </button>
        </form>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message glass"
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.25rem',
              color: 'var(--error)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              background: 'rgba(239, 68, 68, 0.05)',
              borderRadius: '12px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}
      </header>

      <section className="main-grid">
        <div className="sidebar">
          <div className="section-title">
            <div className="flex-between">
              <h3>Monitored Targets</h3>
              <span className="count-badge">{links.length}</span>
            </div>
            <div className="search-box glass">
              <Search size={16} />
              <input
                placeholder="Search links..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="link-scroll-area">
            <AnimatePresence>
              {filteredLinks.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleSelect(link)}
                  className={`link-item-wrap ${selected?.id === link.id ? 'active' : ''}`}
                >
                  <LinkCard
                    link={link}
                    onCheck={() => handleCheck(link)}
                    loading={loadingId === link.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="dashboard-view">
          {selected ? (
            <MonitoringDashboard selected={selected} />
          ) : (
            <div className="empty-state glass">
              <LayoutDashboard size={48} className="empty-icon" />
              <h3>Select a target to view details</h3>
              <p>Choose a link from the sidebar or add a new one to begin analysis.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}