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
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import RejctDialogForm from '../component/RejctDialogForm.vue';
import {
  Detail,
  getBetTeamType,
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
import { addDialog, closeDialog } from '@/components/ReDialog/index';
import { useRiskNoticeStore } from '@/store/riskNotice';

export function useManualOrderRejectionHook() {
  const riskNoticeStore = useRiskNoticeStore();
  const dataList = reactive<BetOrderAPI.BetOrderList[]>([]);
  const tenantList = reactive<any>([]);
  const tenantObj = reactive<any>({});
  const loading = ref(true);
  const totalInfo = reactive<BetOrderAPI.otherDataType>(
    {} as BetOrderAPI.otherDataType
  );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100, 200],
    background: true
  });
  const form = reactive<searchFormType>({
    tenantIds: [],
    queryType: 0,
    leagueId: '',
    leagueName: '',
    matchId: '',
    homeTeamName: '',
    awayTeamName: '',
    sportId: '',
    userIdOrName: '',
    timeStart: dayjs().subtract(30, 'day').startOf('day').valueOf(),
    timeEnd: dayjs().endOf('day').valueOf(),
    orderId: '',
    status: [],
    isInplay: '',
    seriesType: '',
    category: '',
    timeType: 1,
    seriesDetailsSingle: [],
    seriesDetailsDuplex: []
  });
  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      // 对于串关类型的选择处理
      let seriesDetails: any = [];
      if (form.seriesType == 2) {
        if (form.seriesDetailsSingle.length) {
          form.seriesDetailsSingle.map((item: any) => {
            seriesDetails.push(...seriesTypesSingle[item].list);
          });
        } else {
          for (const item in seriesTypesSingle) {
            seriesDetails.push(...seriesTypesSingle[item].list);
          }
        }
      } else if (form.seriesType == 3) {
        if (form.seriesDetailsDuplex.length) {
          form.seriesDetailsDuplex.map((item: any) => {
            seriesDetails.push(...seriesTypesDuplex[item].list);
          });
        } else {
          for (const item in seriesTypesDuplex) {
            seriesDetails.push(...seriesTypesDuplex[item].list);
          }
        }
      } else {
        seriesDetails = '';
      }
      if (seriesDetails.length > 1) {
        seriesDetails = [...new Set(seriesDetails)];
      }

      const res: BetOrderAPI.BetOrderResType = await API.betcenterRisk({
        ...removeEmptyStringKeys({
          ...form,
          seriesDetailsSingle: '',
          seriesDetailsDuplex: '',
          seriesDetails: seriesDetails,
          seriesType: +form.seriesType > 2 ? 2 : form.seriesType
        }),
        // status: form.status?.length ? form.status : [2, 3, 4, 5, 6, 7, 8],
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      } as any);
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      if (res.data !== null) {
        dataList.push(...res.data.pageData);
        dataList.map((item: any, index) => {
          item.index = index + 1;
        });
        pagination.total = res.data.count;
        Object.assign(totalInfo, res.data.otherData);
      }
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  }

  const exportFileTest = async () => {
    loading.value = true;
    // 对于串关类型的选择处理
    let seriesDetails: any = [];
    if (form.seriesType == 2) {
      if (form.seriesDetailsSingle.length) {
        form.seriesDetailsSingle.map((item: any) => {
          seriesDetails.push(...seriesTypesSingle[item].list);
        });
      } else {
        for (const item in seriesTypesSingle) {
          seriesDetails.push(...seriesTypesSingle[item].list);
        }
      }
    } else if (form.seriesType == 3) {
      if (form.seriesDetailsDuplex.length) {
        form.seriesDetailsDuplex.map((item: any) => {
          seriesDetails.push(...seriesTypesDuplex[item].list);
        });
      } else {
        for (const item in seriesTypesDuplex) {
          seriesDetails.push(...seriesTypesDuplex[item].list);
        }
      }
    } else {
      seriesDetails = '';
    }
    if (seriesDetails.length > 1) {
      seriesDetails = [...new Set(seriesDetails)];
    }
    const res: BetOrderAPI.BetOrderResType = await API.riskExport({
      ...removeEmptyStringKeys({
        ...form,
        seriesDetailsSingle: '',
        seriesDetailsDuplex: '',
        seriesDetails: seriesDetails,
        seriesType: +form.seriesType > 2 ? 2 : form.seriesType
      }),
      pageSize: 1,
      pageNum: 50000,
      export: true
    } as any);
    message(res.msg, { type: res.code ? 'error' : 'success' });
    loading.value = false;
  };

  const getTenantList1 = async () => {
    const res = await API.getTenantList();
    if (res.data?.data?.length) {
      tenantList.push(...res.data.data);
      // 将数组根据id转换为对象
      tenantList.map(item => {
        tenantObj[item.id] = item;
      });
    }
  };

  //- 导出excel表格
  /*   const exportFile = async () => {
    // 对于串关类型的选择处理
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

    const res: BetOrderAPI.BetOrderResType = await API.bettingCenterList({
      ...removeEmptyStringKeys({
        ...form,
        seriesDetailsSingle: '',
        seriesDetailsDuplex: '',
        seriesDetails: seriesDetails,
        seriesType: +form.seriesType > 2 ? 2 : form.seriesType
      }),
      status: form.status?.length ? form.status : [2, 3, 4, 5, 6, 7, 8],
      pageNum: 1,
      pageSize: 10000
    } as any);
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
              ? dayjs(data[column.prop]).format('YYYY-MM-DD HH:mm:ss')
              : '-';
            break;
          case 'createTime':
            str = data.createTime
              ? dayjs(data[column.prop]).format('YYYY-MM-DD HH:mm:ss')
              : '-';
            break;
          case 'settleTime':
            str = data.settleTime
              ? dayjs(data[column.prop]).format('YYYY-MM-DD HH:mm:ss')
              : '-';
            break;
          case 'index':
            str = (i + 1).toString();
            break;
          case 'playType':
            str = useSportFormatDetail(data)[4];
            break;
          case 'betName':
            str = getBetTeamType(data || ({} as Detail));
            break;
          case 'teamName':
            str = `${data.homeTeamNameCn} vs ${data.awayTeamNameCn}`;
            break;
          case 'marketType':
            str = markeTypeMap[data.marketType];
            break;
          case 'isSettlementAgain':
            str = data.isSettlementAgain === 1 ? '是' : '否';
            break;
          case 'status':
            str =
              betStatusMap[
                getStatus(data.status, data.billStatus, data.betResult)?.status
              ];
            break;
          case 'billStatus':
            str =
              betStatusMap[
                getStatus(data.status, data.billStatus, data.betResult)?.status
              ];
            break;
          case 'settleScore':
            str = displayHomeAwayScore(data.settleScore, data.sportId);
            break;
          case 'betResult':
            str = BET_RESULT_TYPE_MAP[data.betResult];
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
          case 'tenantName': //单关 串关
            str = tenantObj[data.tenantId].name ?? '';
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
  }; */

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const handleCancel = (data: any) => {
    return new Promise<boolean>((resolve, reject) => {
      ElMessageBox.confirm(t('确定取消注单吗？'), t('警告'), {
        center: true,
        type: 'warning'
      })
        .then(async () => {
          const { openPasswordInput } = usePasswordInputHook();
          const r = await openPasswordInput();
          if (!r) return;
          const params: any = { orderIds: [data.id] };
          const res = await API.orderCancel(params);
          if (res.code) {
            reject();
          } else {
            resolve(true);
            onSearch();
          }
          message(res.msg, { type: res.code ? 'error' : 'success' });
        })
        .catch(reject);
    });
  };

  /*   const getStatus = (status, billStatus, betResult) => {
    let obj = { status: -1, bgColor: '' };
    if (status === 0 && billStatus === 0) {
      // 未结算
      obj = { status: betStatus.unsettlementBet, bgColor: '#FFC53D' };
    } else if (status === 1 && billStatus === 1) {
      // 已结算
      obj = { status: betStatus.settlementBet, bgColor: '#40A9FF' };
    } else if (status === 0) {
      // 确认中
      obj = { status: betStatus.confirm, bgColor: '#FFC53D' };
    } else if (status === 6) {
      // 待审核
      obj = { status: betStatus.PendingApprove, bgColor: '#F88D48' };
    } else if (status == 2) {
      // 注单无效
      obj = { status: betStatus.betInvalid, bgColor: '#E54752' };
    } else if (status === 4) {
      // 投注失败
      obj = { status: betStatus.betFail, bgColor: '#F57582' };
    } else if (status === 5) {
      // 赛事异常
      obj = { status: betStatus.eventAbnormal, bgColor: '#F88D48' };
    } else if (
      status === 1 &&
      billStatus === 1 &&
      (betResult === 21 || betResult === 22)
    ) {
      // 预约失败
      obj = { status: betStatus.reserveFail, bgColor: '#F57582' };
    }
    return obj;
  }; */

  const getBackgroundColor = (billStatus: number) => {
    const obj = { bgColor: '' };

    if (billStatus === 0) {
      obj.bgColor = '#FFC53D';
    } else if (billStatus === 1) {
      obj.bgColor = '#E54752';
    } else {
      obj.bgColor = '';
    }
    return obj;
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

  //- 风控拒单
  const refuseBetClick = detailId => {
    addDialog({
      title: t('警告'),
      width: '15%',
      closeOnClickModal: false,
      center: true,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(RejctDialogForm, {
          detailId,
          onCloseDialog: async (type?: 'reload') => {
            closeDialog(options, index);
            if (type) {
              onSearch();
              await riskNoticeStore.setRiskNotice();
            }
          }
        })
    });
  };

  //- 确认注单
  const confirmBetClick = async detailId => {
    ElMessageBox.confirm(`${t('是否确定当前注单么?')} `, '警告', {
      center: true
    }).then(async () => {
      const res = await API.riskConfirm([{ detailId, status: 1 }]);
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) {
        onSearch();
        await riskNoticeStore.setRiskNotice();
      }
    });
  };

  //- 切换比赛类型
  onMounted(() => {
    getTenantList1();
    onSearch();
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
    exportFileTest,
    // exportFile,
    handleCancel,
    // getStatus,
    copyTest,
    confirmBetClick,
    refuseBetClick,
    tenantObj,
    getBackgroundColor
  };
}
