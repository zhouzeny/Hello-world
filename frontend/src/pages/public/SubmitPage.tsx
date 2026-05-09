import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFormConfig, submitPainPoint } from "@/api/public";
import type { FormConfig, SubmitPainPointForm } from "@/types/api";

const DEFAULT_FORM_CONFIG: FormConfig = {
  sceneTypes: ["生活类痛点", "工作类痛点"],
  industryTypes: [
    "教育", "医疗", "职场办公", "物业民生",
    "交通出行", "电商服务", "餐饮服务", "制造业", "服务业", "其他",
  ],
};

const emptyForm: SubmitPainPointForm = {
  sceneType: "",
  industryType: "",
  content: "",
};

function normalizeFormConfig(config?: Partial<FormConfig> | null): FormConfig {
  return {
    sceneTypes: config?.sceneTypes?.length ? config.sceneTypes : DEFAULT_FORM_CONFIG.sceneTypes,
    industryTypes: config?.industryTypes?.length ? config.industryTypes : DEFAULT_FORM_CONFIG.industryTypes,
  };
}

const STEPS = ["选择类型", "描述问题"];

export default function SubmitPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
  const [form, setForm] = useState<SubmitPainPointForm>(emptyForm);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadConfig = async () => {
      try {
        const res = await fetchFormConfig();
        if (!mounted) return;
        const nextConfig = normalizeFormConfig(res?.data);
        setConfig(nextConfig);
        setForm((cur) => ({
          ...cur,
          sceneType: cur.sceneType || nextConfig.sceneTypes[0] || "",
          industryType: cur.industryType || nextConfig.industryTypes[0] || "",
        }));
      } catch {
        if (!mounted) return;
        setConfig(DEFAULT_FORM_CONFIG);
        setForm((cur) => ({
          ...cur,
          sceneType: cur.sceneType || DEFAULT_FORM_CONFIG.sceneTypes[0] || "",
          industryType: cur.industryType || DEFAULT_FORM_CONFIG.industryTypes[0] || "",
        }));
      }
    };
    loadConfig();
    return () => { mounted = false; };
  }, []);

  const handleChange = (field: keyof SubmitPainPointForm, value: string) => {
    setForm((cur) => ({ ...cur, [field]: value }));
    if (field === "content") setCharCount(value.length);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.content.trim()) { setMessage("请填写痛点内容后再提交。"); return; }
    setLoading(true);
    setMessage("正在提交，请稍候...");
    try {
      const result = await submitPainPoint(form);
      if (result.code !== 0) { setMessage(result.message); return; }
      navigate("/success", { state: { reportId: result.data.id } });
    } catch {
      setMessage("提交失败，请检查网络后重试。");
    } finally {
      setLoading(false);
    }
  };

  const showContact = form.contactWay !== "匿名";

  return (
    <div className="sp-wrap">
      {/* 页头 */}
      <div className="sp-header">
        <div className="eyebrow">我要反馈</div>
        <h1 className="sp-title">提交你的社会痛点</h1>
        <p className="sp-subtitle">请如实描述，匿名提交同样有效，每一条声音都有价值</p>
      </div>

      {/* 步骤指示器 */}
      <div className="sp-steps">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`sp-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            onClick={() => i < step && setStep(i)}
          >
            <div className="sp-step-dot">{i < step ? "✓" : i + 1}</div>
            <span>{label}</span>
          </div>
        ))}
        <div className="sp-step-line" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
      </div>

      {/* 表单主体 */}
      <form className="sp-form card" onSubmit={handleSubmit}>

        {/* Step 0 — 选择类型 */}
        <div className={`sp-panel ${step === 0 ? "visible" : ""}`}>
          <div className="sp-panel-title">选择痛点类型</div>
          <div className="sp-row-2">
            <div className="sp-field">
              <label className="sp-label">痛点场景</label>
              <div className="sp-chip-group">
                {config.sceneTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`sp-chip ${form.sceneType === item ? "selected" : ""}`}
                    onClick={() => handleChange("sceneType", item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="sp-field">
              <label className="sp-label">所属行业</label>
              <select
                className="input sp-select"
                value={form.industryType}
                onChange={(e) => handleChange("industryType", e.target.value)}
              >
                {config.industryTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="sp-nav-row">
            <button
              type="button"
              className="button button-primary"
              onClick={() => { if (!form.sceneType) { setMessage("请先选择痛点场景"); return; } setMessage(""); setStep(1); }}
            >
              下一步 →
            </button>
          </div>
        </div>

        {/* Step 1 — 描述问题 */}
        <div className={`sp-panel ${step === 1 ? "visible" : ""}`}>
          <div className="sp-panel-title">详细描述痛点</div>
          <div className="sp-field">
            <label className="sp-label">
              问题描述
              <span className="sp-char-count">{charCount} 字</span>
            </label>
            <textarea
              className="input textarea sp-textarea"
              rows={7}
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="请描述你遇到的困难、问题、建议或诉求。越具体越有助于分析，建议 50 字以上。"
            />
          </div>
          <div className="sp-summary card">
            <div className="sp-summary-title">提交内容预览</div>
            <div className="sp-summary-row"><span>场景</span><strong>{form.sceneType || "—"}</strong></div>
            <div className="sp-summary-row"><span>行业</span><strong>{form.industryType || "—"}</strong></div>
            <div className="sp-summary-row"><span>内容</span><strong className="sp-summary-content">{form.content.slice(0, 60)}{form.content.length > 60 ? "…" : ""}</strong></div>
          </div>

          {message && <div className="sp-message">{message}</div>}

          <div className="sp-nav-row">
            <button type="button" className="button button-ghost" onClick={() => setStep(0)}>← 上一步</button>
            <button className="button button-primary sp-submit-btn" type="submit" disabled={loading}>
              {loading ? <span className="sp-loading">提交中…</span> : "确认提交 ✓"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
