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
      <aside className="sidebar card">
        <div className="brand-block">
          <div className="brand">后台管理</div>
          <div className="subtitle">提交数据与统计分析</div>
        </div>

        <div className="token-box">
          <span>登录状态</span>
          <strong>{token ? "已登录" : "未登录"}</strong>
        </div>

        <nav className="side-links">
          <NavLink to="/" end>
            提交数据
          </NavLink>
        </nav>

        <button className="button button-ghost" type="button" onClick={handleLogout}>
          退出登录
        </button>
      </aside>

      <section className="admin-main">
        <header className="topbar compact">
          <div>
            <div className="brand">后台数据中心</div>
            <div className="subtitle">查看 frontend 提交记录</div>
          </div>
        </header>

        <div className="page-panel">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
