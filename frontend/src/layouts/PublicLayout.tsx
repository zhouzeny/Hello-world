import { NavLink, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="app-shell public-shell">
      <header className="topbar">
        <div>
          <div className="brand">社会痛点平台</div>
          <div className="subtitle">收集、分类、统计、分析</div>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end>
            首页
          </NavLink>
          <NavLink to="/submit">我要反馈</NavLink>
          <NavLink to="/privacy">隐私说明</NavLink>
        </nav>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
