import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const stats = [
  { value: "10K+", label: "收集痛点" },
  { value: "12", label: "覆盖行业" },
  { value: "实时", label: "数据分析" },
  { value: "100%", label: "匿名可选" },
];

const features = [
  {
    icon: "✦",
    title: "无门槛提交",
    desc: "无需注册，30 秒完成反馈，完全匿名提交，保护个人隐私。",
  },
  {
    icon: "◈",
    title: "结构化分类",
    desc: "按场景 × 行业双维度归档，让痛点数据可统计、可分析。",
  },
  {
    icon: "⬡",
    title: "数据实时统计",
    desc: "授权人员可查看图表、列表、趋势，快速发现高频社会问题。",
  },
  {
    icon: "◎",
    title: "隐私优先设计",
    desc: "数据已完成法律意义上的匿名化处理，不含任何个人标识信息。",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  const handleSubmitClick = () => {
    setShowComplianceModal(true);
  };

  const handleConfirmCompliance = () => {
    setShowComplianceModal(false);
    navigate("/submit");
  };

  return (
    <div className="home-wrap">
      {/* ── Hero ── */}
      <section className="hw-hero card">
        <div className="hw-hero-inner">
          <div className="eyebrow">Hello World · 社会痛点平台</div>
          <h1 className="hw-title">
            让每一个社会痛点<br />
            <span className="hw-title-accent">被看见，被记录，被解决</span>
          </h1>
          <p className="hw-desc">
            无论是生活琐碎还是职场困境，这里是你表达的起点。
            我们将你的声音结构化，呈递给能改变它的人。
          </p>
          <div className="button-row">
            <button className="button button-primary hw-cta" onClick={handleSubmitClick}>
              立即提交痛点 →
            </button>
          </div>
        </div>

        {/* 装饰气泡 */}
        <div className="hw-deco" aria-hidden="true">
          <div className="hw-bubble hw-bubble-1" />
          <div className="hw-bubble hw-bubble-2" />
          <div className="hw-bubble hw-bubble-3" />
        </div>
      </section>

      {/* ── 数字统计栏 ── */}
      <div className="hw-stats-row">
        {stats.map((s) => (
          <div key={s.label} className="hw-stat card">
            <div className="hw-stat-val">{s.value}</div>
            <div className="hw-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── 特性网格 ── */}
      <section className="hw-features">
        <div className="hw-section-header">
          <h2>为什么选择 Hello World</h2>
          <p>极简设计背后是对数据完整性与用户隐私的双重承诺</p>
        </div>
        <div className="hw-feature-grid">
          {features.map((f) => (
            <div key={f.title} className="hw-feature-card card">
              <div className="hw-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 数据合规声明弹窗 */}
      {showComplianceModal && (
        <div className="compliance-modal-overlay" onClick={() => setShowComplianceModal(false)}>
          <div className="compliance-modal" onClick={(e) => e.stopPropagation()}>
            <div className="compliance-modal-header">
              <div className="compliance-modal-icon">📋</div>
              <h2>本网站数据合规声明</h2>
            </div>
            <div className="compliance-modal-content">
              <ul className="compliance-list">
                <li>本平台收集、存储、共享的所有生活/工作痛点文本、行业汇总数据，已完成法律意义上的匿名化处理。</li>
                <li>数据不含任何可识别自然人的信息：无姓名、手机号、微信、邮箱、住址、公司、工号、IP、设备 ID、定位、照片等任何个人标识。</li>
                <li>数据无法通过任何技术、组合、关联方式还原、定位到特定个人，不具备可复原性。</li>
                <li>所有数据仅为共性痛点、场景描述、行业问题汇总，不指向、不关联任何具体自然人。</li>
                <li>本数据不属于个人信息，符合《个人信息保护法》《民法典》关于匿名化数据的规定，可合法对外共享、使用、研究、商业转化。</li>
              </ul>
            </div>
            <div className="compliance-modal-footer">
              <button className="button button-ghost" onClick={() => setShowComplianceModal(false)}>
                取消
              </button>
              <button className="button button-primary" onClick={handleConfirmCompliance}>
                我已知晓并同意
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
