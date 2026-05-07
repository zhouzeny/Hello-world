import { Link } from "react-router-dom";

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
    desc: "无需注册，30 秒完成反馈，支持匿名提交，保护个人隐私。",
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
    desc: "联系信息加密存储，审核人员无法直接查看原始内容。",
  },
];

export default function HomePage() {
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
            <Link className="button button-primary hw-cta" to="/submit">
              立即提交痛点 →
            </Link>
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
    </div>
  );
}
