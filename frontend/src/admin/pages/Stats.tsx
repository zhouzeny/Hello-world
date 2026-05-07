export default function Stats() {
  return (
    <div className="stats-page">
      <header style={{ marginBottom: '40px' }}>
        <div className="eyebrow" style={{ marginBottom: '12px' }}>智能数据分析引擎</div>
        <h1 style={{ margin: '0 0 8px', fontSize: '34px', fontWeight: '900', letterSpacing: '-0.04em' }}>统计分析</h1>
        <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '15px', fontWeight: 500 }}>基于大数据引擎分析，揭示社会痛点的核心趋势与分布规律。</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        <div className="admin-card" style={{ padding: '32px' }}>
          <div className="card-header">
            <h3>核心行业分布</h3>
            <span style={{ fontSize: '12px', color: 'var(--admin-primary)', fontWeight: 800 }}>LIVE UPDATES</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {[
              { label: '医疗卫生', val: 35, color: 'var(--admin-primary)' },
              { label: '教育培训', val: 28, color: 'var(--admin-accent)' },
              { label: '职场办公', val: 22, color: '#4fb896' },
              { label: '交通出行', val: 15, color: '#df9a4b' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700 }}>
                  <span>{item.label}</span>
                  <span style={{ color: item.color }}>{item.val}%</span>
                </div>
                <div style={{ height: '10px', background: 'rgba(46, 125, 103, 0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${item.val}%`, 
                      height: '100%', 
                      background: item.color,
                      borderRadius: '12px'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '32px' }}>
          <div className="card-header">
            <h3>近七日热度走势</h3>
            <span style={{ fontSize: '12px', color: 'var(--admin-muted)', fontWeight: 600 }}>05/01 - 05/07</span>
          </div>
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '18px', paddingTop: '20px' }}>
            {[40, 70, 45, 90, 65, 80, 55].map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', height: '100%', justifyContent: 'flex-end' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${val}%`, 
                    background: 'linear-gradient(to top, var(--admin-primary), rgba(46, 125, 103, 0.1))',
                    borderRadius: '12px 12px 6px 6px',
                    boxShadow: '0 8px 20px rgba(46, 125, 103, 0.1)',
                    transition: 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                ></div>
                <span style={{ fontSize: '11px', color: 'var(--admin-muted)', fontWeight: 800 }}>05-0{i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ borderLeft: '6px solid var(--admin-primary)', background: 'linear-gradient(135deg, rgba(46, 125, 103, 0.05), transparent)' }}>
        <div className="card-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>💡</span> 智能分析洞察
          </h3>
        </div>
        <div style={{ color: 'var(--admin-text)', fontSize: '16px', lineHeight: '1.8', fontWeight: 500 }}>
          <p style={{ margin: '0 0 16px' }}>
            基于本周数据聚合分析，<b style={{ color: 'var(--admin-primary)' }}>医疗类痛点</b>反馈环比上升了 <span style={{ color: '#ef4444', fontWeight: 800 }}>15.4%</span>，核心矛盾集中在挂号流程冗余与检查结果互认不畅。
          </p>
          <p style={{ margin: 0 }}>
            与此同时，职场办公类痛点呈现明显的季节性特征，建议下阶段增加对<b>中小企业劳工权益</b>相关关键词的监控权重。
          </p>
        </div>
      </div>
    </div>
  );
}
