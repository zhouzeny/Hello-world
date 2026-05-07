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
      <section className="auth-card">
        <div className="brand-hw" style={{ textAlign: 'center', marginBottom: '8px' }}>Hello World</div>
        <div className="eyebrow" style={{ margin: '0 auto 24px', display: 'flex' }}>管理后台认证</div>
        
        <h1>系统登录</h1>
        <p className="muted">{message}</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>管理员账号</span>
            <input
              className="input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="请输入账号"
              autoFocus
            />
          </label>

          <label className="field">
            <span>安全密码</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入密码"
            />
          </label>

          <label className="field">
            <span>验证码认证</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                className="input"
                value={captcha}
                onChange={(event) => setCaptcha(event.target.value)}
                placeholder="4位验证码"
                style={{ flex: 1 }}
              />
              <button 
                className="button-ghost" 
                type="button" 
                onClick={refreshCaptcha}
                style={{ minWidth: '100px', height: '48px', borderRadius: '14px' }}
              >
                {captchaDisplay}
              </button>
            </div>
          </label>

          <button className="button-primary" type="submit" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? "正在验证..." : "授权并登录"}
          </button>
        </form>
      </section>
    </div>
  );
}
