import { useEffect, useMemo, useRef, useState } from "react";
import {
  deletePainPoint,
  exportPainPointDataset,
  fetchPainPointList,
  updatePainPoint,
} from "../api";
import type { PainPointRow } from "@/types/api";

type StatusFilter = "all" | "待处理" | "已处理";

export default function PainPoints() {
  const [list, setList] = useState<PainPointRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedItem, setSelectedItem] = useState<PainPointRow | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [exporting, setExporting] = useState(false);
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => list.some((item) => item.id === id)));
  }, [list]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchPainPointList();
      setList(res.data || []);
    } catch (error) {
      console.error("Failed to load pain points", error);
      window.alert(error instanceof Error ? error.message : "加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    if (!Array.isArray(list)) {
      return [];
    }

    const keyword = searchQuery.trim().toLowerCase();

    return list.filter((item) => {
      const matchesSearch =
        keyword.length === 0 ||
        item.content.toLowerCase().includes(keyword) ||
        item.sceneType.toLowerCase().includes(keyword) ||
        item.industryType.toLowerCase().includes(keyword) ||
        item.id.toString().includes(keyword);

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [list, searchQuery, statusFilter]);

  const filteredIds = useMemo(() => filteredList.map((item) => item.id), [filteredList]);
  const filteredIdSet = useMemo(() => new Set(filteredIds), [filteredIds]);
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedVisibleCount = useMemo(
    () => filteredList.filter((item) => selectedIdSet.has(item.id)).length,
    [filteredList, selectedIdSet],
  );
  const allVisibleSelected = filteredList.length > 0 && selectedVisibleCount === filteredList.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  const toggleRowSelection = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      }

      return [...prev, id];
    });
  };

  const toggleVisibleSelection = () => {
    if (filteredList.length === 0) {
      return;
    }

    setSelectedIds((prev) => {
      if (allVisibleSelected) {
        return prev.filter((id) => !filteredIdSet.has(id));
      }

      return Array.from(new Set([...prev, ...filteredIds]));
    });
  };

  const handleExport = async (ids?: number[]) => {
    setExporting(true);
    try {
      await exportPainPointDataset(ids);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "导出失败");
    } finally {
      setExporting(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      await updatePainPoint(id, { status: newStatus });
      setList((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
      if (selectedItem?.id === id) {
        setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "操作失败");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("确定要删除这条记录吗？此操作不可撤销。")) {
      return;
    }

    setActionLoading(id);
    try {
      await deletePainPoint(id);
      setList((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
      setSelectedItem(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "删除失败");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="pain-points-page">
      <header style={{ marginBottom: "36px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: "12px" }}>
              管理面板 / 核心数据库
            </div>
            <h1 style={{ margin: "0 0 4px", fontSize: "30px", fontWeight: 900, letterSpacing: "-0.03em" }}>
              痛点信息管理
            </h1>
            <p style={{ margin: 0, color: "var(--admin-muted)", fontSize: "15px", fontWeight: 500 }}>
              处理来自各行各业的社会痛点反馈
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button className="button-ghost" onClick={() => void loadData()} disabled={loading || exporting}>
              刷新数据
            </button>
            <button
              className="button-primary"
              onClick={() => void handleExport(selectedIds)}
              disabled={exporting || selectedIds.length === 0}
            >
              导出选中数据集
            </button>
            <button className="button-primary" onClick={() => void handleExport()} disabled={exporting}>
              {exporting ? "导出中..." : "导出全部数据集"}
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "18px",
          }}
        >
          <select
            className="input"
            style={{ width: "140px" }}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="all">所有状态</option>
            <option value="待处理">待处理</option>
            <option value="已处理">已处理</option>
          </select>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="搜索关键词或ID..."
              className="input"
              style={{ width: "280px", paddingLeft: "44px" }}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <span
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.5,
              }}
            >
              🔍
            </span>
          </div>
          <div style={{ color: "var(--admin-muted)", fontSize: "13px", fontWeight: 600 }}>
            {selectedIds.length > 0 ? `已选 ${selectedIds.length} 条，可导出选中数据集。` : "勾选记录后即可导出选中数据集。"}
          </div>
        </div>
      </header>

      <div className="admin-card">
        {loading ? (
          <div style={{ padding: "100px", textAlign: "center", color: "var(--admin-muted)" }}>
            <div className="status-indicator" style={{ margin: "0 auto 20px", width: "12px", height: "12px" }} />
            <div style={{ fontWeight: 600 }}>同步中...</div>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "52px" }}>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleVisibleSelection}
                      disabled={filteredList.length === 0}
                      aria-label="选择当前筛选结果"
                      style={{ width: "16px", height: "16px", accentColor: "var(--admin-primary)" }}
                    />
                  </th>
                  <th>编号</th>
                  <th>反馈场景</th>
                  <th>行业</th>
                  <th>内容摘要</th>
                  <th>状态</th>
                  <th style={{ textAlign: "right" }}>操作管理</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length > 0 ? (
                  filteredList.map((item) => {
                    const isSelected = selectedIdSet.has(item.id);
                    const isBusy = actionLoading === item.id;

                    return (
                      <tr key={item.id} style={{ opacity: isBusy ? 0.6 : 1 }}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRowSelection(item.id)}
                            aria-label={`选择记录 ${item.id}`}
                            style={{ width: "16px", height: "16px", accentColor: "var(--admin-primary)" }}
                          />
                        </td>
                        <td>
                          <code style={{ color: "var(--admin-primary)", fontWeight: 800 }}>#{item.id}</code>
                        </td>
                        <td style={{ fontWeight: 700 }}>{item.sceneType}</td>
                        <td style={{ fontWeight: 600 }}>{item.industryType}</td>
                        <td
                          style={{
                            maxWidth: "280px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            opacity: 0.8,
                          }}
                        >
                          {item.content}
                        </td>
                        <td>
                          <span
                            className={`badge ${item.status === "待处理" ? "badge-pending" : "badge-processed"}`}
                          >
                            {item.status || "待处理"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button
                              className="button-ghost"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                              onClick={() => setSelectedItem(item)}
                            >
                              详情
                            </button>
                            {item.status !== "已处理" && (
                              <button
                                className="button-ghost"
                                style={{
                                  padding: "6px 12px",
                                  fontSize: "12px",
                                  borderColor: "var(--admin-primary)",
                                  color: "var(--admin-primary)",
                                }}
                                onClick={() => void handleUpdateStatus(item.id, "已处理")}
                                disabled={actionLoading !== null}
                              >
                                标记已处理
                              </button>
                            )}
                            <button
                              className="button-ghost"
                              style={{ padding: "6px 12px", fontSize: "12px", borderColor: "#fee2e2", color: "#ef4444" }}
                              onClick={() => void handleDelete(item.id)}
                              disabled={actionLoading !== null}
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "80px", color: "var(--admin-muted)" }}>
                      <div style={{ fontSize: "48px", marginBottom: "20px", opacity: 0.15 }}>🔍</div>
                      <div style={{ fontWeight: 600 }}>未找到匹配的记录</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div className="admin-card" style={{ maxWidth: "640px", width: "100%", position: "relative" }}>
            <button
              style={{
                position: "absolute",
                right: "24px",
                top: "24px",
                border: "none",
                background: "none",
                fontSize: "24px",
                cursor: "pointer",
                opacity: 0.5,
              }}
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
            <div className="eyebrow" style={{ marginBottom: "16px" }}>
              反馈详情 / #{selectedItem.id}
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "24px" }}>
              {selectedItem.sceneType} - {selectedItem.industryType}
            </h2>

            <div style={{ display: "grid", gap: "20px", marginBottom: "32px" }}>
              <div style={{ background: "rgba(46, 125, 103, 0.05)", padding: "20px", borderRadius: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--admin-primary)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  反馈内容
                </div>
                <div style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--admin-text)" }}>
                  {selectedItem.content}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.5)",
                    padding: "16px",
                    borderRadius: "16px",
                    border: "1px solid var(--admin-border)",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--admin-muted)", marginBottom: "4px" }}>
                    分类
                  </div>
                  <div style={{ fontWeight: 700 }}>{selectedItem.categoryName || "待分类"}</div>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.5)",
                    padding: "16px",
                    borderRadius: "16px",
                    border: "1px solid var(--admin-border)",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--admin-muted)", marginBottom: "4px" }}>
                    提交时间
                  </div>
                  <div style={{ fontWeight: 700 }}>{selectedItem.submitTime || "未知"}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button className="button-ghost" onClick={() => setSelectedItem(null)}>
                关闭窗口
              </button>
              {selectedItem.status !== "已处理" && (
                <button
                  className="button-primary"
                  onClick={() => void handleUpdateStatus(selectedItem.id, "已处理")}
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
