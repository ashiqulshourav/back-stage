import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import {
  searchFormType,
  seriesTypesSingle,
  seriesTypesDuplex,
  riskStatusMap,
  riskStatus
} from './types';
import { columns } from './exportTableColumnList';
import { utils, writeFile } from 'xlsx';
import { addDialog, closeDialog } from '@/components/ReDialog/index';
import { reactive, ref, onMounted, h } from 'vue';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import {
  markeTypeMap,
  useSportFormatDetail,
  displayHomeAwayScore,
  BET_RESULT_TYPE_MAP,
  formatSeriesType
} from '@/utils/formatMatch';
import dayjs from 'dayjs';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { copyTextToClipboard } from '@pureadmin/utils';
import { t } from '@/plugins/i18n';
import formDom from '../component/form.vue';
import { ElMessageBox, FormInstance } from 'element-plus';
import editOrder from '../component/editOrder.vue';

export function useBettingAuditHook(venueType: number) {
  const { openPasswordInput } = usePasswordInputHook();
  const dataList = reactive<BetOrderAPI.BetOrderList[]>([]);
  const tenantList = reactive<any>([]);
  const tenantObj = reactive<any>({});
  const loading = ref(true);
  const hasDataFetching = ref(1);
  const dataFetchingTime = ref(60);
  const loopTimer = ref<NodeJS.Timeout>();
  const isEditDialogClick = ref(false);
  const isEditRemarkClick = ref(false);

  const totalInfo = reactive<BetOrderAPI.RiskOtherDataType>(
    {} as BetOrderAPI.RiskOtherDataType
  );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100, 200, 500],
    background: true
  });
  const form = reactive<searchFormType>({
    sportId: '',
    userIdOrName: '',
    createTimeStart: dayjs().subtract(30, 'day').startOf('day').valueOf(),
    createTimeEnd: dayjs().endOf('day').valueOf(),
    orderId: '',
    leagueId: '',
    matchId: '',
    seriesType: '',
    category: '',
    tenantIds: [],
    seriesDetailsSingle: [],
    seriesDetailsDuplex: [],
    minBetAmount: '',
    maxBetAmount: '',
    riskStatus: ''
  });
  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }
  const selectReject = (flag: boolean, index: number, i) => {
    dataList[index].combineOrderDetails[i]['rejectSelected'] = flag;
  };
  const selectApprove = (flag, index, i) => {
    dataList[index].combineOrderDetails[i]['approveSelected'] = flag;
  };
  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  const formatParams = (privateparams = {}, pageNum?: number) => {
    let seriesDetails: any = [];
    if (form.seriesType == 2) {
      if (form.seriesDetailsSingle.length) {
        form.seriesDetailsSingle.map((item: any) => {
          seriesDetails.push(
            ...seriesTypesSingle[item as keyof typeof seriesTypesSingle].list
          );
        });
      } else {
        for (const item in seriesTypesSingle) {
          seriesDetails.push(
            ...seriesTypesSingle[item as keyof typeof seriesTypesSingle].list
          );
        }
      }
    } else if (form.seriesType == 3) {
      if (form.seriesDetailsDuplex.length) {
        form.seriesDetailsDuplex.map((item: any) => {
          seriesDetails.push(
            ...seriesTypesDuplex[item as keyof typeof seriesTypesDuplex].list
          );
        });
      } else {
        for (const item in seriesTypesDuplex) {
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
      // @ts-ignore
      ...removeEmptyStringKeys({
        ...form,
        seriesDetailsSingle: '',
        seriesDetailsDuplex: '',
        seriesDetails: seriesDetails,
        seriesType: form.seriesType > 2 ? 2 : form.seriesType
      }),
      pageSize: pageNum || pagination.pageSize,
      pageNum: pagination.currentPage,
      ...privateparams
    };
  };

  const fetchData = async (type?: string) => {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      const params: searchFormType = formatParams({}) as searchFormType;
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
      loading.value = true;
      const res: BetOrderAPI.BetOrderResType = await API.bettingAuditList({
        ...params,
        venueType
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      if (res.data !== null) {
        dataList.push(...res?.data?.pageData);
        dataList.map((item: any, index) => {
          item.index = index + 1;
          item.combineOrderDetails.map((item: BetOrderAPI.Detail) => {
            item.rejectSelected = false;
            item.approveSelected = false;
          });
        });
        pagination.total = res?.data?.count;
        pagination.pageSize = res?.data?.pageSize;
        pagination.currentPage = res?.data?.pageNum;
        Object.assign(totalInfo, res?.data?.otherData);
      }
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        ?.scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  };

  const fetchListDataWithInterval = async (type?: string) => {
    _clearInterval();
    console.log({ dataFetchingTime: dataFetchingTime.value });
    if (hasDataFetching.value) {
      if (!isEditDialogClick.value && !isEditRemarkClick.value) {
        loopTimer.value = setInterval(
          async () => await fetchData(type),
          Number(dataFetchingTime.value) * 1000
        );
      }
    }
  };

  const _clearInterval = () =>
    loopTimer.value && clearInterval(loopTimer.value);

  async function onSearch(type?: string) {
    _clearInterval();

    await fetchData(type);

    await fetchListDataWithInterval();
  }

  watch(
    () => [hasDataFetching.value, dataFetchingTime.value],
    () => {
      onSearch();
    }
  );

  async function getRowByOrderId(orderId: string) {
    try {
      const params: searchFormType = formatParams(
        {
          export: false,
          orderId: orderId
        },
        1 // reset pageNum
      ) as searchFormType;

      const res: BetOrderAPI.BetOrderResType = await API.bettingAuditList(
        params
      );
      if (res.code) return message(res.msg, { type: 'error' });
      if (res.data !== null) {
        const list = res?.data?.pageData || [];
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

  const getTenantList = async () => {
    const res = await API.queryTenantList({ category: venueType });
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
    formEl?.resetFields();
    onSearch();
  };

  // export to excel
  const exportFile = async () => {
    const res: BetOrderAPI.BetOrderResType = await API.bettingAuditListExport(
      formatParams({ pageNum: 1, pageSize: 50000, venueType }) as searchFormType
    );
    message(res.msg, { type: res.code ? 'error' : 'success' });
  };

  const handleCancel = (row: any, index: number) => {
    _clearInterval();
    const data = { ...row }; //...row.combineOrderDetails[index]
    data.combineOrderDetails = data.combineOrderDetails.filter(
      (item: BetOrderAPI.Detail, i: number) => {
        return i == index;
      }
    );
    const details = data.combineOrderDetails.map((item: BetOrderAPI.Detail) => {
      return { detailId: item.detailId, riskTimes: item.riskTimes };
    });
    const list = [{ orderId: data.id, details: details }];
    openCancelDialog(list);
  };

  const openCancelDialog = async list => {
    const r = await openPasswordInput();
    if (!r) return;
    addDialog({
      title: '风控划单',
      width: '30%',
      hideFooter: true,
      closeOnClickModal: false,
      alignCenter: true,
      contentRenderer: ({ options, index }) =>
        h(formDom, {
          list: list,
          onCloseDialog: async () => {
            isEditDialogClick.value = false;
            // onSearch('reload');
            await fetchListDataWithInterval('reload');
            closeDialog(options, index);
          }
        })
    });
  };
  const handleApprove = (row: any, index: number) => {
    _clearInterval();
    const data = { ...row }; //...row.combineOrderDetails[index]
    data.combineOrderDetails = data.combineOrderDetails.filter((item, i) => {
      return i == index;
    });
    const details = data.combineOrderDetails.map(item => {
      return { detailId: item.detailId, riskTimes: item.riskTimes };
    });
    const list = [{ orderId: data.id, details: details }];
    openApproveDialog(list);
  };
  const handleApproveSome = () => {
    _clearInterval();
    const obj = {};
    dataList.map(item => {
      item.combineOrderDetails.map((match: any) => {
        if (match.approveSelected) {
          if (!obj[item.id]) {
            obj[item.id] = { orderId: '', details: [] };
            obj[item.id]['orderId'] = item.id;
            obj[item.id]['details'] = [
              { detailId: match.detailId, riskTimes: match.riskTimes }
            ];
          } else {
            obj[item.id]['details'].push({
              detailId: match.detailId,
              riskTimes: match.riskTimes
            });
          }
        }
      });
    });
    const list = Object.values(obj).map(value => {
      return value;
    });
    openApproveDialog(list);
  };
  const handleCancelSome = () => {
    const obj = {};
    dataList.map(item => {
      item.combineOrderDetails.map((match: any) => {
        if (match.rejectSelected) {
          if (!obj[item.id]) {
            obj[item.id] = { orderId: '', details: [] };
            obj[item.id]['orderId'] = item.id;
            obj[item.id]['details'] = [
              { detailId: match.detailId, riskTimes: match.riskTimes }
            ];
          } else {
            obj[item.id]['details'].push({
              detailId: match.detailId,
              riskTimes: match.riskTimes
            });
          }
        }
      });
    });
    const list = Object.values(obj).map(value => {
      return value;
    });
    openCancelDialog(list);
  };

  const openApproveDialog = list => {
    ElMessageBox.confirm(t('确定审核通过吗？'), t('警告'), {
      center: true,
      type: 'warning'
    }).then(async () => {
      isEditDialogClick.value = false;
      const r = await openPasswordInput();
      if (!r) {
        return;
      }
      API.bettingAuditConfirm(list).then(async res => {
        await fetchListDataWithInterval();
        res.code === 0
          ? message(res.msg, { type: 'success' })
          : message(res.msg, { type: 'error' });
      });
    });
  };

  const getRiskStatus = (rStatus: number) => {
    let obj = { label: '', bgColor: '' };
    if (rStatus === riskStatus.approve) {
      obj = { label: riskStatusMap[riskStatus.approve], bgColor: '#FFC53D' };
    } else if (rStatus === riskStatus.reject) {
      obj = { label: riskStatusMap[riskStatus.reject], bgColor: '#F88D48' };
    } else if (rStatus === riskStatus.rejectBetting) {
      obj = {
        label: riskStatusMap[riskStatus.rejectBetting],
        bgColor: '#F88D48'
      };
    } else if (rStatus === riskStatus.autoReject) {
      obj = { label: riskStatusMap[riskStatus.autoReject], bgColor: '#F88D48' };
    }
    return obj;
  };
  const editDialogRef = ref();
  const editMatchDetailRemark = (
    orderId: string,
    orderDetailId: number,
    orderDetailRemark: string
  ) => {
    _clearInterval();
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
          data: { orderDetailId, orderDetailRemark },
          onCloseDialog: async (value: string) => {
            isEditRemarkClick.value = false;
            closeDialog(options, index);
            getRowByOrderId(orderId);
            // refresh data
            await fetchListDataWithInterval();
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

  //- 切换比赛类型
  onMounted(() => {
    onSearch();
    getTenantList();
  });

  onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  });

  return {
    loading,
    dataList,
    tenantList,
    pagination,
    form,
    totalInfo,
    onSearch,
    resetForm,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    exportFile,
    getRiskStatus,
    copyTest,
    tenantObj,
    handleCancel,
    handleApprove,
    handleCancelSome,
    handleApproveSome,
    selectReject,
    selectApprove,
    editMatchDetailRemark,
    hasDataFetching,
    dataFetchingTime
  };
}
