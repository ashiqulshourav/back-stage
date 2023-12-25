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
      slot: 'addMatchEvent',
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
      loading.value = false
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

  const getChildRenData = async (row) => {
    const res = await API.getMatchEvents({
      matchId: row.matchId
    })
    childloading.value = false;
    res.data.forEach(_ => {
      _.isEdit = false
      _.matchId = row.matchId;
    });
    row.childrenData.push(...res.data)
  }

  const addChildRow = (row: SaleDataAPI.PreSaleList) => {
    const tempList = {
      eventTime: '',
      homeAway: '',
      matchPeriodId: '',
      player1Name: '',
      t1: '',
      t2: '',
    }
    if (!row.childrenData.length) {
      row.childrenData.push(tempList);
    } else {
      const d = Object.values(row.childrenData[row.childrenData.length - 1]);
      if (!d.every(_ => _)) {
        return message('请先完成上一个编辑', { type: "error" });
      }
      row.childrenData.push(tempList);
    }
  }

  const editChild = (row: SattleDataAPI.MatchEventsList,) => {
    row.isEdit = true;
  }

  const onHomeAwaySelectChange = (row, childIndex) => {

  }

  const saveData = async (row: SattleDataAPI.MatchEventsList, parentIndex) => {
    if (!Object.values(row).every(_ => _)) return message('数据不能为空', { type: "error" })
    row.isEdit = true;
    const params = {
      addMatchEvent: 0,
      eventCode: row.eventCode,
      eventTime: row.eventTime as Date,
      homeAway: row.homeAway,
      matchId: dataList[parentIndex].matchId,
      matchPeriodId: +row.matchPeriodId,
      player1Name: row.player1Name,
      remark: '',
      sourceType: 1,
      sportId: row.sportId,
      t1: +row.t1,
      t2: +row.t2,
    }
    childloading.value = true;
    const res = await API.addMatchEvent(params)
    childloading.value = false;
    if (res.code) return;

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
    onHomeAwaySelectChange,
    saveData
  };
}
