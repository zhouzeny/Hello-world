import { useState, useEffect } from "react";
import { fetchDashboardStats } from "../api";
import type { DashboardStats } from "@/types/api";

export default function Stats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchDashboardStats();
        setStats(res.data);
      } catch (e) {
        console.error("Failed to fetch stats", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', color: 'var(--admin-muted)' }}>
        <div className="status-indicator" style={{ margin: '0 auto 20px', width: '12px', height: '12px' }}></div>
        <div style={{ fontWeight: 600 }}>统计引擎计算中...</div>
      </div>
    );
  }

  const totalReports = stats?.totalReports || 1;

  // 行业分布 (Industry)
  const industryStats = Object.entries(stats?.industryCounts || {}).map(([name, count]) => ({
    label: name,
    val: Math.round((count / totalReports) * 100),
    count: count,
    color: 'var(--admin-primary)'
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  // 场景分布 (Scene) - 用于扇形图
  const sceneStats = Object.entries(stats?.categoryCounts || {}).map(([name, count], index) => {
    const colors = ['#2E7D67', '#3B8F7A', '#4AA58E', '#5BBBA0', '#6CCFB3', '#7DD5C6', '#8EECD9', '#9FF3EC'];
    return {
      label: name,
      val: Math.round((count / totalReports) * 100),
      count: count,
      color: colors[index % colors.length],
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="stats-page">
      <header style={{ marginBottom: '40px' }}>
        <div className="eyebrow" style={{ marginBottom: '12px' }}>数据决策中心</div>
        <h1 style={{ margin: '0 0 8px', fontSize: '34px', fontWeight: '900', letterSpacing: '-0.04em' }}>统计分析</h1>
        <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '15px', fontWeight: 500 }}>
          深入分析前台用户提交的行业背景与痛点场景分布。
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        {/* 行业分布卡片 */}
        <div className="admin-card" style={{ padding: '32px' }}>
          <div className="card-header">
            <h3>所属行业分布 (Industry)</h3>
            <span style={{ fontSize: '12px', color: 'var(--admin-primary)', fontWeight: 800 }}>前台选择项</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {industryStats.map(item => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700 }}>
                  <span>{item.label}</span>
                  <span style={{ color: item.color }}>{item.count} 份 ({item.val}%)</span>
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
            {industryStats.length === 0 && <div style={{ textAlign: 'center', opacity: 0.5 }}>暂无前台提交数据</div>}
          </div>
        </div>

        {/* 场景分布卡片 - 扇形图 */}
        <div className="admin-card" style={{ padding: '32px' }}>
          <div className="card-header">
            <h3>痛点场景分布 (Scene)</h3>
            <span style={{ fontSize: '12px', color: 'var(--admin-muted)', fontWeight: 600 }}>全量数据统计</span>
          </div>
          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            {sceneStats.length > 0 ? (
              <>
                <svg width="180" height="180" viewBox="0 0 100 100">
                  {(() => {
                    let cumulativeAngle = 0;
                    return sceneStats.map((item) => {
                      const startAngle = cumulativeAngle;
                      const endAngle = cumulativeAngle + (item.val * 3.6);
                      cumulativeAngle = endAngle;

                      const startRad = (startAngle - 90) * (Math.PI / 180);
                      const endRad = (endAngle - 90) * (Math.PI / 180);

                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);

                      const largeArcFlag = item.val > 50 ? 1 : 0;

                      return (
                        <path
                          key={item.label}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={item.color}
                          style={{ cursor: 'pointer' }}
                        />
                      );
                    });
                  })()}
                  <circle cx="50" cy="50" r="25" fill="white" />
                  <text x="50" y="48" textAnchor="middle" fontSize="8" fill="var(--admin-text)" fontWeight="700">
                    {stats?.totalReports || 0}
                  </text>
                  <text x="50" y="58" textAnchor="middle" fontSize="6" fill="var(--admin-muted)">
                    总提交
                  </text>
                </svg>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {sceneStats.map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }}></div>
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.count} ({item.val}%)</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.5 }}>暂无场景数据</div>
            )}
          </div>
        </div>
      </div>

      {/* 分析洞察 */}
      <div className="admin-card" style={{ borderLeft: '6px solid var(--admin-primary)', background: 'linear-gradient(135deg, rgba(46, 125, 103, 0.05), transparent)' }}>
        <div className="card-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>📊</span> 数据概括
          </h3>
        </div>
        <div style={{ color: 'var(--admin-text)', fontSize: '16px', lineHeight: '1.8', fontWeight: 500 }}>
          <p style={{ margin: '0 0 16px' }}>
            当前系统已接入前台提交的 <b style={{ color: 'var(--admin-primary)' }}>{stats?.totalReports}</b> 条真实记录。
            其中反馈最集中的行业是 <b>{industryStats[0]?.label || '—'}</b>，
            反馈最频繁的场景是 <b>{sceneStats[0]?.label || '—'}</b>。
          </p>
          <p style={{ margin: 0 }}>
            所有数据均实时从后端数据库同步，反映了当前用户最关心的社会痛点趋势。
          </p>
        </div>
      </div>
    </div>
  );
}
