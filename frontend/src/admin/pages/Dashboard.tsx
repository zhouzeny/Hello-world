export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <header style={{ marginBottom: '36px' }}>
        <div className="eyebrow" style={{ marginBottom: '12px' }}>数据统计中心</div>
        <h1 style={{ margin: '0 0 8px', fontSize: '34px', fontWeight: '900', letterSpacing: '-0.04em' }}>数据概览</h1>
        <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '15px', fontWeight: 500 }}>欢迎回来，系统当前运行平稳，所有模块均在线。</p>
      </header>
      
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">总提交量</span>
          <div className="stat-value" style={{ color: 'var(--admin-primary)' }}>1,284</div>
          <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--admin-primary)' }}>
            ↑ 12.5% <span style={{ color: 'var(--admin-muted)', fontWeight: 500 }}>较上月</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">今日新增</span>
          <div className="stat-value" style={{ color: 'var(--admin-accent)' }}>42</div>
          <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--admin-accent)' }}>
            ↑ 8.2% <span style={{ color: 'var(--admin-muted)', fontWeight: 500 }}>较昨日</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">活跃用户</span>
          <div className="stat-value">156</div>
          <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>
            ↓ 2.1% <span style={{ color: 'var(--admin-muted)', fontWeight: 500 }}>较上周</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">待处理记录</span>
          <div className="stat-value">18</div>
          <div style={{ marginTop: '12px' }}>
            <span className="badge badge-pending">需优先关注</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h3>最近提交记录</h3>
          <button className="button-ghost" style={{ fontSize: '13px' }}>
            管理全部记录 →
          </button>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>提交时间</th>
                <th>反馈场景</th>
                <th>所属行业</th>
                <th>处理状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-05-07 10:24</td>
                <td style={{ fontWeight: 700 }}>生活类痛点</td>
                <td>医疗卫生</td>
                <td><span className="badge badge-pending">待审核</span></td>
              </tr>
              <tr>
                <td>2026-05-07 09:15</td>
                <td style={{ fontWeight: 700 }}>工作类痛点</td>
                <td>职场办公</td>
                <td><span className="badge badge-processed">已处理</span></td>
              </tr>
              <tr>
                <td>2026-05-06 22:30</td>
                <td style={{ fontWeight: 700 }}>生活类痛点</td>
                <td>物业民生</td>
                <td><span className="badge badge-pending">待审核</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
