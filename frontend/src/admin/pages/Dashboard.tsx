import { useState, useEffect } from "react";
import { fetchDashboardStats } from "../api";
import type { DashboardStats } from "@/types/api";

export default function Dashboard() {
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
        <div style={{ fontWeight: 600 }}>正在加载系统实时概况...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header style={{ marginBottom: '36px' }}>
        <div className="eyebrow" style={{ marginBottom: '12px' }}>数据统计中心 / 实时同步</div>
        <h1 style={{ margin: '0 0 8px', fontSize: '34px', fontWeight: '900', letterSpacing: '-0.04em' }}>数据概览</h1>
        <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '15px', fontWeight: 500 }}>
          对接后端实时数据，统计来自前台提交的每一份社会痛点。
        </p>
      </header>
      
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">总提交量 (全库)</span>
          <div className="stat-value" style={{ color: 'var(--admin-primary)' }}>{stats?.totalReports || 0}</div>
          <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--admin-primary)' }}>
            实时统计 <span style={{ color: 'var(--admin-muted)', fontWeight: 500 }}>前台提交总量</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">行业覆盖</span>
          <div className="stat-value" style={{ color: 'var(--admin-accent)' }}>{Object.keys(stats?.industryCounts || {}).length}</div>
          <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--admin-accent)' }}>
            前台反馈 <span style={{ color: 'var(--admin-muted)', fontWeight: 500 }}>所属行业总数</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">场景分布</span>
          <div className="stat-value" style={{ fontSize: '24px' }}>{Object.keys(stats?.categoryCounts || {}).length}</div>
          <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--admin-primary)' }}>
            已收集 <span style={{ color: 'var(--admin-muted)', fontWeight: 500 }}>种反馈场景</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">待处理记录</span>
          <div className="stat-value" style={{ color: '#ef4444' }}>{stats?.pendingReports || 0}</div>
          <div style={{ marginTop: '12px' }}>
            <span className="badge badge-pending">需人工审核</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h3>前台最近提交记录</h3>
          <button className="button-ghost" style={{ fontSize: '13px' }} onClick={() => window.location.hash = "/pain-points"}>
            管理全部记录 →
          </button>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>提交时间</th>
                <th>场景</th>
                <th>行业</th>
                <th>处理状态</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentReports && stats.recentReports.length > 0 ? stats.recentReports.map(item => (
                <tr key={item.id}>
                  <td>{item.submitTime}</td>
                  <td style={{ fontWeight: 700 }}>{item.sceneType}</td>
                  <td>{item.industryType}</td>
                  <td>
                    <span className={`badge ${item.status === '待处理' ? 'badge-pending' : 'badge-processed'}`}>
                      {item.status || '待处理'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '60px', color: 'var(--admin-muted)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.1 }}>📁</div>
                    暂无前台提交记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
