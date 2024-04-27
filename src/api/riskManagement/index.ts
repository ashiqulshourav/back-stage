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
  editMatchDetailRemark: (data: {orderDetailId:number,remark:string}) => http.request<any>("post", "/bet-center/betOrderDetail/editRemark", { data }),
};
