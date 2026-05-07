import { useState, useEffect, useMemo } from "react";
import { fetchPainPointList, updatePainPoint, deletePainPoint } from "../api";
import type { PainPointRow } from "@/types/api";

export default function PainPoints() {
  const [list, setList] = useState<PainPointRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "待处理" | "已处理">("all");
  const [selectedItem, setSelectedItem] = useState<PainPointRow | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchPainPointList();
      setList(res.data);
    } catch (e) {
      console.error("Failed to load pain points", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    return list.filter(item => {
      const matchesSearch = 
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sceneType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toString().includes(searchQuery);
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [list, searchQuery, statusFilter]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      await updatePainPoint(id, { status: newStatus });
      setList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (selectedItem?.id === id) {
        setSelectedItem(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (e) {
      alert("操作失败");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这条记录吗？此操作不可撤销。")) return;
    setActionLoading(id);
    try {
      await deletePainPoint(id);
      setList(prev => prev.filter(item => item.id !== id));
      setSelectedItem(null);
    } catch (e) {
      alert("删除失败");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="pain-points-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: '12px' }}>管理面板 / 核心数据库</div>
          <h1 style={{ margin: '0 0 4px', fontSize: '30px', fontWeight: '900', letterSpacing: '-0.03em' }}>痛点信息管理</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '15px', fontWeight: 500 }}>处理来自各行各业的社会痛点反馈</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <select 
            className="input" 
            style={{ width: '140px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">所有状态</option>
            <option value="待处理">待处理</option>
            <option value="已处理">已处理</option>
          </select>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="搜索关键词或ID..." 
              className="input" 
              style={{ width: '280px', paddingLeft: '44px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          </div>
          <button className="button-primary" onClick={() => alert("报告生成中...")}>导出数据集</button>
        </div>
      </header>

      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center', color: 'var(--admin-muted)' }}>
            <div className="status-indicator" style={{ margin: '0 auto 20px', width: '12px', height: '12px' }}></div>
            <div style={{ fontWeight: 600 }}>同步中...</div>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>编号</th>
                  <th>反馈场景</th>
                  <th>行业</th>
                  <th>内容摘要</th>
                  <th>状态</th>
                  <th style={{ textAlign: 'right' }}>操作管理</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length > 0 ? filteredList.map(item => (
                  <tr key={item.id} style={{ opacity: actionLoading === item.id ? 0.5 : 1 }}>
                    <td><code style={{ color: 'var(--admin-primary)', fontWeight: 800 }}>#{item.id}</code></td>
                    <td style={{ fontWeight: 700 }}>{item.sceneType}</td>
                    <td style={{ fontWeight: 600 }}>{item.industryType}</td>
                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.8 }}>
                      {item.content}
                    </td>
                    <td>
                      <span className={`badge ${item.status === '待处理' ? 'badge-pending' : 'badge-processed'}`}>
                        {item.status || '待处理'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="button-ghost" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => setSelectedItem(item)}
                        >
                          详情
                        </button>
                        {item.status !== '已处理' && (
                          <button 
                            className="button-ghost" 
                            style={{ padding: '6px 12px', fontSize: '12px', borderColor: 'var(--admin-primary)', color: 'var(--admin-primary)' }}
                            onClick={() => handleUpdateStatus(item.id, '已处理')}
                            disabled={actionLoading !== null}
                          >
                            设为已处理
                          </button>
                        )}
                        <button 
                          className="button-ghost" 
                          style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#fee2e2', color: '#ef4444' }}
                          onClick={() => handleDelete(item.id)}
                          disabled={actionLoading !== null}
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '80px', color: 'var(--admin-muted)' }}>
                      <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.15 }}>🔍</div>
                      <div style={{ fontWeight: 600 }}>未找到匹配的记录</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="admin-card" style={{ maxWidth: '640px', width: '100%', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', right: '24px', top: '24px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', opacity: 0.5 }}
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
            <div className="eyebrow" style={{ marginBottom: '16px' }}>反馈详情 / #{selectedItem.id}</div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '24px' }}>{selectedItem.sceneType} - {selectedItem.industryType}</h2>
            
            <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(46, 125, 103, 0.05)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>反馈内容</div>
                <div style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--admin-text)' }}>{selectedItem.content}</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-muted)', marginBottom: '4px' }}>联系方式</div>
                  <div style={{ fontWeight: 700 }}>{selectedItem.contactWay}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-muted)', marginBottom: '4px' }}>提交时间</div>
                  <div style={{ fontWeight: 700 }}>{selectedItem.submitTime || '2026-05-07'}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="button-ghost" onClick={() => setSelectedItem(null)}>关闭窗口</button>
              {selectedItem.status !== '已处理' && (
                <button 
                  className="button-primary" 
                  onClick={() => handleUpdateStatus(selectedItem.id, '已处理')}
                  disabled={actionLoading !== null}
                >
                  标记为已处理
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
