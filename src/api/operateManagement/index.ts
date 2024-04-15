import { http } from '@/utils/http';
import mockAPI from './mock';

export const operateManagementData = {
  //- 风控管理
  getOperateTagList: (
    data: OperateManagementDataAPI.OperateTagListSearchProps
  ) =>
    //   http.request<OperateManagementDataAPI.OperateTagListRes>(
    //     'post',
    //     '/OperateManagement/tags/list',
    //     { data }
    //   ),
    mockAPI.getOperateTagList(data),

  updateOperateTag: (data: OperateManagementDataAPI.OperateTagType) =>
    // http.request<OperateManagementDataAPI.OperateTagRes>(
    //   'post',
    //   '/OperateManagement/tags/update',
    //   {
    //     data
    //   }
    // ),
    mockAPI.updateOperateTag(data),

  createOperateTag: (data: OperateManagementDataAPI.OperateTagType) =>
    // http.request<OperateManagementDataAPI.OperateTagRes>(
    //   'post',
    //   '/OperateManagement/tags/create',
    //   {
    //     data
    //   }
    // ),
    mockAPI.createOperateTag(data),

  deleteOperateTag: (data: OperateManagementDataAPI.OperateTagType) =>
    // http.request<
    //   COMMON.BASE_RES_TYPE<null | OperateManagementDataAPI.OperateTagType>
    // >('post', '/OperateManagement/tags/del', {
    //   data
    // })
    mockAPI.deleteOperateTag(data)
};
