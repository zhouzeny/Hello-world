import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFormConfig, submitPainPoint } from "@/api/public";
import type { FormConfig, SubmitPainPointForm } from "@/types/api";

const DEFAULT_FORM_CONFIG: FormConfig = {
  sceneTypes: ["生活类痛点", "工作类痛点"],
  industryTypes: [
    "教育",
    "医疗",
    "职场办公",
    "物业民生",
    "交通出行",
    "电商服务",
    "餐饮服务",
    "制造业",
    "服务业",
    "其他",
  ],
  contactWays: ["匿名", "手机", "邮箱", "微信"],
};

const emptyForm: SubmitPainPointForm = {
  sceneType: "",
  industryType: "",
  content: "",
  contactWay: "匿名",
  contactInfo: "",
};

function normalizeFormConfig(config?: Partial<FormConfig> | null): FormConfig {
  return {
    sceneTypes: config?.sceneTypes?.length ? config.sceneTypes : DEFAULT_FORM_CONFIG.sceneTypes,
    industryTypes: config?.industryTypes?.length
      ? config.industryTypes
      : DEFAULT_FORM_CONFIG.industryTypes,
    contactWays: config?.contactWays?.length ? config.contactWays : DEFAULT_FORM_CONFIG.contactWays,
  };
}

export default function SubmitPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
  const [form, setForm] = useState<SubmitPainPointForm>(emptyForm);
  const [message, setMessage] = useState("请尽量用简洁、真实的方式描述问题。");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadConfig = async () => {
      try {
        const res = await fetchFormConfig();
        if (!mounted) return;

        const nextConfig = normalizeFormConfig(res?.data);
        setConfig(nextConfig);
        setForm((current) => ({
          ...current,
          sceneType: current.sceneType || nextConfig.sceneTypes[0] || "",
          industryType: current.industryType || nextConfig.industryTypes[0] || "",
          contactWay: current.contactWay || nextConfig.contactWays[0] || "匿名",
        }));

        if (!res?.data || res.code !== 0) {
          setMessage("表单配置已使用默认值。");
        }
      } catch {
        if (!mounted) return;

        setConfig(DEFAULT_FORM_CONFIG);
        setForm((current) => ({
          ...current,
          sceneType: current.sceneType || DEFAULT_FORM_CONFIG.sceneTypes[0] || "",
          industryType: current.industryType || DEFAULT_FORM_CONFIG.industryTypes[0] || "",
          contactWay: current.contactWay || DEFAULT_FORM_CONFIG.contactWays[0] || "匿名",
        }));
        setMessage("表单配置加载失败，已使用默认选项。");
      }
    };

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (field: keyof SubmitPainPointForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("正在提交，请稍候...");

    try {
      const result = await submitPainPoint(form);
      if (result.code !== 0) {
        setMessage(result.message);
        return;
      }

      navigate("/success", { state: { reportId: result.data.id } });
    } catch {
      setMessage("提交失败，请检查网络后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h1>痛点信息提交</h1>
      <p className="muted">{message}</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>痛点场景</span>
          <select
            className="input"
            value={form.sceneType}
            onChange={(event) => handleChange("sceneType", event.target.value)}
          >
            {config.sceneTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>所属行业</span>
          <select
            className="input"
            value={form.industryType}
            onChange={(event) => handleChange("industryType", event.target.value)}
          >
            {config.industryTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="field field-full">
          <span>详细内容</span>
          <textarea
            className="input textarea"
            rows={6}
            value={form.content}
            onChange={(event) => handleChange("content", event.target.value)}
            placeholder="请描述你遇到的困难、问题、建议或诉求"
          />
        </label>

        <label className="field">
          <span>联系意愿</span>
          <select
            className="input"
            value={form.contactWay}
            onChange={(event) => handleChange("contactWay", event.target.value)}
          >
            {config.contactWays.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>联系方式（选填）</span>
          <input
            className="input"
            value={form.contactInfo}
            onChange={(event) => handleChange("contactInfo", event.target.value)}
            placeholder="如手机号、邮箱、微信"
          />
        </label>

        <div className="button-row field-full">
          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? "提交中..." : "确认提交"}
          </button>
          <button className="button button-ghost" type="button" onClick={() => setForm(emptyForm)}>
            重置内容
          </button>
        </div>
      </form>
    </div>
  );
}
