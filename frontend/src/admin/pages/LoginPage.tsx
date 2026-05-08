import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api";
import { getAuthToken, setAuthToken } from "../auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [message, setMessage] = useState("请输入后台管理账号。");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (getAuthToken()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("正在验证登录信息...");

    try {
      const result = await loginAdmin({ username, password });
      if (result.code !== 0) {
        setMessage(result.message);
        return;
      }

      setAuthToken(result.data.token);
      navigate("/", { replace: true });
    } catch {
      setMessage("登录失败，请稍后重试。");
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
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                style={{ width: '100%', paddingRight: '50px' }}
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px',
                  opacity: 0.5,
                  transition: 'opacity 0.2s'
                }}
              >
                {showPassword ? "👁️" : "🔒"}
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
