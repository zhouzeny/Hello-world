import { http } from "./http";
import type { ApiResponse, FormConfig, SubmitPainPointForm } from "@/types/api";

const useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchFormConfig(): Promise<ApiResponse<FormConfig>> {
  if (useMockApi) {
    await sleep(120);
    return {
      code: 0,
      message: "ok",
      data: {
        sceneTypes: ["生活类痛点", "工作类痛点"],
        industryTypes: [
          "教育",
          "医疗",
          "职场办公",
          "物业民生",
          "交通出行",
          "电商服务",
          "餐饮服务",
          "制造业",
          "服务业",
          "其他",
        ],
      },
    };
  }

  const { data } = await http.get<ApiResponse<FormConfig>>("/public/form-config");
  return data;
}

export async function submitPainPoint(
  payload: SubmitPainPointForm,
): Promise<ApiResponse<{ id: string }>> {
  if (useMockApi) {
    await sleep(180);
    return {
      code: 0,
      message: "提交成功",
      data: {
        id: `PP-${Date.now()}`,
      },
    };
  }

  const { data } = await http.post<ApiResponse<{ id: string }>>(
    "/public/pain-points",
    payload,
  );
  return data;
}
