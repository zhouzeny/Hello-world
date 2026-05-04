export default function PrivacyPage() {
  return (
    <div className="card content-card">
      <h1>隐私说明</h1>
      <p>
        平台前台仅开放痛点提交，不要求复杂注册流程。后续接入正式后端时，将按字段加密、权限分级与日志留痕的方式管理敏感数据。
      </p>
      <ul className="feature-list">
        <li>前台仅保留必要的反馈信息</li>
        <li>后台只允许授权管理员访问</li>
        <li>预留接口用于传输加密与存储加密</li>
        <li>所有关键操作都会记录审计日志</li>
      </ul>
    </div>
  );
}
