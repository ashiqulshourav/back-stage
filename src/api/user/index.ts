import { http } from "@/utils/http";

export const user = {
  //- 登录
  login: (data: { name: string; pwd: string, ukeyPassword: string }) => http.request<UserAPI.Login>("post", "/kmg/auth/login", { data }),
  //- 修改密码
  updatePwd: (data: { id: number; pwd: string, newPwd: string }) => http.request<UserAPI.LoginResType>("post", "/kmg/matchUser/v1/updatePwd", { data }),
  //- 获取路由表
  getRouter: (data: { id: number }) => http.request<UserAPI.RouterResType>("post", "/kmg/matchRole/v1/getResourcelist", { data }),
  //- 退出登录
  loginOut: (data: { id: number, name: string }) => http.request<UserAPI.RouterResType>("post", "/kmg/auth/loginOut", { data }),

  //- 获取用户列表
  getUserLevelLimitList: (data: { id: number, name: string }) => http.request<UserAPI.RouterResType>("post", "/userLevelLimit/v1/getUserLevelLimitList", { data }),
};
