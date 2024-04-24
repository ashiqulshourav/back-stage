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
  // mockAPI.getRiskTagList(data),

  updateRiskTag: (data: RiskManagementDataAPI.RiskTagType) =>
    http.request<RiskManagementDataAPI.RiskTagRes>(
      'post',
      '/operateLabel/edit',
      {
        data: { ...data, labelType: 1 }
      }
    ),
  // mockAPI.updateRiskTag(data),

  createRiskTag: (data: RiskManagementDataAPI.RiskTagType) =>
    http.request<RiskManagementDataAPI.RiskTagRes>(
      'post',
      '/operateLabel/add',
      {
        data: { ...data, labelType: 1 }
      }
    ),
  // mockAPI.createRiskTag(data),

  deleteRiskTag: (data: RiskManagementDataAPI.RiskTagType) =>
    http.request<
      COMMON.BASE_RES_TYPE<null | RiskManagementDataAPI.RiskTagType>
    >('post', '/operateLabel/del', {
      data
    }),
  // 单关限额列表 0足球 1篮球 2其他 3电竞
  getGameLimitList: (gameType: number) =>
    http.request<RiskManagementDataAPI.LimitRes>('post', '/betLimit/list', { data: { gameType } }),
  //- 修改单关限额列表
  updateLevelLimit: (data: RiskManagementDataAPI.LimitListType[]) => http.request<RiskManagementDataAPI.updateLevelLimitResType>("post", "/betLimit/update", { data }),
  // mockAPI.deleteRiskTag(data)
};
