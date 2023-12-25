import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";
import { ElMessageBox } from "element-plus";
import { removeEmptyStringKeys } from "@/utils/utilFn";
import { $t, transformI18n } from "@/plugins/i18n";
import { usePublicHooks } from "@/hooks";
import dayjs from "dayjs";
import { FormProps } from "./type";

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
      label: "进球",
      slot: 'a',
      minWidth: 100,
    },
    {
      label: "进球时间",
      slot: 'eventTime',
      minWidth: 200,
    },
    {
      label: "比赛阶段",
      slot: 'matchPeriodId',
      minWidth: 200,
    },
    {
      label: "主/客",
      slot: 'homeAway',
      minWidth: 200,
    },
    {
      label: "t1",
      slot: 't1'
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

  const childTemp = {
    a: 1,
    eventTime: '',
    matchPeriodId: '',
    t1: '',
    t2: '',
  }

  const getChildRenData = async (row) => {
    const res = await API.getMatchEvents({
      matchId: row.matchId
    })
    row.childrenData = [];
    row.push(...res.data)
    childloading.value = false;
  }

  const addChildRow = (row: SaleDataAPI.PreSaleList, index: number) => {
    if (!row.childrenData.length) {
      row.childrenData.push(childTemp);
    } else {
      if (!Object.values(row.childrenData[(index ?? 1) - 1]).every(_ => _)) return message('请先完成上一个编辑', { type: "error" });
    }
  }

  const editChild = (row: SaleDataAPI.PreSaleList, index: number) => {

  }

  onMounted(() => {
    onSearch();
  });
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
    editChild
  };
}
