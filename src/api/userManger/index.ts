import { http } from "@/utils/http";

export const userMangerData = {
  //- 新增用户
  addSysAccount: (data: UserMangerAPI.addSysAccountRes) => http.request<UserMangerAPI.addSysAccountReqType>("post", "/kmg/matchUser/v1/addMatchAccount", { data }),
  //- 修改用户
  updateSysAccount: (data: UserMangerAPI.addSysAccountRes) => http.request<UserMangerAPI.addSysAccountReqType>("post", "/kmg/matchUser/v1/updateMatchAccount", { data }),
  //- 角色列表
  getUserList: (data: UserMangerAPI.querySysAccountListReqType) => http.request<UserMangerAPI.querySysAccountListResType>("post", "/kmg/matchUser/v1/queryMatchAccountList", { data }),
  //- 用户删除
  deleteSysAccount: (data: {
    id: number
  }) => http.request<UserMangerAPI.deleteSysAccountResType>("post", "/kmg/matchUser/v1/deleteMatchAccount", { data }),
  //- 重置用户密码
  updateUserPwd: (data: {
    id: number,
    newPwd: string;
  }) => http.request<UserMangerAPI.updateUserPwdResType>("post", "/kmg/matchUser/v1/updateUserPwd", { data }),
  //- 修改用户状态
  updateStatusById: (data: {
    id: number,
    status: number;
  }) => http.request<UserMangerAPI.updateStatusByIdResType>("post", "/kmg/matchUser/v1/updateStatusById", { data }),
};
