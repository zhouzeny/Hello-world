import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="hero-grid">
      <section className="hero card">
        <div className="eyebrow">社会痛点信息收集与统计分析平台</div>
        <h1>让社会痛点被看见，也被结构化处理</h1>
        <p>
          这里是一个面向大众的极简反馈入口，支持生活、工作、行业等场景的痛点提交，并为后台分析提供统一数据基础。
        </p>
        <div className="button-row">
          <Link className="button button-primary" to="/submit">
            立即反馈
          </Link>
          <Link className="button button-ghost" to="/privacy">
            查看隐私说明
          </Link>
        </div>
      </section>

      <section className="card feature-panel">
        <h2>项目特征</h2>
        <ul className="feature-list">
          <li>无需复杂注册，直接提交痛点</li>
          <li>前后台分离，职责清晰</li>
          <li>统计结果支持图表和报告输出</li>
          <li>为后续接入加密与权限控制预留结构</li>
        </ul>
      </section>
    </div>
  );
}
