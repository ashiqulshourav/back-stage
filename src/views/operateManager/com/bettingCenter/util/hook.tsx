import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import type { FormInstance } from 'element-plus';
import {
  betStatus,
  betStatusMap,
  riskStatusMap,
  searchFormType,
  seriesTypesSingle,
  seriesTypesDuplex,

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
  formatSeriesType, getIsInplay
} from '@/utils/formatMatch';
import dayjs from 'dayjs';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { ElMessageBox } from 'element-plus';
import { copyTextToClipboard } from '@pureadmin/utils';
import { t } from '@/plugins/i18n';
import { riskStatus } from '../util/types';
import editOrder from '../component/editOrder.vue';
export function useBettingCenterHook(category: number, venueType: number) {
  const { openPasswordInput } = usePasswordInputHook();
  const dataList = reactive<BetOrderAPI.BetOrderList[]>([]);
  const tenantList = reactive<
    { name: string; id: number; tenantName: string }[]
  >([]);
  const tenantObj = reactive<any>({});
  const riskLabelList = reactive<UserAPI.labelType[]>([]);
  const UDialogFlag = ref<Boolean>(false);
  const loading = ref(true);
  const downloading = ref(false)
  const totalInfo = reactive<BetOrderAPI.otherDataType>(
    {} as BetOrderAPI.otherDataType
  );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    pageSizes: [20, 50, 100, 200, 500],
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
    riskStatus:'',
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
        orderId:orderId,
        pageNum:1
      }) as searchFormType;
      const res: BetOrderAPI.BetOrderResType = await API.bettingCenterList(
        params
      );
      if (res.code) return message(res.msg, { type: 'error' });
      if (res.data !== null) {
        let list = res?.data?.pageData || [];
        list = list.map((row:BetOrderAPI.BetOrderList) => {
          row.riskStatusArr = [];
          row.combineOrderDetails.map((item2:BetOrderAPI.Detail) => {
            row.riskStatusArr?.push(item2.riskStatus)
          });
          return row;
        });

        dataList.map((item: any) => {
          if(item.id === orderId){
            Object.assign(item, list[0])
          }
        });
      }
    } catch (error) {
      loading.value = false;
    }
  }

  async function onSearch(type?: string) {
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
        let list = res?.data?.pageData || [];
        list = list.map((row:BetOrderAPI.BetOrderList,index:number) => {
          row.riskStatusArr = [];
          row.betResultArr = [];
          row.index = index + 1;
          row.combineOrderDetails.map((item2:BetOrderAPI.Detail) => {
            row.riskStatusArr?.push(item2.riskStatus)
            row.betResultArr.push (item2.betResult)
          });
          return row;
        });
        dataList.push(...list);
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

  //- 导出excel表格
  const exportFile = async (flag) => {
    downloading.value = true;
    message(t('导出报表开始'), { type: 'warning' });
    const res: BetOrderAPI.BetOrderResType = await API.bettingCenterList(
      formatParams({
        pageNum: 1,
        pageSize: 50000,
        export: true
      }) as searchFormType
    );
    let list = [];
    if(flag==='risk'){
      res.data.pageData.map((item)=>{
        item?.combineOrderDetails.map((match)=>{
          list.push({...item,...match})
        })
      })
    }else{
      res.data.pageData.map((item)=>{
        list.push({...item,...item?.combineOrderDetails[0]})
      })
    }

    const r = list.map((item: any, i) => {
      const arr: any[] = [];
      const data = { ...item };
      data.combineOrderDetails.map((item2:BetOrderAPI.Detail) => {
        data.riskStatusArr=[];
        data.betResultArr=[]
        data.riskStatusArr?.push(item2.riskStatus)
        data.betResultArr.push (item2.betResult)
      });

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
            if (
              data.kindsCodes?.includes('Outright') ||
              data.kindsCodes?.includes('moutright')
            ) {
              str = '冠军赛事';
            } else {
              str = `${data.homeTeamNameCn} vs ${data.awayTeamNameCn}`;
            }
            break;
          case 'marketType':
            str = markeTypeMap[data.marketType as keyof typeof markeTypeMap];
            break;
          case 'isSettlementAgain':
            str = data.isSettlementAgain === 2 ? '是' : '否';
            break;
          case 'settleStatus':
            str =
              betStatusMap[
                getStatus(
                  data.status,
                  data.billStatus,
                  data.betResultArr,
                  data.isReserve,
                  data.riskStatusArr,
                  data.isSpecialSettle
                )?.status as keyof typeof betStatusMap
              ];
            break;
          case 'riskStatus':
              str = data.riskStatus===0?'-':riskStatusMap[data.riskStatus as keyof typeof riskStatusMap];
              break;
          case 'settleScore':
            str = displayHomeAwayScore(data.settleScore, data.sportId);
            break;
          case 'betResult':
            str = getOddStatus(data.betResult, data.riskStatus);
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
          case 'betStage': //投注阶段
            str = getIsInplay(data.isInplay);
            break;
          default:
            str = data[column.prop as string];
        }
        arr.push(str);
      });
      return arr;
    });
    const titleList: string[] = [];
    columns.forEach((column: { label: string }) => {
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
    message(t('导出成功'), { type: 'success' });
    downloading.value = false;
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
            // onSearch();
            getRowByOrderId(data.id);
          }
          message(res.msg, { type: res.code ? 'error' : 'success' });
        });
      }
    });
  };

  const getRiskStatusColor = (
    riskStatus: number,
  ) => {
    let obj = {bgColor: ''};
    if(riskStatus === 2){
      obj.bgColor = '#FFC53D';
    } else if(riskStatus === 103 || riskStatus === 104){
      obj.bgColor = '#40A9FF';
    } else if(riskStatus === 203 || riskStatus === 204){
      obj.bgColor = '#F57582';
    } else{
      obj.bgColor = '';
    }
    return obj;
  }

  const getStatus = (
    status: number,
    billStatus: number,
    betResultArr: number[],
    isReserve: number,
    riskStatusArr: number[],
    isSpecialSettle: number
  ) => {
    let obj = { status: -1, bgColor: '' };
    if (isSpecialSettle === 1){
      // 特殊结算也算已结算
      obj = { status: betStatus.settlementBet, bgColor: '#40A9FF' };
    }else if(riskStatusArr?.includes( betStatus.PendingApprove)&&isSpecialSettle===0){
      // 待审核
      obj = { status: betStatus.PendingApprove, bgColor: '#F57582' };
    }else if (status===2&&billStatus===1&&isReserve===2&&(betResultArr?.includes(22)||betResultArr?.includes(23)) || riskStatusArr?.includes(riskStatus.autoReject)||riskStatusArr?.includes(riskStatus.handleReject) ){
      // 注单无效
      obj = { status: betStatus.betInvalid, bgColor: '#F57582' };
    }else if (status === 2 && billStatus === 1 && betResultArr?.includes(21)){
      // 预约失败
      obj = { status: betStatus.reserveFail, bgColor: '#F57582' };
    }else if(status===2&&billStatus==1&&isReserve==1&&betResultArr?.includes(22)){
      // 预约取消
      obj = { status: betStatus.reverseCancel, bgColor: '#F57582' };
    } else if (status === 0 && billStatus === 0&&isReserve === 1&&!( betResultArr?.includes(21)|| betResultArr?.includes(22) )) {
      // 预约中
      obj = { status: betStatus.onReverse, bgColor: '#F57582' };
    } else if (status === 5||betResultArr?.includes(18)) {
      // 赛事异常
      obj = { status: betStatus.eventAbnormal, bgColor: '#F88D48' };
    }else if(status === 0 && billStatus === 0&&isReserve === 2){
      // 未结算
      obj = { status: betStatus.unsettlementBet, bgColor: '#FFC53D' };
    } else if (status === 1 && billStatus === 1) {
      // 已结算
      obj = { status: betStatus.settlementBet, bgColor: '#40A9FF' };
    }
    return obj;
  };

  const getOddStatus = (betResult:number,riskSt:number) => {
    // return BET_RESULT_TYPE_MAP[betResult as keyof typeof BET_RESULT_TYPE_MAP] || ''
   if (riskSt === riskStatus.autoReject || riskSt === riskStatus.handleReject) {
      return t('注单无效');
    }else {
      return BET_RESULT_TYPE_MAP[betResult as keyof typeof BET_RESULT_TYPE_MAP] || ''
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
            // onSearch();
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
        item.riskStatus === riskStatus.waitingApprove ||
        item.riskStatus === riskStatus.autoApprove ||
        item.riskStatus === riskStatus.handelApprove ||
        item.riskStatus === riskStatus.autoReject ||
        item.riskStatus === riskStatus.handleReject
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
    getRiskStatusColor,
  };
}
