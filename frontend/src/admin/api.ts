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
      contactWay: "匿名",
      contactInfoMasked: "匿名",
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
    if (payload.username === "admin" && payload.password === "Admin@123456") {
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

  const { data } = await http.post<ApiResponse<AdminLoginResult>>("/api/admin/auth/login", payload);
  return data;
}

export async function logoutAdmin(): Promise<ApiResponse<string>> {
  if (useMockApi) {
    await sleep(60);
    return { code: 0, message: "ok", data: "已退出" };
  }

  const { data } = await http.post<ApiResponse<string>>("/api/admin/auth/logout");
  return data;
}

export async function fetchDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  if (useMockApi) {
    await sleep(100);
    return { code: 0, message: "ok", data: mockStats };
  }

  const { data } = await http.get<ApiResponse<DashboardStats>>("/api/admin/dashboard/stats");
  return data;
}

export async function fetchPainPointList(): Promise<ApiResponse<PainPointRow[]>> {
  if (useMockApi) {
    await sleep(100);
    return { code: 0, message: "ok", data: mockPainPoints };
  }

  const { data } = await http.get<ApiResponse<PainPointRow[]>>("/api/admin/pain-points");
  return data;
}
