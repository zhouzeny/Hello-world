export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface FormConfig {
  sceneTypes: string[];
  industryTypes: string[];
}

export interface SubmitPainPointForm {
  sceneType: string;
  industryType: string;
  content: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface AdminLoginResult {
  token: string;
  username: string;
  role: string;
}

export interface PainPointRow {
  id: number;
  sceneType: string;
  industryType: string;
  content: string;
  submitTime: string;
  categoryName: string;
  status: string;
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  categoryCounts: Record<string, number>;
  industryCounts: Record<string, number>;
  recentReports: PainPointRow[];
}

export interface CategoryStat {
  name: string;
  count: number;
}

export interface IndustryStat {
  name: string;
  count: number;
}

export interface ReportSummary {
  title: string;
  body: string;
  generatedAt: string;
}

export interface AdminUserRow {
  id: number;
  username: string;
  role: string;
  status: string;
  lastLoginTime: string;
}
