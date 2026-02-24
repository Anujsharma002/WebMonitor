import { Link, useLocation } from "react-router-dom";
import { Activity, Home as HomeIcon, Monitor } from "lucide-react";

export default function Navbar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar glass">
            <div className="navbar-brand">
                <Activity className="brand-icon" />
                <span className="brand-text gradient-text">WebMonitor</span>
            </div>
            <div className="navbar-links">
                <Link
                    to="/"
                    className={`nav-item ${isActive('/') ? 'active' : ''}`}
                >
                    <HomeIcon size={18} />
                    <span>Home</span>
                </Link>
                <Link
                    to="/status"
                    className={`nav-item ${isActive('/status') ? 'active' : ''}`}
                >
                    <Monitor size={18} />
                    <span>Status</span>
                </Link>
            </div>
        </nav>
    );
}
