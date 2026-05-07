import { NavLink, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="app-shell public-shell">
      <header className="topbar">
        <div className="brand-group">
          <div className="brand">
            <span className="brand-hw">Hello World</span>
          </div>
          <div className="subtitle">社会痛点信息收集与统计分析平台</div>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end>首页</NavLink>
          <NavLink to="/submit">我要反馈</NavLink>
          <NavLink to="/privacy">隐私说明</NavLink>

        </nav>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>

      <footer className="site-footer">
        <span>© 2026 Hello World · 社会痛点平台</span>
      </footer>
    </div>
  );
}
