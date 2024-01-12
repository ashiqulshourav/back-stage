import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { t } from '@/plugins/i18n';
import { childColumns, columns } from './tableColumnList';
import { MatchEventType, SearchFormType, TempListType } from './type';

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

  const handleSelectionChange = val => {
    console.log('handleSelectionChange', val);
  };

  /** 搜索 */
  const onSearch = async (type?: 'reload', spoprtId?: number) => {
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
      !tableList[tableList.length - 1].player1Name /* ||
      tableList[tableList.length - 1].isEdit */
    ) {
      message('请先完成上一个事件添加', { type: 'error' });
    } else {
      const tempList: TempListType = {
        eventTime: null,
        homeAway: null,
        matchPeriodId: null,
        player1Name: null,
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

  const expandChange = (
    row: SaleDataAPI.PreSaleList,
    d: SaleDataAPI.PreSaleList[]
  ) => {
    expandMatchList.length = 0;
    expandRowList.length = 0;
    expandMatchList.push(...d.map(_ => _.matchId));
    expandRowList.push(...d);
    if (!d.some(item => item.matchId === row.matchId)) return;
    getChildrenData(row);
  };

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
          _.matchId = row.matchId;
          _.isBackEndReturnData = true;
          _.canceled = Boolean(_.canceled);
          item.type === 'yellow_red_card' && (_.redOrYellow = '红/黄牌');
        });
      }
    });
  };

  const removeItem = async (
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
  };

  const handleChildrenData = async (
    row: SattleDataAPI.MatchEventsList,
    parentIndex: number,
    type: 'add' | 'edit' | 'delete',
    parentRow,
    tableList?
  ) => {
    if (type === 'delete') {
      return removeItem(row.id, parentIndex, tableList);
    }
    if (!row.isEdit) return;
    const requireDdata = {
      t1: row.t1,
      t2: row.t2,
      eventCode: row.eventCode,
      eventTime: row.eventTime,
      sportId: currentSportId.value,
      matchPeriodId: row.matchPeriodId,
      homeAway: row.homeAway
      // player1Name: row.player1Name
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

    childloading.value = true;
    row.isEdit = true;

    const params: SattleDataAPI.MatchEventParams = {
      canceled: 0,
      eventCode: row.eventCode,
      eventTime: row.eventTime as Date,
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

    let res;
    if (type === 'add') {
      res = await API.addMatchEvent(params);
    } else {
      params.id = row.id;
      params.canceled = Number(row.canceled);
      res = await API.updateMatchEvent(params);
    }
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
    handleSelectionChange,
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
