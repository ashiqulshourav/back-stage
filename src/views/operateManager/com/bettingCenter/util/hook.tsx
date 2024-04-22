import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import {
  betStatus,
  betStatusMap,
  searchFormType,
  seriesTypesSingle,
  seriesTypesDuplex
} from './types';
import { columns } from './exportTableColumnList';
import { utils, writeFile } from 'xlsx';
import { addDialog, closeDialog } from '@/components/ReDialog/index';
import editMatch from '../component/editMatch.vue';
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
import { ElMessageBox } from 'element-plus';
import { copyTextToClipboard } from '@pureadmin/utils';
import { t } from '@/plugins/i18n';
import {riskStatus} from "@/views/riskManagement/bettingAudit/util/types";

export function useBettingCenterHook(category:number,venueType:number) {
  const { openPasswordInput } = usePasswordInputHook();
  const dataList = reactive<BetOrderAPI.BetOrderList[]>([]);
  const tenantList = reactive<
    { name: string; id: number; tenantName: string }[]
  >([]);
  const tenantObj = reactive<any>({});
  const UDialogFlag = ref<Boolean>(false);
  const loading = ref(true);
  const totalInfo = reactive<BetOrderAPI.otherDataType>(
    {} as BetOrderAPI.otherDataType
  );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    pageSizes: [ 20, 50, 100, 200,500,1000,5000],
    background: true
  });
  const form = reactive<searchFormType>({
    sportId: '',
    userIdOrName: '',
    timeStart: dayjs().startOf('month').valueOf(),
    timeEnd: dayjs().endOf('day').valueOf(),
    orderId: '',
    leagueId: '',
    matchId: '',
    awayTeamName: '',
    homeTeamName: '',
    // status:[],
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
    maxProfitAmount: ''
  });
  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val:number) {
    console.log('handleSelectionChange', val);
  }

  const formatParams = (privateparams = {}) => {
    let seriesDetails: any = [];
    if (form.seriesType == 2) {
      if (form.seriesDetailsSingle.length) {
        form.seriesDetailsSingle.map((item: any) => {
          seriesDetails.push(...seriesTypesSingle[item].list);
        });
      } else {
        for (let item in seriesTypesSingle) {
          seriesDetails.push(...seriesTypesSingle[item].list);
        }
      }
    } else if (form.seriesType == 3) {
      if (form.seriesDetailsDuplex.length) {
        form.seriesDetailsDuplex.map((item: any) => {
          seriesDetails.push(...seriesTypesDuplex[item].list);
        });
      } else {
        for (let item in seriesTypesDuplex) {
          seriesDetails.push(...seriesTypesDuplex[item].list);
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
        seriesDetailsSingle: '',
        seriesDetailsDuplex: '',
        seriesDetails: seriesDetails,
        seriesType: +form.seriesType > 2 ? 2 : form.seriesType,
        venueType:venueType,
      }),
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage,
      ...privateparams
    };
  };

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      const params: searchFormType = formatParams({}) as searchFormType;
      if (Number(params.maxBetAmount) < Number(params.minBetAmount)) {
        message(t('请检查投注额，最小值不能大于最大值'), { type: 'warning' });
        return;
      }
      if (Number(params.maxProfitAmount) < Number(params.minProfitAmount)) {
        message(t('请检查用户输赢，最小值不能大于最大值'), { type: 'warning' });
        return;
      }
      loading.value = true;
      const res: BetOrderAPI.BetOrderResType = await API.bettingCenterList(
        params
      );
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      if (res.data !== null) {
        let list = res?.data?.pageData;
        list= list.map((row)=>{
          let riskStatus:number = -1;
          row.combineOrderDetails.map((item2)=>{
            if (item2.riskStatus===2) riskStatus = 2
          })
          row.riskStatus=riskStatus
          return row
        })
        dataList.push(...list);
        dataList.map((item: any, index) => {
          item.index = index + 1;
        });
        pagination.total = res.data?.count;
        pagination.pageSize = res.data?.pageSize;
        pagination.currentPage = res.data?.pageNum;
        Object.assign(totalInfo, res.data?.otherData);
      }
      document
        ?.querySelector('.table_container .el-scrollbar__wrap')
        ?.scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  }

  const getTenantList = async () => {
    const res = await API.queryTenantList({
      category:category
    });
    if (res.data?.length) {
      tenantList.push(...res?.data);
      // 将数组根据id转换为对象
      tenantList.map(item => {
        tenantObj[item.id] = item;
      });
    }
  };

  const resetForm = (formEl:any) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  //- 导出excel表格
  const exportFile = async () => {
    const res: BetOrderAPI.BetOrderResType = await API.bettingCenterList(
      formatParams({ pageNum: 1, pageSize: 50000 }) as searchFormType
    );
    const r = res.data.pageData.map((item: any, i) => {
      const arr = [];
      const data = { ...item, ...item?.combineOrderDetails[0] };
      columns.forEach((column: { prop: string }) => {
        let str = '';
        switch (column.prop.toString()) {
          case 'sportId':
            str =
              SPORT_ID_MAP.find(_ => +_.value === +data[column.prop as string])
                ?.label ?? data.sportNameCn;
            break;
          case 'beginTime':
            str = data.beginTime
              ? dayjs(data[column.prop])?.format('YYYY-MM-DD HH:mm:ss')
              : '';
            break;
          case 'createTime':
            str = data.createTime
              ? dayjs(data[column.prop])?.format('YYYY-MM-DD HH:mm:ss')
              : '';
            break;
          case 'settleTime':
            str = data.settleTime
              ? dayjs(data[column.prop])?.format('YYYY-MM-DD HH:mm:ss')
              : '';
            break;
          case 'index':
            str = (i + 1).toString();
            break;
          case 'playType':
            str = useSportFormatDetail(data)[4];
            break;
          case 'betName':
            str = useSportFormatDetail(data)[3];
            break;
          case 'teamName':
            if(data.kindsCode!== 'Outright'){
              str = `${data.homeTeamNameCn} vs ${data.awayTeamNameCn}`;
            }
            break;
          case 'marketType':
            str = markeTypeMap[data.marketType as keyof typeof markeTypeMap];
            break;
          case 'isSettlementAgain':
            str = data.isSettlementAgain === 2 ? '是' : '否';
            break;
          case 'status':
            str =
              betStatusMap[
                getStatus(
                  data.status,
                  data.billStatus,
                  data.betResult,
                  data.isReserve
                )?.status as keyof typeof betStatusMap
              ];
            break;
          case 'billStatus':
            str =
              betStatusMap[
                getStatus(
                  data.status,
                  data.billStatus,
                  data.betResult,
                  data.isReserve
                )?.status as keyof typeof betStatusMap
              ];
            break;
          case 'settleScore':
            str = displayHomeAwayScore(data.settleScore, data.sportId);
            break;
          case 'betResult':
            str = BET_RESULT_TYPE_MAP[data.betResult as keyof typeof BET_RESULT_TYPE_MAP];
            break;
          case 'scoreBenchmark':
            str = displayHomeAwayScore(data.scoreBenchmark, data.sportId);
            break;
          case 'seriesType':
            if (data.combineOrderDetails.length > 1) {
              str =
                String(data.seriesType).slice(-3) === '001' ? '串关' : '复式';
              str +=
                ' ' +
                formatSeriesType(
                  data?.seriesType,
                  data.combineOrderDetails.length
                );
            }
            break;
          case 'isSeriesType': //单关 串关
            str = data.seriesType === 1 ? '单关' : '串关';
            break;
          case 'tenantName': //商户名
            str = tenantObj[data.tenantId]?.tenantName ?? '';
            break;
          case 'tenantCode': //商户编码
            str = tenantObj[data.tenantId]?.name ?? '';
            break;
          default:
            str = data[column.prop as string];
        }
        arr.push(str);
      });
      return arr;
    });
    const titleList = [];
    columns.forEach(column => {
      titleList.push(column.label);
    });
    r.unshift(titleList);
    const workBook = utils.book_new();
    const workSheet = utils.aoa_to_sheet(r);
    workSheet['C1'].s = {
      wrapText: true
    };

    utils.book_append_sheet(workBook, workSheet, '数据报表');
    writeFile(workBook, '赛程_注单中心.xlsx');
    message(t('导出成功'), {
      type: 'success'
    });
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
            onSearch();
          }
          message(res.msg, { type: res.code ? 'error' : 'success' });
        });
      }
    });
  };
  const getStatus = (status:number, billStatus:number, betResult:number, isReserve?:number,riskStatus?:number) => {
    let obj = { status: -1, bgColor: '' };
    if(riskStatus===2){
      obj = { status: betStatus.PendingApprove, bgColor: '#F57582' }; //待审核
    }else if (
      status == 2 &&
      billStatus === 1 &&
      (betResult === 22 || betResult === 23)
    ) {
      // 注单无效
      obj = { status: betStatus.betInvalid, bgColor: '#E54752' };
    } else if (status === 1 && billStatus === 1 && betResult === 21) {
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
    } else if (status === 4 && billStatus === 1 && betResult === 61) {
      // 封控拒单
      obj = { status: betStatus.riskReject, bgColor: '#F88D48' };
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

  const specialCountFlag = (status:number, billStatus:number, betResult:number): boolean => {
    return (
      getStatus(status, billStatus, betResult)?.status ===
        betStatus.unsettlementBet ||
      getStatus(status, billStatus, betResult)?.status ===
        betStatus.settlementBet ||
      getStatus(status, billStatus, betResult)?.status ===
        betStatus.eventAbnormal
    );
  };

  const switchDialog = async (flag: boolean, row:any) => {
    UDialogFlag.value = flag;
    if (flag) {
      const r = await openPasswordInput();
      if (!r) return;
      handleEditResult(row);
    }
  };

  const editDialogRef = ref();
  const handleEditResult =( row:any) => {
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
            onSearch();
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

  const isShowCancel = (row)=>{
    let flag = true
    row.combineOrderDetails.map((item)=>{
      if(item.riskStatus===riskStatus.rejectBetting||item.riskStatus===riskStatus.reject||item.riskStatus===riskStatus.approve){
        flag = false
      }
    })
    return flag
  }

  //- 切换比赛类型
  onMounted(() => {
    onSearch();
    getTenantList();
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
    handleCancel,
    getStatus,
    copyTest,
    tenantObj,
    specialCountFlag,
    UDialogFlag,
    switchDialog,
    isShowCancel,
  };
}
