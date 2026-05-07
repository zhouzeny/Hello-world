import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const location = useLocation();
  const reportId = (location.state as { reportId?: string } | null)?.reportId ?? "待生成";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`suc-wrap ${visible ? "suc-visible" : ""}`}>
      <div className="suc-card card">
        {/* 成功图标 */}
        <div className="suc-check-ring">
          <div className="suc-check">✓</div>
        </div>

        <h1 className="suc-title">提交成功！</h1>
        <p className="suc-desc">感谢你的反馈，你的声音将被认真对待。</p>

        {/* 反馈编号 */}
        <div className="suc-id-box">
          <span className="suc-id-label">反馈编号</span>
          <code className="suc-id-code">{reportId}</code>
          <span className="suc-id-hint">请记录此编号，可用于数据删除申请</span>
        </div>

        {/* 按钮 */}
        <div className="suc-btn-row">
          <Link className="button button-primary" to="/submit">继续反馈</Link>
          <Link className="button button-ghost" to="/">返回首页</Link>
        </div>
      </div>
    </div>
  );
}
