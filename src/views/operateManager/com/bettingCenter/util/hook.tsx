import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import type { FormInstance } from 'element-plus';
import { usePublicHooks } from '@/hooks';
const { exportDialog } = usePublicHooks();
import {
  betStatus,
  searchFormType,
  seriesTypesSingle,
  seriesTypesDuplex
} from './types';
import { addDialog, closeDialog } from '@/components/ReDialog/index';
import editMatch from '../component/editMatch.vue';
import { reactive, ref, onMounted, h } from 'vue';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import { BET_RESULT_TYPE_MAP } from '@/utils/formatMatch';
import dayjs from 'dayjs';
import { addThousandSeparator } from '@/utils/formatNumber';
import { ElMessageBox } from 'element-plus';
import { copyTextToClipboard } from '@pureadmin/utils';
import { t } from '@/plugins/i18n';
import { riskStatus } from '@/views/riskManagement/com/bettingAudit/util/types';
import editOrder from '../component/editOrder.vue';
import IpDialog from '../component/IpDialog.vue';
export function useBettingCenterHook(category: number, venueType: number) {
  const router = useRouter();
  const { openPasswordInput } = usePasswordInputHook();
  const dataList = reactive<BetOrderAPI.BetOrderList[]>([]);
  const tenantList = reactive<
    { name: string; id: number; tenantName: string }[]
  >([]);
  const tenantObj = reactive<any>({});
  const riskLabelList = reactive<UserAPI.labelType[]>([]);
  const UDialogFlag = ref<Boolean>(false);
  const loading = ref(true);
  const downloading = ref(false);
  const totalInfo = ref<BetOrderAPI.otherDataType>(
    {} as BetOrderAPI.otherDataType
  );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    pageSizes: [20, 50, 100, 200],
    background: true
  });
  const form = reactive<searchFormType>({
    sportId: '',
    userIdOrName: '',
    timeStart: dayjs().subtract(30, 'day').startOf('day').valueOf(),
    timeEnd: dayjs().endOf('day').valueOf(),
    orderId: '',
    leagueId: '',
    matchId: '',
    awayTeamName: '',
    homeTeamName: '',
    betItemId: '',
    isInplay: '',
    seriesType: '',
    category: '',
    timeType: 1,
    leagueName: '',
    tenantIds: [],
    seriesDetailsSingle: [],
    seriesDetailsDuplex: [],
    queryType: 1,
    minBetAmount: '',
    maxBetAmount: '',
    minProfitAmount: '',
    maxProfitAmount: '',
    riskControlLabelList: [],
    venueType: venueType,
    ip: ''
  });
  function handlePageSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val: number) {
    console.log('handleSelectionChange', val);
  }

  const formatParams = (
    privateparams = {},
    order_id?: number,
    page?: number
  ) => {
    let seriesDetails: any = [];
    if (form.seriesType == 2) {
      if (form.seriesDetailsSingle.length) {
        form.seriesDetailsSingle.map((item: keyof typeof seriesTypesSingle) => {
          seriesDetails.push(...seriesTypesSingle[item].list);
        });
      } else {
        for (let item in seriesTypesSingle) {
          seriesDetails.push(
            ...seriesTypesSingle[item as keyof typeof seriesTypesSingle].list
          );
        }
      }
    } else if (form.seriesType == 3) {
      if (form.seriesDetailsDuplex.length) {
        form.seriesDetailsDuplex.map((item: keyof typeof seriesTypesSingle) => {
          seriesDetails.push(
            ...seriesTypesDuplex[item as keyof typeof seriesTypesDuplex].list
          );
        });
      } else {
        for (let item in seriesTypesDuplex) {
          seriesDetails.push(
            ...seriesTypesDuplex[item as keyof typeof seriesTypesDuplex].list
          );
        }
      }
    } else {
      seriesDetails = '';
    }
    if (seriesDetails.length > 1) {
      seriesDetails = [...new Set(seriesDetails)];
    }
    return {
      ...removeEmptyStringKeys({
        ...form,
        orderId: order_id || form.orderId,
        seriesDetailsSingle: '',
        seriesDetailsDuplex: '',
        seriesDetails: seriesDetails,
        seriesType: +form.seriesType > 2 ? 2 : form.seriesType,
        venueType: venueType,
        category: venueType === 0 ? form.category : 1
      }),
      pageSize: pagination.pageSize,
      pageNum: page || pagination.currentPage,
      ...privateparams
    };
  };
  async function getRowByOrderId(orderId: number) {
    try {
      const params: searchFormType = formatParams({
        export: false,
        orderId: orderId,
        pageNum: 1
      }) as searchFormType;
      const res: BetOrderAPI.BetOrderResType = await API.bettingCenterList(
        params
      );
      if (res.code) return message(res.msg, { type: 'error' });
      if (res.data !== null) {
        let list = res?.data?.pageData || [];
        list = list.map((row: BetOrderAPI.BetOrderList) => {
          row.riskStatusArr = [];
          row.combineOrderDetails.map((item2: BetOrderAPI.Detail) => {
            row.riskStatusArr?.push(item2.riskStatus);
          });
          return row;
        });

        dataList.map((item: any) => {
          if (item.id === orderId) {
            Object.assign(item, list[0]);
          }
        });
      }
    } catch (error) {
      loading.value = false;
    }
  }

  async function onSearch(type?: string) {
    return new Promise((resolve, reject) => {
      if (type === 'reload') pagination.currentPage = 1;
      try {
        const params: searchFormType = formatParams({
          export: false
        }) as searchFormType;
        if (Number(params.maxBetAmount) < Number(params.minBetAmount)) {
          message(t('请检查投注额，最小值不能大于最大值'), { type: 'warning' });
          return;
        }
        if (Number(params.maxProfitAmount) < Number(params.minProfitAmount)) {
          message(t('请检查用户输赢，最小值不能大于最大值'), {
            type: 'warning'
          });
          return;
        }
        if (type !== 'export') {
          loading.value = true;
        }
        API.bettingCenterList(params).then(res => {
          loading.value = false;
          if (res.code) return message(res.msg, { type: 'error' });
          if (res.data !== null) {
            resolve(res?.data);
            if (type === 'export') {
              return;
            }
            dataList.length = 0;
            let list = res?.data?.pageData || [];
            list = list.map((row: BetOrderAPI.BetOrderList) => {
              // item.index = index + 1;
              row.riskStatusArr = [];
              row.betResultArr = [];
              row.combineOrderDetails.map((item2: BetOrderAPI.Detail) => {
                row.riskStatusArr?.push(item2.riskStatus);
                row.betResultArr.push(item2.betResult);
              });
              return row;
            });
            dataList.push(...list);
            dataList.map((item: any, index) => {
              item.index = index + 1;
            });
            pagination.total = res.data?.count;
            pagination.pageSize = res.data?.pageSize;
            pagination.currentPage = res.data?.pageNum;
            if (pagination.currentPage === 1) {
              totalInfo.value = res.data?.otherData;
            }
          } else {
            reject();
            dataList.length = 0;
          }
          document
            ?.querySelector('.table_container .el-scrollbar__wrap')
            ?.scroll(0, 0);
        });
      } catch (error) {
        loading.value = false;
        reject();
      }
    });
  }
  const exportFile = async () => {
    downloading.value = true;
    onSearch('export').then((res0: any) => {
      if (res0?.count > 500000) {
        message(
          `当前条件下数据量为${addThousandSeparator(
            res0?.count
          )}，大于50万条，不支持导出!`,
          { type: 'error' }
        );
      } else if (res0?.count < 1 || res0 === null) {
        message('数据量为零，无法导出', { type: 'error' });
      } else {
        exportDialog({
          firstTitle: t('导出当前投注单数据?'),
          router,
          callback: async () => {
            API.bettingCenterExport(
              formatParams({
                export: true
              }) as searchFormType
            ).then(res => {
              message(res.msg, { type: res.code ? 'error' : 'success' });
            });
          }
        });
      }
    });
    downloading.value = false;
  };

  const getTenantList = async () => {
    const res = await API.queryTenantList({
      category: category
    });
    if (res.data?.length) {
      tenantList.push(...res?.data);
      // 将数组根据id转换为对象
      tenantList.map(item => {
        tenantObj[item.id] = item;
      });
    }
  };

  const resetForm = (formEl: FormInstance) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const handleCancel = (data: any) => {
    ElMessageBox.confirm(t('确定取消注单吗？'), t('警告'), {
      center: true,
      type: 'warning'
    }).then(async () => {
      const r = await openPasswordInput();
      if (r) {
        const params: any = { orderIds: [data.id] };
        API.orderCancel(params).then(res => {
          if (res.code) {
          } else {
            getRowByOrderId(data.id);
          }
          message(res.msg, { type: res.code ? 'error' : 'success' });
        });
      }
    });
  };
  const getStatus = (
    status: number,
    billStatus: number,
    betResultArr: number[],
    isReserve: number,
    riskStatusArr?: number[],
    isSpecialSettle?: number
  ) => {
    let obj = { status: -1, bgColor: '' };
    if (isSpecialSettle === 1) {
      // 特殊结算也算已结算
      obj = { status: betStatus.settlementBet, bgColor: '#40A9FF' };
    } else if (betResultArr?.includes(22)||betResultArr?.includes(25)) {
      //预约取消
      obj = { status: betStatus.reverseCancel, bgColor: '#F57582' };
    } else if (riskStatusArr?.includes(riskStatus.rejectBetting)) {
      //待审核
      obj = { status: betStatus.PendingApprove, bgColor: '#F57582' };
    } else if (
      betResultArr?.includes(61) &&
      (riskStatusArr?.includes(riskStatus.reject) ||
        riskStatusArr?.includes(riskStatus.autoReject))
    ) {
      // 封控划单 203 204
      obj = { status: betStatus.riskReject, bgColor: '#F88D48' };
    } else if (
      riskStatusArr?.includes(riskStatus.reject1) ||
      riskStatusArr?.includes(riskStatus.autoReject1)
    ) {
      // 封控拒单 201 202
      obj = { status: betStatus.betFail, bgColor: '#F88D48' };
    } else if (
      status == 2 &&
      billStatus === 1 &&
      (betResultArr?.includes(22) || betResultArr?.includes(23)||betResultArr?.includes(25))
    ) {
      // 注单无效
      obj = { status: betStatus.betInvalid, bgColor: '#E54752' };
    } else if (
      riskStatusArr?.includes(riskStatus.autoApprove) &&
      betResultArr.includes(24)
    ) {
      // 注单无效
      obj = { status: betStatus.betInvalid, bgColor: '#E54752' };
    } else if (status === 2 && billStatus === 1 && betResultArr?.includes(21)) {
      // 预约失败
      obj = { status: betStatus.reserveFail, bgColor: '#F57582' };
    } else if (status === 0 && billStatus === 0) {
      // 未结算
      if (isReserve === 1) {
        // 预约中
        obj = { status: betStatus.onReverse, bgColor: '#F57582' };
      } else {
        obj = { status: betStatus.unsettlementBet, bgColor: '#FFC53D' };
      }
    } else if (status === 1 && billStatus === 1) {
      // 已结算
      obj = { status: betStatus.settlementBet, bgColor: '#40A9FF' };
    } else if (status === 3) {
      // 待确认
      obj = { status: betStatus.PendingApprove, bgColor: '#FFC53D' };
    } else if (status === 4) {
      // 投注失败
      obj = { status: betStatus.betFail, bgColor: '#F57582' };
    } else if (status === 5) {
      // 赛事异常
      obj = { status: betStatus.eventAbnormal, bgColor: '#F88D48' };
    }
    return obj;
  };

  const getOddStatus = (betResult: number, riskSt: number) => {
    if (riskSt === riskStatus.reject1 || riskSt === riskStatus.autoReject1) {
      return '投注失败';
    } else if (
      riskSt === riskStatus.reject ||
      riskSt === riskStatus.autoReject
    ) {
      return '无效注单';
    } else if (betResult === 24 && riskSt == riskStatus.autoApprove) {
      return '盘口取消';
    } else {
      return (
        BET_RESULT_TYPE_MAP[betResult as keyof typeof BET_RESULT_TYPE_MAP] || ''
      );
    }
  };

  const switchDialog = async (flag: boolean, row: any) => {
    UDialogFlag.value = flag;
    if (flag) {
      const r = await openPasswordInput();
      if (!r) return;
      handleEditResult(row);
    }
  };

  const editDialogRef = ref();
  const handleEditResult = (row: any) => {
    addDialog({
      title: t(''),
      class: 'reset_dialog',
      width: row.combineOrderDetails.length > 1 ? '75%' : '500px',
      center: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editMatch, {
          ref: editDialogRef,
          data: row,
          onCloseDialog: (_: boolean) => {
            closeDialog(options, index);
            getRowByOrderId(row.id);
          }
        })
    });
  };
  function copyTest(str: string, tip: string) {
    if (!str) return;
    const success = copyTextToClipboard(str.toString());
    success
      ? message(t('复制{value}成功!', { value: tip || str || '' }), {
          type: 'success'
        })
      : message(t('复制失败'), { type: 'error' });
  }

  const isShowCancel = (row: BetOrderAPI.BetOrderList) => {
    let flag = true;
    row.combineOrderDetails.map((item: BetOrderAPI.Detail) => {
      if (
        item.riskStatus === riskStatus.rejectBetting ||
        item.riskStatus === riskStatus.reject ||
        item.riskStatus === riskStatus.approve ||
        item.riskStatus === riskStatus.autoReject
      ) {
        flag = false;
      }
    });
    return flag;
  };
  const editOrderRemark = (id: number, orderRemark: string) => {
    addDialog({
      title: t('编辑备注'),
      class: 'reset_dialog',
      width: '500px',
      center: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editOrder, {
          ref: editDialogRef,
          data: { orderId: id, orderRemark },
          onCloseDialog: (_: boolean) => {
            closeDialog(options, index);
            //onSearch();
            getRowByOrderId(id);
          }
        })
    });
  };
  const getRiskLabelList = async () => {
    try {
      const res = await API.getLabelList({
        category: venueType
      });

      if (res.data.riskControlLabelList)
        riskLabelList.push(...res.data.riskControlLabelList);
    } catch (error) {
      return message(error as string, { type: 'error' });
    }
  };

  //- 切换比赛类型
  onMounted(() => {
    onSearch();
    getTenantList();
    getRiskLabelList();
  });

  //- IP地址弹窗

  const openIpDialog = (ip: string) => {
    addDialog({
      title: t(''),
      alignCenter: true,
      class: 'reset_dialog',
      width: '75%',
      center: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => h(IpDialog, { ip })
    });
  };

  return {
    loading,
    dataList,
    tenantList,
    pagination,
    form,
    totalInfo,
    onSearch,
    resetForm,
    handlePageSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    exportFile,
    handleCancel,
    getStatus,
    copyTest,
    tenantObj,
    UDialogFlag,
    switchDialog,
    isShowCancel,
    editOrderRemark,
    riskLabelList,
    getOddStatus,
    downloading,
    openIpDialog
  };
}
