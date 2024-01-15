import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { t } from '@/plugins/i18n';
import { childColumns, columns } from './tableColumnList';
import { MatchEventType, SearchFormType, TempListType } from './type';
import { dateGetSecond, dateSetSecond } from '@/utils/formmatDate';

export function useSettle() {
  const form = reactive<SearchFormType>({
    leagueId: '',
    matchId: '',
    status: '',
    startTime: '',
    endTime: ''
  });
  const dataList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const loading = ref(true);
  const childloading = ref(true);
  const switchLoadMap = ref({});
  const currentSportId = ref(1);
  const childDataTotal = ref(0);
  const expandMatchList = reactive<number[]>([]);
  const expandRowList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const loopTimer = ref<NodeJS.Timeout>();

  const balanceLoading = reactive<{ half: boolean; all: boolean }>({
    half: false,
    all: false
  });

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1
  });

  const handleTableWidthChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    onSearch();
  };

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    onSearch();
  };

  /** 搜索初始化 */
  const onSearch = async (type?: 'reload', spoprtId?: number) => {
    loopTimer.value && clearInterval(loopTimer.value);
    try {
      if (spoprtId) currentSportId.value = spoprtId;
      if (type === 'reload') pagination.currentPage = 1;
      loading.value = true;
      const data = removeEmptyStringKeys(form);
      const res: SattleDataAPI.getSettlementListRes =
        await API.getSettlementList({
          ...data,
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage,
          sportId: currentSportId.value
        });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      dataList.forEach(
        _ =>
          (_.childrenData = [
            {
              type: MatchEventType.Goal,
              key: 'matchScoreRecordList',
              tableList: []
            },
            {
              type: MatchEventType.YellowRedCard,
              key: 'penaltyCardRecordList',
              tableList: []
            },
            {
              type: MatchEventType.Corner,
              key: 'cornerRecordList',
              tableList: []
            }
          ])
      );
      pagination.total = res.data.total;
      pagination.pageSize = res.data.pageSize;
      pagination.currentPage = res.data.pageNum;
    } catch (error) {
      loading.value = false;
    }
  };

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch('reload');
  };

  const addChildRow = (tableList, type) => {
    if (
      tableList.length !== 0 &&
      !tableList[tableList.length - 1]?.isBackEndReturnData
    ) {
      message('请先完成上一个事件结算', { type: 'error' });
    } else {
      loopTimer.value && clearInterval(loopTimer.value);
      const tempList: TempListType = {
        eventTime: null,
        homeAway: null,
        matchPeriodId: null,
        isBackEndReturnData: false,
        t1: null,
        t2: null,
        eventCode: type
      };
      type === 'yellow_red_card' && (tempList.redOrYellow = 2);
      tableList.push(tempList);
    }
  };

  const editChild = (row: SattleDataAPI.MatchEventsList) => (row.isEdit = true);

  // 打开关闭结算列表
  const expandChange = (
    row: SaleDataAPI.PreSaleList,
    currentExpandList: SaleDataAPI.PreSaleList[]
  ) => {
    if (currentExpandList.length) {
      expandMatchList.length = 0;
      if (row) {
        expandMatchList.push(row.matchId);
        expandRowList.push(...currentExpandList);
      }
    } else {
      expandMatchList.length = 0;
    }
    if (!currentExpandList.some(item => item.matchId === row.matchId)) {
      if (loopTimer.value) clearInterval(loopTimer.value);
      return;
    }
    getChildrenData(row);
  };

  //- 获取当前展开行结算列表
  const getChildrenData = async row => {
    childloading.value = true;
    const res = await API.getMatchEvents({ matchId: row.matchId });
    childloading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    childDataTotal.value = 0;
    row.childrenData.forEach((item: SaleDataAPI.ChildrenDataList) => {
      item.tableList = res.data[item.key];
      childDataTotal.value += item.tableList.length;
      if (item.tableList.length) {
        item.tableList.forEach(_ => {
          _.isEdit = false;
          _.isSave = false;
          _.matchId = row.matchId;
          _.isBackEndReturnData = true;
          if (_.eventTime.toString().length < 10) {
            _.eventTime = dateSetSecond(_.eventTime as number);
          } else {
            const t =
              parseInt(new Date(_.eventTime).getTime() / 1000) -
              parseInt(new Date(row.beginTime).getTime() / 1000);
            _.eventTime = dateSetSecond(t);
          }
          _.canceled = Boolean(_.canceled);
          item.type === 'yellow_red_card' && (_.redOrYellow = '红/黄牌');
        });
      }
    });
    if (loopTimer.value) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => getChildrenData(row), 10000);
  };

  /*  const removeItem = async (
    id: number,
    parentIndex: number,
    tableList: SattleDataAPI.MatchEventsList[]
  ) => {
    if (!id) {
      tableList.pop();
    } else {
      const res = await API.deleteMatchEvent({ id });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      getChildrenData(dataList[parentIndex]);
    }
  }; */

  /* 新增事件  */
  const handleChildrenData = async (
    row: SattleDataAPI.MatchEventsList,
    parentIndex: number,
    type: 'save' | 'upload',
    parentRow
  ) => {
    const requireDdata = {
      t1: row.t1,
      t2: row.t2,
      eventCode: row.eventCode,
      eventTime: row.eventTime,
      sportId: currentSportId.value,
      matchPeriodId: row.matchPeriodId,
      homeAway: row.homeAway
    };
    delete row.isBackEndReturnData;
    if (
      !Object.keys(requireDdata).every(key => {
        if (key === 't1' || key === 't2') {
          return parseInt(requireDdata[key]) >= 0;
        } else {
          return requireDdata[key];
        }
      })
    )
      return message(t('请输入完整的内容'), { type: 'error' });

    if (type === 'save') {
      row.isSave = true;
      row.isEdit = false;
      return;
    }

    if ((type === 'upload' && !row.isSave) || row.isEdit) {
      return message(t('请先保存事件'), { type: 'error' });
    }

    childloading.value = true;

    const params: SattleDataAPI.MatchEventParams = {
      canceled: 0,
      eventCode: row.eventCode,
      eventTime: dateGetSecond(row.eventTime as Date),
      homeAway: row.homeAway,
      matchId: dataList[parentIndex].matchId,
      matchPeriodId: +row.matchPeriodId,
      player1Name: row.player1Name,
      dataSourceCode: 'SK',
      remark: '',
      sourceType: 1,
      sportId: currentSportId.value,
      t1: +row.t1,
      t2: +row.t2
    };

    const res = await API.addMatchEvent(params);
    childloading.value = false;
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (res.code) return;
    row.isEdit = false;
    getChildrenData(parentRow);
  };

  // 结算
  const settlementFunction = async (matchId: number, type: 'half' | 'all') => {
    try {
      balanceLoading[type] = true;
      const res = await API[
        type === 'half' ? 'firstHalfSettlement' : 'allSettlement'
      ]({ matchId });

      message(res.msg, { type: res.code ? 'error' : 'success' });
      balanceLoading[type] = false;
      await onSearch();
      const row = dataList.find(_ => _.matchId === matchId);
      getChildrenData(row);
    } catch (error) {
      balanceLoading[type] = false;
    }
  };

  onMounted(() => onSearch());

  onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  });

  const reloadTable = async () => {
    await onSearch('reload');
    expandRowList.forEach(async row => {
      await getChildrenData(row);
      dataList.forEach(d => {
        if (d.matchId === row.matchId) d.childrenData = row.childrenData;
      });
    });
  };

  return {
    form,
    loading,
    childloading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleTableWidthChange,
    switchLoadMap,
    expandChange,
    handleCurrentChange,
    childColumns,
    getChildrenData,
    addChildRow,
    editChild,
    currentSportId,
    balanceLoading,
    settlementFunction,
    handleChildrenData,
    childDataTotal,
    expandMatchList,
    reloadTable
  };
}
