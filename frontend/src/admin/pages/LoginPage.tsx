import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api";
import { getAuthToken, setAuthToken } from "../auth";

function createCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123456");
  const [captcha, setCaptcha] = useState("");
  const [captchaCode, setCaptchaCode] = useState(() => createCaptcha());
  const [message, setMessage] = useState("请输入后台管理账号。");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAuthToken()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const captchaDisplay = useMemo(() => captchaCode, [captchaCode]);

  const refreshCaptcha = () => {
    setCaptchaCode(createCaptcha());
    setCaptcha("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!captcha.trim()) {
      setMessage("请输入验证码。");
      return;
    }

    if (captcha.trim().toUpperCase() !== captchaCode) {
      setMessage("验证码不正确，请刷新后重试。");
      refreshCaptcha();
      return;
    }

    setLoading(true);
    setMessage("正在验证登录信息...");

    try {
      const result = await loginAdmin({ username, password, captcha });
      if (result.code !== 0) {
        setMessage(result.message);
        refreshCaptcha();
        return;
      }

      setAuthToken(result.data.token);
      navigate("/", { replace: true });
    } catch {
      setMessage("登录失败，请稍后重试。");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="card auth-card">
        <div className="eyebrow">后台登录</div>
        <h1>独立管理入口</h1>
        <p className="muted">{message}</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field field-full">
            <span>账号</span>
            <input
              className="input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />
          </label>

          <label className="field field-full">
            <span>密码</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <label className="field field-full">
            <span>验证码</span>
            <div className="button-row" style={{ alignItems: "center" }}>
              <input
                className="input"
                value={captcha}
                onChange={(event) => setCaptcha(event.target.value)}
                placeholder="请输入验证码"
                style={{ flex: 1 }}
              />
              <button className="button button-ghost" type="button" onClick={refreshCaptcha}>
                {captchaDisplay}
              </button>
            </div>
          </label>

          <button className="button button-primary field-full" type="submit" disabled={loading}>
            {loading ? "登录中..." : "登录后台"}
          </button>
        </form>
      </section>
    </div>
  );
}
