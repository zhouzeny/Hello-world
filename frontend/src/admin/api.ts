import { http } from "@/api/http";
import type {
  AdminLoginResult,
  ApiResponse,
  DashboardStats,
  LoginForm,
  PainPointRow,
} from "@/types/api";

const useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockStats: DashboardStats = {
  totalReports: 12,
  pendingReports: 3,
  categoryCounts: {
    "流程效率": 5,
    "环境噪音": 4,
    "出行拥堵": 3,
  },
  industryCounts: {
    "物业民生": 6,
    "职场办公": 4,
    "交通出行": 2,
  },
  recentReports: [
    {
      id: 1008,
      sceneType: "生活类痛点",
      industryType: "物业民生",
      content: "小区夜间噪音较大，影响休息。",
      submitTime: "2026-05-03 09:10:00",
      categoryName: "环境噪音",
      status: "待处理",
    },
  ],
};

const mockPainPoints: PainPointRow[] = mockStats.recentReports;

export async function loginAdmin(payload: LoginForm): Promise<ApiResponse<AdminLoginResult>> {
  if (useMockApi) {
    await sleep(120);
    if (payload.username === "admin" && payload.password === "admin123") {
      return {
        code: 0,
        message: "ok",
        data: {
          token: "mock-admin-token",
          username: payload.username,
          role: "超级管理员",
        },
      };
    }

    return {
      code: 1,
      message: "账号或密码错误",
      data: {
        token: "",
        username: "",
        role: "",
      },
    };
  }

  const { data } = await http.post<ApiResponse<AdminLoginResult>>("/admin/auth/login", payload);
  return data;
}

export async function logoutAdmin(): Promise<ApiResponse<string>> {
  if (useMockApi) {
    await sleep(60);
    return { code: 0, message: "ok", data: "已退出" };
  }

  const { data } = await http.post<ApiResponse<string>>("/admin/auth/logout");
  return data;
}

export async function fetchDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  if (useMockApi) {
    await sleep(100);
    return { code: 0, message: "ok", data: mockStats };
  }

  const { data } = await http.get<ApiResponse<DashboardStats>>("/admin/dashboard/stats");
  return data;
}

export async function fetchPainPointList(): Promise<ApiResponse<PainPointRow[]>> {
  if (useMockApi) {
    await sleep(100);
    return { code: 0, message: "ok", data: [...mockPainPoints] };
  }

  const { data } = await http.get<ApiResponse<PainPointRow[]>>("/admin/pain-points");
  return data;
}

export async function updatePainPoint(id: number, payload: Partial<PainPointRow>): Promise<ApiResponse<null>> {
  if (useMockApi) {
    await sleep(100);
    return { code: 0, message: "ok", data: null };
  }

  if (payload.status) {
    const { data } = await http.patch<ApiResponse<null>>(`/admin/pain-points/${id}/status`, { status: payload.status });
    return data;
  }

  if (payload.categoryName) {
    const { data } = await http.put<ApiResponse<null>>(`/admin/pain-points/${id}/category`, { categoryName: payload.categoryName });
    return data;
  }

  return { code: 1, message: "Unsupported update", data: null };
}

export async function deletePainPoint(id: number): Promise<ApiResponse<null>> {
  if (useMockApi) {
    await sleep(100);
    return { code: 0, message: "ok", data: null };
  }

  const { data } = await http.delete<ApiResponse<null>>(`/admin/pain-points/${id}`);
  return data;
}

export async function exportToExcel() {
  if (useMockApi) {
    await sleep(100);
    return;
  }

  try {
    const response = await http.get("/admin/reports/export/excel", {
      responseType: "blob",
      validateStatus: () => true,
    });

    const contentType = String(response.headers["content-type"] || response.headers["Content-Type"] || "").toLowerCase();

    if (contentType.includes("application/json") || contentType.includes("text/json")) {
      const errorText = await response.data.text();
      let message = "导出失败";

      if (errorText) {
        try {
          const payload = JSON.parse(errorText) as { message?: string };
          message = payload.message || message;
        } catch {
          message = errorText;
        }
      }

      throw new Error(message);
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`导出失败（${response.status}）`);
    }

    if (!response.data || response.data.size === 0) {
      throw new Error("导出的数据为空");
    }

    const blob = response.data instanceof Blob
      ? response.data
      : new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    const contentDisposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];
    let filename = "痛点数据.xlsx";
    if (contentDisposition) {
      const utf8Match = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
      if (utf8Match && utf8Match[1]) {
        try {
          filename = decodeURIComponent(utf8Match[1]);
        } catch {
          filename = utf8Match[1];
        }
      } else {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, "");
        }
      }
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    
  } catch (error) {
    console.error("导出失败:", error);
    throw error;
  }
}
