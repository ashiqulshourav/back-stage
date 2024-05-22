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
  formatSeriesType, getIsInplay
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
    createTimeStart: dayjs().startOf('month').valueOf(),
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
  const selectReject = (flag: boolean, index: number, i:number) => {
    dataList[index].combineOrderDetails[i]['rejectSelected'] = flag;
  };
  const selectApprove = (flag:boolean, index:number, i:number) => {
    dataList[index].combineOrderDetails[i]['approveSelected'] = flag;
  };
  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
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
        for (let item in seriesTypesSingle) {
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
      const res: BetOrderAPI.BetOrderResType = await API.bettingAuditList({
        ...params,
        venueType
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      if (res.data !== null) {
        let list = res?.data?.pageData || [];
        console.log(222222,list)
        list = list.map((row:BetOrderAPI.BetOrderList,index:number) => {
          row.riskStatusArr = []
           row.index = index + 1;
          row.combineOrderDetails.map((item:BetOrderAPI.Detail) => {
            row.riskStatusArr?.push(item.riskStatus);
            item.rejectSelected = false;
            item.approveSelected = false;
          });
          return row;
        });
        console.log(33333,list)
        dataList.push(...list);
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
  }
  async function getRowByOrderId(orderId: string) {
    try {
      const params: searchFormType = formatParams(
        {
          export: false,
          orderId: orderId,
          pageNum:1,
        },

      ) as searchFormType;

      const res: BetOrderAPI.BetOrderResType = await API.bettingAuditList(
        params
      );
      if (res.code) return message(res.msg, { type: 'error' });
      if (res.data !== null) {
        let list = res?.data?.pageData || [];
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

  //- 导出excel表格
  const exportFile = async () => {
    const res: BetOrderAPI.BetOrderResType = await API.bettingAuditList(
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
            if (
              data.kindsCode?.includes('Outright') ||
              data.kindsCode?.includes('moutright')
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
          case 'status':
            // str=betStatusMap[getStatus(data.status,data.billStatus,data.betResult,data.isReserve)?.status]
            break;
          case 'settleScore':
            str = displayHomeAwayScore(data.settleScore, data.sportId);
            break;
          case 'betResult':
            str =
              BET_RESULT_TYPE_MAP[
                data.betResult as keyof typeof BET_RESULT_TYPE_MAP
              ];
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
          case 'riskStatus': //审核状态
            str = getRiskStatus(data.riskStatusArr).label;
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
    writeFile(workBook, '赛程_注单审核.xlsx');
    message(t('导出成功'), {
      type: 'success'
    });
  };
  const handleCancel = (row: any, index: number) => {
    let data = { ...row }; //...row.combineOrderDetails[index]
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
          onCloseDialog: () => {
            onSearch('reload');
            closeDialog(options, index);
          }
        })
    });
  };
  const handleApprove = (row: any, index: number) => {
    let data = { ...row }; //...row.combineOrderDetails[index]
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
    let obj = {};
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
    let obj = {};
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
      const r = await openPasswordInput();
      if (!r) {
        return;
      }
      API.bettingAuditConfirm(list).then(res => {
        onSearch();
        res.code === 0
          ? message(res.msg, { type: 'success' })
          : message(res.msg, { type: 'error' });
      });
    });
  };

  const getRiskStatus = (riskStatusArr: number[]) => {
    let obj = { label: '', bgColor: '' };
    if ( riskStatusArr.includes(riskStatus.approve)) {
      obj = { label: riskStatusMap[riskStatus.approve], bgColor: '#FFC53D' };
    } else if (riskStatusArr.includes(riskStatus.reject)) {
      obj = { label: riskStatusMap[riskStatus.reject], bgColor: '#F88D48' };
    } else if (riskStatus.rejectBetting) {
      obj = {
        label: riskStatusMap[riskStatus.rejectBetting],
        bgColor: '#F88D48'
      };
    } else if (riskStatusArr.includes(riskStatus.autoReject) ) {
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
          onCloseDialog: (value: string) => {
            closeDialog(options, index);
            getRowByOrderId(orderId);
            // onSearch();
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
    editMatchDetailRemark
  };
}
