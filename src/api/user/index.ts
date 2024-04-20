import { http } from '@/utils/http';

export const user = {
  //- 登录
  login: (data: { name: string; pwd: string; ukeyPassword: string }) =>
    http.request<UserAPI.Login>('post', '/kmg/auth/login', { data }),
  //- 修改密码
  updatePwd: (data: { id: number; pwd: string; newPwd: string }) =>
    http.request<UserAPI.LoginResType>('post', '/kmg/matchUser/v1/updatePwd', {
      data
    }),
  //- 获取路由表
  getRouter: (data: { id: number }) =>
    http.request<UserAPI.RouterResType>(
      'post',
      '/kmg/matchRole/v1/getResourcelist',
      { data }
    ),
  //- 退出登录
  loginOut: (data: { id: number; name: string }) =>
    http.request<UserAPI.RouterResType>('post', '/kmg/auth/loginOut', { data }),

  //- 用户等级限额列表
  getUserLevelLimitList: (data: { type: number }) =>
    http.request<UserAPI.UserLevelLimitListResData>(
      'post',
      '/userLevelLimit/v1/getUserLevelLimitList',
      { data }
    ),
  //- 用户列表
  operateUserList: (data: {
    pageSize: number;
    pageNum: number;
    ids?: string[];
    venueType: number;
    tenantIds?: number | string | string[];
    limitLevel?: number | string;
    limittenantCodeLevel?: number | string;
  }) =>
    http.request<UserAPI.operateUserListReqType>('post', '/operate/userList', {
      data
    }),
  addLabels: (data: {
    id: number[],
    labelId: number[]
  }) => http.request<UserAPI.updateUserLevelLimitResType>('post', '/operate/updateUserLabelAdd', {
      data
  }), 
  getLabelList: (data:{
    category: number
  }) =>
    http.request<UserAPI.GetLabelListRes>('get', '/operate/getLabelList', {params: data}),
  //- 修改用户等级限额
  updateUserLabelDel: (data: { id: number[]; labelId: number[] }) =>
    http.request<UserAPI.updateUserLevelLimitResType>(
      'post',
      '/operate/updateUserLabelDel',
      { data }
    ),
  getLabelRecord: (data: {
    pageSize: number;
    pageNum: number;
    id?: number;
    labelType?: number;
    offset?: number
  }) =>
    http.request<UserAPI.getRecordListDataRes>('post', '/operate/getLabelListUserRecord', {
      data
    }),
  updateUserLevelLimit: (data: {
    list: UserAPI.updateLimmitReqType[];
    type: number;
  }) =>
    http.request<UserAPI.updateUserLevelLimitResType>(
      'post',
      '/userLevelLimit/v1/updateUserLevelLimit',
      { data }
    ),
  //- 用户权限下拉框
  getLimitListDropDownBox: () =>
    http.request<UserAPI.userBaseResType>(
      'get',
      '/userLevelLimit/v1/getLimitListDropDownBox',
      {}
    ),
  //- 修改用户限额
  operateUpdateUser: (data: {
    id: number | string;
    name: string;
    isFreeze: boolean | number;
    limitLevel: number;
    singleBetLimit: number | string | null;
    singleEventCompensationLimit: number | string | null;
    remark: string;
  }) =>
    http.request<UserAPI.userBaseResType>('post', '/operate/updateUser', {
      data
    })
};
