import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardStats, fetchPainPointList } from "../api";
import { clearAuthToken, getAuthToken } from "../auth";
import StatCard from "../components/StatCard";
import type { DashboardStats, PainPointRow } from "@/types/api";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [painPoints, setPainPoints] = useState<PainPointRow[]>([]);
  const [message, setMessage] = useState("正在加载提交数据...");

  const loadData = async () => {
    try {
      const [statsRes, listRes] = await Promise.all([fetchDashboardStats(), fetchPainPointList()]);

      if (statsRes.code !== 0) {
        throw new Error(statsRes.message);
      }

      if (listRes.code !== 0) {
        throw new Error(listRes.message);
      }

      setStats(statsRes.data);
      setPainPoints(listRes.data);
      setMessage("数据已刷新。");
    } catch (error) {
      const text = error instanceof Error ? error.message : "加载失败";
      setMessage(text);

      if (text.includes("登录")) {
        clearAuthToken();
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login", { replace: true });
      return;
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (!stats) {
    return <div className="card">{message}</div>;
  }

  return (
    <div className="stack">
      <div className="grid-4">
        <StatCard label="累计提交" value={stats.totalReports} hint="来自客户前端提交" />
        <StatCard label="待处理" value={stats.pendingReports} hint="需要继续跟进" />
        <StatCard label="分类数" value={Object.keys(stats.categoryCounts).length} hint="覆盖的分类维度" />
        <StatCard label="行业数" value={Object.keys(stats.industryCounts).length} hint="覆盖的行业维度" />
      </div>

      <div className="grid-2">
        <section className="card">
          <h2>分类统计</h2>
          <ul className="data-list">
            {Object.entries(stats.categoryCounts).map(([name, count]) => (
              <li key={name}>
                <span>{name}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>行业统计</h2>
          <ul className="data-list">
            {Object.entries(stats.industryCounts).map(([name, count]) => (
              <li key={name}>
                <span>{name}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card">
        <div className="button-row" style={{ justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>提交数据</h2>
          <button className="button button-ghost" type="button" onClick={loadData}>
            刷新数据
          </button>
        </div>
        <p className="muted">{message}</p>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>场景</th>
                <th>行业</th>
                <th>联系方式</th>
                <th>内容</th>
                <th>时间</th>
                <th>状态</th>
                <th>分类</th>
              </tr>
            </thead>
            <tbody>
              {painPoints.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.sceneType}</td>
                  <td>{item.industryType}</td>
                  <td>{item.contactInfoMasked || item.contactWay}</td>
                  <td>{item.content}</td>
                  <td>{item.submitTime}</td>
                  <td>{item.status}</td>
                  <td>{item.categoryName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
