import { Link, useLocation } from "react-router-dom";

export default function SuccessPage() {
  const location = useLocation();
  const reportId = (location.state as { reportId?: string } | null)?.reportId ?? "待生成";

  return (
    <div className="card success-card">
      <div className="success-mark">已提交</div>
      <h1>感谢你的反馈</h1>
      <p>你的痛点信息已进入平台处理流程，当前反馈编号为：{reportId}</p>
      <div className="button-row">
        <Link className="button button-primary" to="/submit">
          继续反馈
        </Link>
        <Link className="button button-ghost" to="/">
          返回首页
        </Link>
      </div>
    </div>
  );
}
