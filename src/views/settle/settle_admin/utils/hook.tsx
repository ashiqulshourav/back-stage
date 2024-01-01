import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";
import { removeEmptyStringKeys } from "@/utils/utilFn";
import { t } from "@/plugins/i18n";
import { usePublicHooks } from "@/hooks";
import { childColumns, columns } from './tableColumnList'

export function useSettle() {
  const form = reactive({
    date: '',
    matchId: '',
    matchType: '',
    matchName: '',
    settleStatus: '',
    halfSettlementStatus: '',
    fullSettlementStatus: '',
    dataVendors: ''
  });
  const dataList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const loading = ref(true);
  const childloading = ref(true);
  const switchLoadMap = ref({});
  const currentSportId = ref(1);
  const redOrYellow = ref(2);
  const childDataTotal = ref(0);

  const balanceLoading = reactive<{ half: boolean, all: boolean }>({
    half: false, all: false
  });
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
  });


  const handleTableWidthChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    onSearch();
  }

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    onSearch()
  }

  const handleSelectionChange = (val) => {
    console.log("handleSelectionChange", val);
  }

  const onSearch = async (type?: string, spoprtId?: number) => {
    try {
      if (spoprtId) currentSportId.value = spoprtId;
      if (type === 'reload') pagination.currentPage = 1;
      loading.value = true;
      const data = removeEmptyStringKeys(form);
      const res: SaleDataAPI.PreSaleListRes = await API.getPreSaleList({
        ...data,
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage,
        sportId: currentSportId.value
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: "error" });
      dataList.length = 0;
      dataList.push(...res.data.list);
      dataList.forEach(_ => _.childrenData = [
        { type: 'goal', key: 'matchScoreRecordList', tableList: [] },
        { type: 'yellow_red_card', key: 'penaltyCardRecordList', tableList: [] },
        { type: 'corner', key: 'cornerRecordList', tableList: [] },
        // { type: 'yellow_card', value: '其他事件记录列表', key: 'allOtherList', tableList: [] },
      ]);
      pagination.total = res.data.total;
      pagination.pageSize = res.data.pageSize;
      pagination.currentPage = res.data.pageNum;
    } catch (error) {
      loading.value = false
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch('reload');
  };

  const addChildRow = (tableList, type) => {
    if (tableList.length !== 0 && !tableList[tableList.length - 1].player1Name) {
      message('请先完成上一个事件添加', { type: 'error' })
    } else {
      const tempList = {
        eventTime: null,
        homeAway: null,
        matchPeriodId: null,
        player1Name: null,
        isBackEndReturnData: false,
        t1: null,
        t2: null,
        eventCode: type
      }
      tableList.push(tempList);
    }
  }

  const editChild = (row: SattleDataAPI.MatchEventsList,) => {
    row.isEdit = true;
  }

  const expandChange = (row, d) => {
    if (!d.some(item => item.matchId === row.matchId)) return;
    getChildRenData(row);
  }

  const getChildRenData = async (row) => {
    childloading.value = true;
    const res = await API.getMatchEvents({ matchId: row.matchId })
    childloading.value = false;
    if (res.code) return message(res.msg, { type: 'error' })
    childDataTotal.value = 0;
    row.childrenData.forEach((item: SaleDataAPI.ChildrenDataList) => {
      item.tableList = res.data[item.key]
      childDataTotal.value += item.tableList.length;
      if (item.tableList.length) {
        item.tableList.forEach(_ => {
          _.isEdit = false
          _.matchId = row.matchId;
          _.isBackEndReturnData = true;
          _.canceled = Boolean(_.canceled);
        })
      }
    })
  }

  const removeItem = async (id: number, parentIndex: number, tableList: SattleDataAPI.MatchEventsList[]) => {
    if (!id) {
      tableList.pop()
    } else {
      const res = await API.deleteMatchEvent({ id })
      message(res.msg, { type: res.code ? 'error' : 'success' })
      if (res.code) return
      getChildRenData(dataList[parentIndex]);
    }
  }

  const handleChildrenData = async (row: SattleDataAPI.MatchEventsList, parentIndex: number, type: 'add' | 'edit' | 'delete', parentRow, tableList?) => {
    if (type === 'delete') {
      return removeItem(row.id, parentIndex, tableList);
    }
    if (!row.isEdit) return;
    const requireDdata = {
      t1: row.t1,
      t2: row.t2,
      eventCode: row.eventCode,
      eventTime: row.eventTime,
      sportId: 1,// row.sportId,
      matchPeriodId: row.matchPeriodId,
      homeAway: row.homeAway,
      player1Name: row.player1Name,
    }
    if (!Object.keys(requireDdata).every(key => {
      if (key === 't1' || key === 't2') {
        return parseInt(requireDdata[key]) >= 0
      } else {
        return requireDdata[key]
      }
    })) return message(t('请输入完整的内容'), { type: "error" })

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
      dataSourceCode: "SK",
      remark: '',
      sourceType: 1,
      sportId: row.sportId,
      t1: +row.t1,
      t2: +row.t2,
    }

    let res;
    if (type === 'add') {
      res = await API.addMatchEvent(params)
    } else {
      params.id = row.id;
      params.canceled = Number(row.canceled);
      res = await API.updateMatchEvent(params)
    }
    childloading.value = false;
    message(res.msg, { type: res.code ? 'error' : "success" });
    if (res.code) return;
    row.isEdit = false;
    getChildRenData(parentRow)
  }

  // 结算
  const settlementFunction = async (matchId: number, type: 'half' | 'all') => {
    try {
      balanceLoading[type] = true;
      let res;
      if (type === 'half') res = await API.firstHalfSettlement({ matchId })
      else res = await API.allSettlement({ matchId })
      message(res.msg, { type: res.code ? 'error' : 'success' })
      balanceLoading[type] = false;
      onSearch();
    } catch (error) {
      balanceLoading[type] = false;
    }
  }

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
    switchStyle,
    childColumns,
    getChildRenData,
    addChildRow,
    editChild,
    currentSportId,
    balanceLoading,
    settlementFunction,
    handleChildrenData,
    redOrYellow,
    childDataTotal
  };
}
