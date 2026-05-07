import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../api";
import { clearAuthToken, getAuthToken } from "../auth";

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = getAuthToken();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } finally {
      clearAuthToken();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-hw">Hello World</div>
          <span>后台管理中心</span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            <span>仪表盘</span>
          </NavLink>
          <NavLink to="/pain-points" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📝</span>
            <span>痛点管理</span>
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📈</span>
            <span>统计分析</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-status">
            <div className="status-indicator"></div>
            <span>管理员 (已登录)</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="admin-topbar">
          <div className="breadcrumb">
            管理系统 / <b>{window.location.pathname.split('/').filter(Boolean).pop() || '仪表盘'}</b>
          </div>
          <div className="topbar-actions">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-primary)', opacity: 0.8 }}>
              ● 系统运行中
            </span>
          </div>
        </header>

        <div className="admin-main-view">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
