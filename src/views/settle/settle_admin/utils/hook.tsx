import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";
import { removeEmptyStringKeys } from "@/utils/utilFn";
import { $t, transformI18n } from "@/plugins/i18n";
import { usePublicHooks } from "@/hooks";
import dayjs from "dayjs";
export function useLeague() {
  const form = reactive({
    date: '',
    matchId: '',
    matchType: '',
    settleStatus: '',
    dataVendors: ''
  });
  const dataList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const loading = ref(true);
  const childloading = ref(true);
  const switchLoadMap = ref({});

  const balanceLoading = reactive<{ half: boolean, all: boolean }>({
    half: false, all: false
  });
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand",
      fixed: true
    },
    {
      label: transformI18n($t("settle.sn")),
      slot: "sn",
      width: 80,
      fixed: true,
    },
    {
      label: transformI18n($t("settle.league")),
      prop: "matchName",
      width: 280,
      fixed: true,
    },
    {
      label: transformI18n($t("settle.eventID")),
      prop: "matchId",
    },
    {
      label: transformI18n($t("settle.level")),
      prop: "level",
    },
    {
      label: transformI18n($t("settle.time")),
      prop: "beginTimeLong",
      minWidth: 200,
      formatter: ({ beginTimeLong }) => dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss')
    },

    {
      label: transformI18n($t("settle.homeTeam")),
      prop: "homeTeamId"
    },
    {
      label: transformI18n($t("settle.halfTime")),
      prop: "halfTime"
    },
    {
      label: transformI18n($t("settle.wholeTime")),
      prop: "wholeTime"
    },
    {
      label: transformI18n($t("settle.awayTeam")),
      prop: "awayTeamId"
    },
    {
      label: transformI18n($t("settle.auditor")),
      prop: "auditor",
      formatter: ({ auditor }) => auditor || '-'
    },
    {
      label: transformI18n($t("settle.trader")),
      prop: "trader",
      formatter: ({ trader }) => trader || '-'
    },
    {
      label: transformI18n($t("settle.status")),
      prop: "status",
      formatter: () => {
        return '-'
        // return JSON.parse(status ?? "").toString() || '-'
      }
    },
    {
      label: transformI18n($t("settle.peddingReview")),
      prop: "peddingReview",
      formatter: ({ peddingReview }) => peddingReview || '-'
    },
    {
      label: transformI18n($t("settle.eventDataSource")),
      prop: "eventDataSource",
      formatter: ({ eventDataSource }) => eventDataSource || '-'
    },
    {
      label: transformI18n($t("settle.confirming")),
      prop: "confirming",
      formatter: ({ confirming }) => confirming || '-'
    },
    {
      label: transformI18n($t("settle.unSettle")),
      prop: "unSettle",
      formatter: ({ unSettle }) => unSettle || '-'
    },
    {
      label: transformI18n($t("settle.abnormal")),
      prop: "abnormal",
      formatter: ({ abnormal }) => abnormal || '-'
    },
    {
      label: transformI18n($t("settle.secondSettle")),
      prop: "secondSettle",
      formatter: ({ secondSettle }) => secondSettle || '-'
    },
    {
      label: transformI18n($t("settle.settleStatus")),
      prop: "settleStatus",
      formatter: ({ settleStatus }) => settleStatus || '-'
    },
    {
      label: transformI18n($t("settle.operation")),
      prop: "operation",
      slot: 'operation',
      fixed: "right",
    },
  ];

  const childColumns: TableColumnList = [
    {
      label: "主队事件数量",
      slot: 't1',
      width: 120
    },
    {
      label: "客队事件数量",
      slot: 't2',
      width: 120
    },
    {
      label: "事件编码",
      slot: 'eventCode',
    },
    {
      label: "进球时间",
      slot: 'eventTime',
    },
    {
      label: "体育ID",
      slot: 'sportId',
      width: 150
    },
    {
      label: "比赛阶段",
      slot: 'matchPeriodId',
      width: 150
    },
    {
      label: "主/客队",
      slot: 'homeAway',
      width: 150
    },
    {
      label: "1号球员名称",
      slot: 'player1Name',
      width: 150
    },
    {
      label: "事件是否被取消",
      slot: 'canceled',
    },
    {
      label: "操作",
      slot: "operation",
    },
    {
      label: "结算次数",
      formatter: ({ }) => '-'
    },
    {
      label: "未结算",
      formatter: ({ }) => '-'
    },
    {
      label: "已结算",
      formatter: ({ }) => '-'
    },
    {
      label: "数据商事件",
      formatter: ({ }) => '-'
    }
  ];

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch()
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch(type?: string) {
    try {
      if (type === 'reload') pagination.currentPage = 1;
      loading.value = true;
      const data = removeEmptyStringKeys(form);
      const res: SaleDataAPI.PreSaleListRes = await API.getPreSaleList({
        ...data,
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: "error" });
      dataList.length = 0;
      dataList.push(...res.data.list);
      dataList.forEach(_ => _.childrenData = []);
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
    onSearch();
  };

  const dataVendorsChange = () => { }

  const addChildRow = (row: SaleDataAPI.PreSaleList) => {
    const tempList = {
      eventTime: '',
      homeAway: '',
      matchPeriodId: '',
      player1Name: '',
      isBackEndReturnData: false,
      t1: '',
      t2: '',
    }
    row.childrenData.push(tempList);
  }

  const editChild = (row: SattleDataAPI.MatchEventsList,) => {
    row.isEdit = true;
  }

  const getChildRenData = async (row, rowList) => {
    if (!rowList.some(r => r.matchId === row.matchId)) return;
    const res = await API.getMatchEvents({ matchId: row.matchId })
    childloading.value = false;
    res.data.forEach(_ => {
      _.isEdit = false
      _.matchId = row.matchId;
      _.isBackEndReturnData = true;
      _.canceled = Boolean(_.canceled);
    });
    row.childrenData.length = 0;
    row.childrenData.push(...res.data);
  }

  const handleChildrenData = async (row: SattleDataAPI.MatchEventsList, parentIndex: number, type: 'add' | 'edit') => {
    if (!row.isEdit) return;
    row.isBackEndReturnData = true;
    const requireDdata = {
      t1: row.t1,
      t2: row.t2,
      eventCode: row.eventCode,
      eventTime: row.eventTime,
      sportId: row.sportId,
      matchPeriodId: row.matchPeriodId,
      homeAway: row.homeAway,
      player1Name: row.player1Name,
    }
    if (!Object.values(requireDdata).every(_ => _)) return message('请输入完整的内容', { type: "error" })
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

    const r = await API.getMatchEvents({ matchId: dataList[parentIndex].matchId });
    const d = row.id ? r.data.find(_ => _.id === row.id) : r.data.pop();
    Object.assign(row, d);
    row.canceled = Boolean(row.canceled);
  }

  const settlementFunction = async (matchId: number, type: 'half' | 'all') => {
    try {
      balanceLoading[type] = true;
      let res;
      if (type === 'half') res = await API.firstHalfSettlement({ matchId })
      else res = await API.allSettlement({ matchId })
      message(res.msg, { type: res.code ? 'error' : 'success' })
      balanceLoading[type] = false;
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
    handleSizeChange,
    switchLoadMap,
    handleCurrentChange,
    handleSelectionChange,
    switchStyle,
    dataVendorsChange,
    childColumns,
    getChildRenData,
    addChildRow,
    editChild,
    balanceLoading,
    settlementFunction,
    handleChildrenData
  };
}
