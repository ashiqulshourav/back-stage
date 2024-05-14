import { http } from '@/utils/http';
import mockAPI from './mock';

export const riskManagementData = {
  //- 风控管理
  getRiskTagList: (data: RiskManagementDataAPI.RiskTagListSearchProps) =>
    http.request<RiskManagementDataAPI.RiskTagListRes>(
      'post',
      '/operateLabel/listByType',
      { data: { ...data, labelType: 1 } }
    ),

  updateRiskTag: (data: RiskManagementDataAPI.RiskTagType) =>
    http.request<RiskManagementDataAPI.RiskTagRes>(
      'post',
      '/operateLabel/edit',
      {
        data: { ...data, labelType: 1 }
      }
    ),

  createRiskTag: (data: RiskManagementDataAPI.RiskTagType) =>
    http.request<RiskManagementDataAPI.RiskTagRes>(
      'post',
      '/operateLabel/add',
      {
        data: { ...data, labelType: 1 }
      }
    ),

  deleteRiskTag: (data: RiskManagementDataAPI.RiskTagType) =>
    http.request<
      COMMON.BASE_RES_TYPE<null | RiskManagementDataAPI.RiskTagType>
    >('post', '/operateLabel/del', {
      data
    }),
  // 针对赛事编辑备注
  editMatchDetailRemark: (data: { orderDetailId: number; remark: string }) =>
    http.request<any>('post', '/bet-center/betOrderDetail/editRemark', {
      data
    }),
  // 单关限额列表 0足球 1篮球 2其他 3电竞
  getGameLimitList: (gameType: number) =>
    http.request<RiskManagementDataAPI.LimitRes>('post', '/betLimit/list', {
      data: { gameType }
    }),

  getAutoLimitConfigList: () =>
    http.request<any>('post', '/autoLimitConfig/list', {
      data: {}
    }),

  updateAutoLimitConfig: (data: RiskManagementDataAPI.RiskControlTypes) =>
    http.request<any>('post', '/autoLimitConfig/addOrEdit', { data }),

  //- 修改单关限额列表
  updateLevelLimit: (data: RiskManagementDataAPI.LimitListType[]) =>
    http.request<RiskManagementDataAPI.updateLevelLimitResType>(
      'post',
      '/betLimit/update',
      { data }
    ),
  // mockAPI.deleteRiskTag(data)

  // order placement
  getRiskSettleConfigList: () =>
    http.request<any>('post', '/risk/settle/config/list'),

  updateOrderPlacement: (data: RiskManagementDataAPI.OrderPlacementTypes) =>
    http.request<any>('post', '/risk/settle/config/edit', { data }),

  // order reject list
  getRiskBetConfigList: () =>
    http.request<any>('post', '/risk/bet/config/list'),

  editRiskBetConfigEdit: (data: RiskManagementDataAPI.OrderRejectTypes) =>
    http.request<any>('post', '/risk/bet/config/edit', { data })
};
