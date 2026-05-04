(function () {
  const fallbackConfig = {
    sceneTypes: ["生活类痛点", "工作类痛点"],
    industryTypes: ["教育", "医疗", "职场办公", "物业民生", "交通出行", "电商服务", "餐饮服务", "制造业", "服务业", "其他"],
    contactWays: ["匿名", "手机", "邮箱", "微信"]
  };

  const apiBase = (window.APP_CONFIG && window.APP_CONFIG.apiBase ? String(window.APP_CONFIG.apiBase) : "").replace(/\/$/, "");

  function endpoint(path) {
    return `${apiBase}${path}`;
  }

  async function requestJson(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
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

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function setMessage(target, type, text) {
    if (!target) {
      return;
    }

    target.className = `status ${type}`;
    target.textContent = text;
  }

  function populateSelect(select, values, placeholder) {
    if (!select) {
      return;
    }

    const safePlaceholder = escapeHtml(placeholder);
    select.innerHTML = `<option value="">${safePlaceholder}</option>${values
      .map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`)
      .join("")}`;
  }

  function fillHomeStats(config) {
    const container = document.querySelector("[data-home-stats]");
    if (!container) {
      return;
    }

    const targets = {
      sceneTypes: container.querySelector('[data-home-stat="sceneTypes"]'),
      industryTypes: container.querySelector('[data-home-stat="industryTypes"]'),
      contactWays: container.querySelector('[data-home-stat="contactWays"]')
    };

    targets.sceneTypes.textContent = config.sceneTypes.length;
    targets.industryTypes.textContent = config.industryTypes.length;
    targets.contactWays.textContent = config.contactWays.length;
  }

  async function loadHomeStats() {
    const container = document.querySelector("[data-home-stats]");
    if (!container) {
      return;
    }

    try {
      const config = await requestJson("/api/public/form-config");
      fillHomeStats(config);
    } catch (error) {
      fillHomeStats(fallbackConfig);
    }
  }

  async function loadFeedbackConfig() {
    const form = document.querySelector("[data-feedback-form]");
    if (!form) {
      return fallbackConfig;
    }

    const sceneSelect = form.querySelector("[data-scene-select]");
    const industrySelect = form.querySelector("[data-industry-select]");
    const contactSelect = form.querySelector("[data-contact-select]");
    const statsContainer = document.querySelector("[data-form-stats]");

    let config = fallbackConfig;

    try {
      config = await requestJson("/api/public/form-config");
    } catch (error) {
      config = fallbackConfig;
    }

    populateSelect(sceneSelect, config.sceneTypes, "请选择场景类型");
    populateSelect(industrySelect, config.industryTypes, "请选择所属行业");
    populateSelect(contactSelect, config.contactWays, "请选择联系方式");

    if (statsContainer) {
      const items = {
        sceneTypes: statsContainer.querySelector('[data-form-stat="sceneTypes"]'),
        industryTypes: statsContainer.querySelector('[data-form-stat="industryTypes"]'),
        contactWays: statsContainer.querySelector('[data-form-stat="contactWays"]')
      };

      items.sceneTypes.textContent = config.sceneTypes.length;
      items.industryTypes.textContent = config.industryTypes.length;
      items.contactWays.textContent = config.contactWays.length;
    }

    return config;
  }

  async function submitFeedback(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const status = form.querySelector("[data-feedback-status]");
    const result = document.querySelector("[data-submit-result]");
    const submitButton = form.querySelector('[type="submit"]');

    const payload = {
      sceneType: form.sceneType.value.trim(),
      industryType: form.industryType.value.trim(),
      content: form.content.value.trim(),
      contactWay: form.contactWay.value.trim(),
      contactInfo: form.contactInfo.value.trim()
    };

    if (!payload.sceneType || !payload.industryType || !payload.content || !payload.contactWay) {
      setMessage(status, "error", "请先把必填项补全。");
      return;
    }

    if (payload.contactWay !== "匿名" && !payload.contactInfo) {
      setMessage(status, "error", "选择非匿名方式时，请补充联系方式。");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "提交中...";
    setMessage(status, "info", "正在提交，请稍候。");

    try {
      const data = await requestJson("/api/public/pain-points", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setMessage(status, "success", `提交成功，编号：${data.id}`);

      if (result) {
        result.hidden = false;
        result.innerHTML = `<h4>已收到你的反馈</h4><p>提交编号 <strong>${escapeHtml(data.id)}</strong>。后续可根据这个编号进行追踪。</p>`;
      }

      form.reset();
      await loadFeedbackConfig();
    } catch (error) {
      setMessage(status, "error", error.message || "提交失败，请稍后再试。");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "提交痛点";
    }
  }

  function initFeedbackPage() {
    const form = document.querySelector("[data-feedback-form]");
    if (!form) {
      return;
    }

    loadFeedbackConfig();
    form.addEventListener("submit", submitFeedback);
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadHomeStats();
    initFeedbackPage();
  });
})();
