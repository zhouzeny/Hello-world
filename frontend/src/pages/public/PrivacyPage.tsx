import { Link } from "react-router-dom";

const policies = [
  {
    icon: "🔒",
    title: "数据最小化收集",
    desc: "我们仅收集痛点描述所必要的字段：场景类型、行业、内容描述。联系方式为完全自愿填写，选择「匿名」则不记录任何个人信息。",
  },
  {
    icon: "🔐",
    title: "联系信息加密存储",
    desc: "若你选择留下联系方式，相关字段在写入数据库前会经过字段级加密处理。数据审核人员查看时只能看到脱敏后的结果（如 138****0001），无法获得原始数据。",
  },
  {
    icon: "👤",
    title: "权限分级管理",
    desc: "后台系统仅允许经过身份验证的授权管理员访问。所有登录行为和数据操作均有日志留痕，具备完整的审计追溯能力。",
  },
  {
    icon: "📋",
    title: "操作日志与审计",
    desc: "平台对所有关键操作（提交、审核、分类、导出）自动记录操作日志，包含操作时间、操作类型和操作目标，确保数据治理透明可追溯。",
  },
  {
    icon: "🚫",
    title: "不对外共享数据",
    desc: "收集的痛点数据仅用于平台内部的统计分析与社会问题研究，不会出售、出租或共享给任何第三方机构或个人。",
  },
  {
    icon: "🗑️",
    title: "数据删除权利",
    desc: "如需删除你提交的内容，可通过平台公开邮箱联系我们，并提供提交时收到的反馈编号。我们将在 5 个工作日内完成处理。",
  },
];

export default function PrivacyPage() {
  return (
    <div className="prv-wrap">
      {/* 页头 */}
      <div className="prv-header card">
        <div className="eyebrow">隐私说明</div>
        <h1 className="prv-title">我们如何保护你的数据</h1>
        <p className="prv-subtitle">
          Hello World 社会痛点平台致力于以最透明、最克制的方式收集信息。<br />
          以下是我们在数据收集、存储和使用方面的完整承诺。
        </p>
        <div className="prv-badge-row">
          <span className="prv-badge">🔒 加密存储</span>
          <span className="prv-badge">👁️ 脱敏展示</span>
          <span className="prv-badge">📋 操作审计</span>
          <span className="prv-badge">🚫 不对外共享</span>
        </div>
      </div>

      {/* 政策卡片网格 */}
      <div className="prv-grid">
        {policies.map((p) => (
          <div key={p.title} className="prv-card card">
            <div className="prv-icon">{p.icon}</div>
            <h3 className="prv-card-title">{p.title}</h3>
            <p className="prv-card-desc">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* 底部 CTA */}
      <div className="prv-footer card">
        <div className="prv-footer-text">
          <strong>阅读完毕，准备好反馈了吗？</strong>
          <p>你的每一条声音都有价值，我们会认真对待。</p>
        </div>
        <Link className="button button-primary" to="/submit">立即提交痛点 →</Link>
      </div>
    </div>
  );
}
