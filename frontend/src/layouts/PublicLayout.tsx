import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function PublicLayout() {
  const navigate = useNavigate();
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  const handleSubmitClick = () => {
    setShowComplianceModal(true);
  };

  const handleConfirmCompliance = () => {
    setShowComplianceModal(false);
    navigate("/submit");
  };

  return (
    <div className="app-shell public-shell">
      <header className="topbar">
        <div className="brand-group">
          <div className="brand">
            <span className="brand-hw">Hello World</span>
          </div>
          <div className="subtitle">社会痛点信息收集与统计分析平台</div>
         
        </div>
        <nav className="nav-links">
          <NavLink to="/" end>首页</NavLink>
          <button onClick={handleSubmitClick} className="nav-submit-btn">我要反馈</button>
          <NavLink to="/privacy">隐私说明</NavLink>

        </nav>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>

      {showComplianceModal && (
        <div className="compliance-modal-overlay" onClick={() => setShowComplianceModal(false)}>
          <div className="compliance-modal" onClick={(e) => e.stopPropagation()}>
            <div className="compliance-modal-header">
              <div className="compliance-modal-icon">📋</div>
              <h2>本网站数据合规声明</h2>
            </div>
            <div className="compliance-modal-content">
              <ul className="compliance-list">
                <li>本平台收集、存储、共享的所有生活/工作痛点文本、行业汇总数据，已完成法律意义上的匿名化处理。</li>
                <li>数据不含任何可识别自然人的信息：无姓名、手机号、微信、邮箱、住址、公司、工号、IP、设备 ID、定位、照片等任何个人标识。</li>
                <li>数据无法通过任何技术、组合、关联方式还原、定位到特定个人，不具备可复原性。</li>
                <li>所有数据仅为共性痛点、场景描述、行业问题汇总，不指向、不关联任何具体自然人。</li>
                <li>本数据不属于个人信息，符合《个人信息保护法》《民法典》关于匿名化数据的规定，可合法对外共享、使用、研究、商业转化。</li>
              </ul>
            </div>
            <div className="compliance-modal-footer">
              <button className="button button-ghost" onClick={() => setShowComplianceModal(false)}>
                取消
              </button>
              <button className="button button-primary" onClick={handleConfirmCompliance}>
                我已知晓并同意
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '40px 20px' 
      }}>
        <div className="footer-notice" style={{ 
          maxWidth: '800px', 
          margin: '0 auto 16px', 
          padding: '16px 24px', 
          background: 'rgba(255,255,255,0.5)', 
          borderRadius: '16px', 
          fontSize: '13px', 
          lineHeight: '1.6', 
          color: '#666',
          border: '1px solid rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          本网站纯匿名、完全无法定位到任何具体个人、不带任何身份标识、不带可还原个人线索的生活 / 工作痛点文本、行业痛点汇总，不触碰国家红线、不触犯刑法、不违反个保法。
        </div>
        <div style={{ opacity: 0.6, fontSize: '12px' }}>
          © 2026 Hello World · 社会痛点平台
        </div>
      </footer>
    </div>
  );
}
