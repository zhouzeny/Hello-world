(function () {
  const tokenKey = "socialPainPointAdminToken";
  const profileKey = "socialPainPointAdminProfile";
  const apiBase = (window.APP_CONFIG && window.APP_CONFIG.apiBase ? String(window.APP_CONFIG.apiBase) : "").replace(/\/$/, "");

  function endpoint(path) {
    return `${apiBase}${path}`;
  }

  function getToken() {
    return localStorage.getItem(tokenKey) || "";
  }

  function setSession(data) {
    localStorage.setItem(tokenKey, data.token);
    localStorage.setItem(profileKey, JSON.stringify({
      username: data.username,
      role: data.role
    }));
  }

  function clearSession() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(profileKey);
  }

  function getProfile() {
    const raw = localStorage.getItem(profileKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  async function requestJson(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(endpoint(path), {
      credentials: "same-origin",
      ...options,
      headers
    });

    const text = await response.text();
    let payload = null;

    if (text) {
      try {
        payload = JSON.parse(text);
      } catch (error) {
        payload = null;
      }
    }

    if (!response.ok) {
      throw new Error(payload && payload.message ? payload.message : `请求失败（${response.status}）`);
    }

    if (!payload) {
      throw new Error("响应解析失败");
    }

    if (payload.code !== 0) {
      throw new Error(payload.message || "请求失败");
    }

    return payload.data;
  }

  function setMessage(target, type, text) {
    if (!target) {
      return;
    }

    target.className = `status ${type}`;
    target.textContent = text;
  }

  function randomCaptcha() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let value = "";
    for (let index = 0; index < 4; index += 1) {
      value += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return value;
  }

  function renderMetricStrip(stats) {
    const container = document.querySelector("[data-metric-strip]");
    if (!container) {
      return;
    }

    const totalReports = stats.totalReports ?? 0;
    const pendingReports = stats.pendingReports ?? 0;
    const categoryCount = Object.keys(stats.categoryCounts || {}).length;
    const industryCount = Object.keys(stats.industryCounts || {}).length;

    container.innerHTML = `
      <article class="panel metric-tile">
        <h4>总提交量</h4>
        <strong>${totalReports}</strong>
      </article>
      <article class="panel metric-tile">
        <h4>待处理</h4>
        <strong>${pendingReports}</strong>
      </article>
      <article class="panel metric-tile">
        <h4>分类数量</h4>
        <strong>${categoryCount}</strong>
      </article>
      <article class="panel metric-tile">
        <h4>行业覆盖</h4>
        <strong>${industryCount}</strong>
      </article>
    `;
  }

  function renderBarList(container, counts) {
    if (!container) {
      return;
    }

    const entries = Object.entries(counts || {});
    if (!entries.length) {
      container.innerHTML = '<div class="empty-state">暂无统计数据。</div>';
      return;
    }

    const max = Math.max(...entries.map(([, value]) => Number(value) || 0), 1);

    container.innerHTML = entries
      .sort((left, right) => Number(right[1]) - Number(left[1]))
      .map(([name, value]) => {
        const width = Math.max(Math.round(((Number(value) || 0) / max) * 100), 6);
        return `
          <div class="bar-item">
            <div class="bar-label">${escapeHtml(name)}</div>
            <div class="meta">${Number(value) || 0}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
          </div>
        `;
      })
      .join("");
  }

  function renderRecentReports(container, reports) {
    if (!container) {
      return;
    }

    if (!reports || !reports.length) {
      container.innerHTML = '<div class="empty-state">暂无最近提交。</div>';
      return;
    }

    container.innerHTML = reports
      .map((report) => `
        <article class="table-row">
          <header>
            <div>
              <h5>#${escapeHtml(report.id)} · ${escapeHtml(report.sceneType)} · ${escapeHtml(report.industryType)}</h5>
              <div class="meta">${escapeHtml(report.submitTime)} · ${escapeHtml(report.status)} · ${escapeHtml(report.categoryName)}</div>
            </div>
            <span class="pill">${escapeHtml(report.contactWay)}</span>
          </header>
          <div class="meta">${escapeHtml(report.content)}</div>
          <div class="meta" style="margin-top: 8px;">联系方式：${escapeHtml(report.contactInfoMasked)}</div>
        </article>
      `)
      .join("");
  }

  function renderReportSummary(container, summary) {
    if (!container) {
      return;
    }

    if (!summary) {
      container.innerHTML = '<div class="empty-state">点击“生成报告摘要”加载汇总内容。</div>';
      return;
    }

    container.innerHTML = `
      <div class="result-box">
        <h4>${escapeHtml(summary.title || "报告摘要")}</h4>
        <p>${escapeHtml(summary.body || "")}</p>
        <p style="margin-top: 10px;">生成时间：${escapeHtml(summary.generatedAt || "-")}</p>
      </div>
    `;
  }

  async function loadDashboard() {
    const status = document.querySelector("[data-dashboard-status]");
    setMessage(status, "info", "正在加载后台数据...");

    try {
      const stats = await requestJson("/api/admin/dashboard/stats");
      renderMetricStrip(stats);
      renderBarList(document.querySelector("[data-category-bars]"), stats.categoryCounts);
      renderBarList(document.querySelector("[data-industry-bars]"), stats.industryCounts);
      renderRecentReports(document.querySelector("[data-recent-reports]"), stats.recentReports);

      const summary = await requestJson("/api/admin/reports/export");
      renderReportSummary(document.querySelector("[data-report-summary]"), summary);

      setMessage(status, "success", "数据已刷新。");
    } catch (error) {
      if ((error.message || "").includes("登录")) {
        clearSession();
        window.location.replace("/myshtdgly/login.html");
        return;
      }

      setMessage(status, "error", error.message || "加载失败");
    }
  }

  function initDashboardPage() {
    const dashboardRoot = document.querySelector("[data-admin-dashboard]");
    if (!dashboardRoot) {
      return;
    }

    if (!getToken()) {
      window.location.replace("/myshtdgly/login.html");
      return;
    }

    const profile = getProfile();
    const profileTarget = document.querySelector("[data-admin-user]");
    if (profileTarget && profile) {
      profileTarget.textContent = `${profile.username} · ${profile.role}`;
    }

    const refreshButton = document.querySelector("[data-refresh-dashboard]");
    if (refreshButton) {
      refreshButton.addEventListener("click", () => {
        loadDashboard();
      });
    }

    const summaryButton = document.querySelector("[data-load-summary]");
    if (summaryButton) {
      summaryButton.addEventListener("click", async () => {
        try {
          const summary = await requestJson("/api/admin/reports/export");
          renderReportSummary(document.querySelector("[data-report-summary]"), summary);
        } catch (error) {
          setMessage(document.querySelector("[data-dashboard-status]"), "error", error.message || "加载失败");
        }
      });
    }

    const logoutButton = document.querySelector("[data-logout]");
    if (logoutButton) {
      logoutButton.addEventListener("click", async () => {
        try {
          await requestJson("/api/admin/auth/logout", { method: "POST" });
        } catch (error) {
          // Logout should still complete locally even if the server side token is already gone.
        } finally {
          clearSession();
          window.location.replace("/myshtdgly/login.html");
        }
      });
    }

    loadDashboard();
  }

  function initLoginPage() {
    const form = document.querySelector("[data-admin-login-form]");
    if (!form) {
      return;
    }

    const captchaDisplay = document.querySelector("[data-captcha-display]");
    const captchaInput = form.querySelector("[data-captcha-input]");
    const refreshButton = document.querySelector("[data-refresh-captcha]");
    const status = document.querySelector("[data-login-status]");
    const submitButton = form.querySelector('[type="submit"]');
    let captcha = randomCaptcha();

    function refreshCaptcha() {
      captcha = randomCaptcha();
      if (captchaDisplay) {
        captchaDisplay.textContent = captcha;
      }
      if (captchaInput) {
        captchaInput.value = "";
      }
    }

    if (getToken()) {
      window.location.replace("/myshtdgly/dashboard.html");
      return;
    }

    refreshCaptcha();

    if (refreshButton) {
      refreshButton.addEventListener("click", refreshCaptcha);
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const payload = {
        username: form.username.value.trim(),
        password: form.password.value.trim(),
        captcha: form.captcha.value.trim()
      };

      if (!payload.username || !payload.password || !payload.captcha) {
        setMessage(status, "error", "请完整填写账号、密码和验证码。");
        return;
      }

      if (payload.captcha.toUpperCase() !== captcha) {
        setMessage(status, "error", "验证码不正确，请重新输入。");
        refreshCaptcha();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "登录中...";
      setMessage(status, "info", "正在验证账号...");

      try {
        const data = await requestJson("/api/admin/auth/login", {
          method: "POST",
          body: JSON.stringify(payload)
        });

        setSession(data);
        setMessage(status, "success", "登录成功，正在进入后台...");
        window.location.replace("/myshtdgly/dashboard.html");
      } catch (error) {
        setMessage(status, "error", error.message || "登录失败");
        refreshCaptcha();
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "进入后台";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLoginPage();
    initDashboardPage();
  });
})();
