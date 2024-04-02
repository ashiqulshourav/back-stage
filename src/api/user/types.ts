declare namespace UserAPI {
  type LoginData = {
    token: string;
    name: string;
    id: number;
    status: number;
    isAdmin: number;
  }

  type Login = COMMON.BASE_RES_TYPE<LoginData>
  type LoginResType = COMMON.BASE_RES_TYPE<LoginData>

  type Meta = {
    title?: string;
    icon?: string;
    rank?: number;
    roles?: string[];
  }

  type RouterChildren = {
    path: string;
    name: string;
    enName?: string;
    childResourceList?: any[];
    sort?: string | number;
    meta: Meta;
  }

  type RouterData = {
    path: string;
    name?: string;
    meta: Meta;
    enName?: string;
    childResourceList?: any[];
    sort?: string | number;
    children?: RouterChildren[];
  }

  type ChildResourceList = {
    id: number;
    name: string;
    enName: string;
    routerPath: string;
    parentId: number;
    type: number;
    sort: number;
    resourceFlag: number;
    path: string;
    childResourceList: any[];
  }

  type RouterResData = {
    id: number;
    name: string;
    enName: string;
    routerPath: string;
    parentId: number;
    type: number;
    sort: number;
    resourceFlag: number;
    path: string;
    childResourceList: ChildResourceList[];
  }


  type UserLevelLimitListRes = {
    id?: number;
    levelLimit: number;
    productAmountTotalLimit: number;
    maxWinAmountLimit: number;
    userSingleGamePay: number;
    singleMatchPay: number;
    bunchMatchPay: number;
    championDailyPay: number;
    type?: number;
  }

  type UserLevelLimitListResData = COMMON.BASE_RES_TYPE<UserLevelLimitListRes[]>

  type RouterResType = COMMON.BASE_RES_TYPE<RouterResData[]>
  type updateUserLevelLimitResType = COMMON.BASE_RES_TYPE<null>

  type updateLimmitReqType = {
    id?: number;
    levelLimit: number;
    productAmountTotalLimit: number;
    maxWinAmountLimit: number;
    userSingleGamePay: number;
    singleMatchPay: number;
    bunchMatchPay: number;
    championDailyPay: number,
    type?: number;
  }
}