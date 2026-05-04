import { Link } from "react-router-dom";

export default function PortalPage() {
  return (
    <div className="portal-grid">
      <section className="card portal-hero">
        <div className="eyebrow">网页隔离入口</div>
        <h1>前台和后台分开打开</h1>
        <p>
          这个页面只负责分流，不承载提交表单或管理数据。你可以在不同标签页里分别打开前台和后台，互不干扰。
        </p>
        <div className="portal-actions">
          <Link className="button button-primary" to="/" target="_blank" rel="noreferrer">
            打开前台首页
          </Link>
          <Link className="button button-ghost" to="/admin/" target="_blank" rel="noreferrer">
            打开后台管理
          </Link>
        </div>
      </section>

      <section className="card portal-card">
        <div className="portal-pill">前台</div>
        <h2>客户提交</h2>
        <p>只保留痛点提交、隐私说明和结果页，不包含后台管理能力。</p>
        <ul className="feature-list">
          <li>面向客户提交反馈</li>
          <li>可单独在新标签页打开</li>
          <li>不暴露后台管理数据</li>
        </ul>
      </section>

      <section className="card portal-card portal-card-accent">
        <div className="portal-pill">后台</div>
        <h2>独立管理</h2>
        <p>登录后查看统计、列表和后台操作，和前台页面完全分开。</p>
        <ul className="feature-list">
          <li>独立登录入口</li>
          <li>单独管理提交数据</li>
          <li>和前台页面分开访问</li>
        </ul>
      </section>
    </div>
  );
}
