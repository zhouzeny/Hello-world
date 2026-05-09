import { Link } from "react-router-dom";

const policies = [
  {
    icon: "📋",
    title: "数据合规声明",
    desc: "本平台收集、存储、共享的所有生活/工作痛点文本、行业汇总数据，已完成法律意义上的匿名化处理。数据不含任何可识别自然人的信息：无姓名、手机号、微信、邮箱、住址、公司、工号、IP、设备 ID、定位、照片等任何个人标识。数据无法通过任何技术、组合、关联方式还原、定位到特定个人，不具备可复原性。所有数据仅为共性痛点、场景描述、行业问题汇总，不指向、不关联任何具体自然人。本数据不属于个人信息，符合《个人信息保护法》《民法典》关于匿名化数据的规定，可合法对外共享、使用、研究、商业转化。",
  },
  {
    icon: "🔒",
    title: "数据最小化收集",
    desc: "我们仅收集痛点描述所必要的字段：场景类型、行业、内容描述。不收集任何个人身份信息。",
  },
  {
    icon: "👤",
    title: "权限分级管理",
    desc: "后台系统仅允许经过身份验证的授权管理员访问。所有登录行为和数据操作均有日志留痕，具备完整的审计追溯能力。",
  },
  {
    icon: "📊",
    title: "您的匿名数据将如何使用",
    desc: "收集的匿名痛点数据用于平台内部的统计分析与行业研究。由于数据已完成法律意义上的匿名化处理，不属于个人信息，可合法对外共享、使用、研究、商业转化。平台可基于匿名化数据，对外提供汇总分析报告、行业洞察等衍生服务，助力社会问题的研究与解决。",
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
          <span className="prv-badge">📊 数据使用</span>
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
