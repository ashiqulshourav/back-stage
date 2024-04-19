import { http } from '@/utils/http';
import mockAPI from './mock';

export const operateManagementData = {
  //- 运营管理
  getOperateTagList: (
    data: OperateManagementDataAPI.OperateTagListSearchProps
  ) =>
    http.request<OperateManagementDataAPI.OperateTagListRes>(
      'post',
      '/operateLabel/listByType',
      { data: { ...data, labelType: 2 } }
    ),
  // mockAPI.getOperateTagList(data),

  updateOperateTag: (data: OperateManagementDataAPI.OperateTagType) =>
    // http.request<OperateManagementDataAPI.OperateTagRes>(
    //   'post',
    //   '/operateLabel/edit',
    //   {
    //     data: {...data, labelType: 2}
    //   }
    // ),
    mockAPI.updateOperateTag(data),

  createOperateTag: (data: OperateManagementDataAPI.OperateTagType) =>
    // http.request<OperateManagementDataAPI.OperateTagRes>(
    //   'post',
    //   '/operateLabel/add',
    //   {
    //     data: {...data, labelType: 2}
    //   }
    // ),
    mockAPI.createOperateTag(data),

  deleteOperateTag: (data: OperateManagementDataAPI.OperateTagType) =>
    // http.request<
    //   COMMON.BASE_RES_TYPE<null | OperateManagementDataAPI.OperateTagType>
    // >('post', '/operateLabel/del', {
    //   data
    // })
    mockAPI.deleteOperateTag(data)
};
