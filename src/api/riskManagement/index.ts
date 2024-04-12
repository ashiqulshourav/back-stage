import { http } from '@/utils/http';
import mockAPI from './mock';

export const riskManagementData = {
  //- 风控管理
  getRiskTagList: (data: RiskManagementDataAPI.RiskTagListSearchProps) =>
    //   http.request<RiskManagementDataAPI.RiskTagListRes>(
    //     'post',
    //     '/riskManagement/tags/list',
    //     { data }
    //   ),
    mockAPI.getRiskTagList(data),

  updateRiskTag: (data: RiskManagementDataAPI.RiskTagType) =>
    // http.request<RiskManagementDataAPI.RiskTagRes>(
    //   'post',
    //   '/riskManagement/tags/update',
    //   {
    //     data
    //   }
    // ),
    mockAPI.updateRiskTag(data),

  createRiskTag: (data: RiskManagementDataAPI.RiskTagType) =>
    // http.request<RiskManagementDataAPI.RiskTagRes>(
    //   'post',
    //   '/riskManagement/tags/create',
    //   {
    //     data
    //   }
    // ),
    mockAPI.createRiskTag(data),

  deleteRiskTag: (data: RiskManagementDataAPI.RiskTagType) =>
    // http.request<
    //   COMMON.BASE_RES_TYPE<null | RiskManagementDataAPI.RiskTagType>
    // >('post', '/riskManagement/tags/del', {
    //   data
    // })
    mockAPI.deleteRiskTag(data)
};
