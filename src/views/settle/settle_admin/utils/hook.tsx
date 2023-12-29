import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";
import { removeEmptyStringKeys } from "@/utils/utilFn";
import { t } from "@/plugins/i18n";
import { usePublicHooks } from "@/hooks";
import dayjs from "dayjs";
import { getColumnWidth } from "@/utils/getTableWidth";

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

  const balanceLoading = reactive<{ half: boolean, all: boolean }>({
    half: false, all: false
  });
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
  });

  const handleSize = (d, label: string) => {
    if (d.column.width) return label;
    d.column.width = getColumnWidth(d.column.label);
  }

  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand",
      fixed: true
    },
    {
      label: t('序号'),
      fixed: true,
      slot: "sn",
      headerRenderer: (d) => handleSize(d, t('序号'))
    },
    {
      prop: "matchName",
      label: t('赛事名称'),
      fixed: true,
      align: 'left',
      headerRenderer: (d) => handleSize(d, t('赛事名称'))
    },
    {
      label: t("赛事ID"),
      prop: "matchId",
      headerRenderer: (d) => handleSize(d, t('赛事ID'))
    },
    {
      label: t("赛事等级"),
      prop: "level",
      headerRenderer: (d) => handleSize(d, t('赛事等级'))
    },
    {
      label: t("比赛时间"),
      prop: "beginTimeLong",
      formatter: ({ beginTimeLong }) => dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss'),
      headerRenderer: (d) => handleSize(d, t('比赛时间'))
    },

    {
      label: t("主队"),
      prop: "homeTeamNameCn",
      formatter: ({ homeTeamNameCn }) => homeTeamNameCn ?? '-',
      headerRenderer: (d) => handleSize(d, t('主队'))
    },
    {
      label: t("半场"),
      prop: "halfTime",
      formatter: ({ halfTime }) => halfTime ?? '-',
      headerRenderer: (d) => handleSize(d, t('半场'))
    },
    {
      label: t("全场"),
      prop: "wholeTime",
      formatter: ({ wholeTime }) => wholeTime ?? '-',
      headerRenderer: (d) => handleSize(d, t('全场'))
    },
    {
      label: t("客队"),
      prop: "awayTeamNameCn",
      align: 'left',
      headerRenderer: (d) => handleSize(d, t('客队'))
    },
    {
      label: t("审核员"),
      prop: "auditor",
      formatter: ({ auditor }) => auditor || '-',
      headerRenderer: (d) => handleSize(d, t('审核员'))
    },
    {
      label: t("操盘手"),
      prop: "trader",
      formatter: ({ trader }) => trader || '-',
      headerRenderer: (d) => handleSize(d, t('操盘手'))
    },
    {
      label: t("比赛状态"),
      prop: "status",
      formatter: ({ status }) => status ?? '-',
      headerRenderer: (d) => handleSize(d, t('比赛状态'))
    },
    {
      label: t("待审核"),
      prop: "peddingReview",
      formatter: ({ peddingReview }) => peddingReview || '-',
      headerRenderer: (d) => handleSize(d, t('待审核'))
    },
    {
      label: t("赛事数据源"),
      prop: "eventDataSource",
      formatter: ({ eventDataSource }) => eventDataSource || '-',
      headerRenderer: (d) => handleSize(d, t('赛事数据源'))
    },
    {
      label: t("确认中"),
      prop: "confirming",
      formatter: ({ confirming }) => confirming || '-',
      headerRenderer: (d) => handleSize(d, t('确认中'))
    },
    {
      label: t("上半场结算"),
      prop: "halfSettlementStatus",
      formatter: ({ halfSettlementStatus }) => halfSettlementStatus === 0 ? t('未结算') : <el-text type="danger">{t('已结算')}</el-text>,
      headerRenderer: (d) => handleSize(d, t('上半场结算'))
    },

    {
      label: t("全场结算"),
      prop: "fullSettlementStatus",
      formatter: ({ fullSettlementStatus }) => fullSettlementStatus === 0 ? t('未结算') : <el-text type="danger">{t('已结算')}</el-text>,
      headerRenderer: (d) => handleSize(d, t('全场结算'))
    },
    {
      label: t("异常"),
      prop: "abnormal",
      formatter: ({ abnormal }) => abnormal || '-',
      headerRenderer: (d) => handleSize(d, t('异常'))
    },
    // {
    //   label: t("结算状态"),
    //   prop: "settleStatus",
    //   formatter: ({ settleStatus }) => settleStatus || '-'
    // },
    /* {
      label: t("操作"),
      prop: "operation",
      slot: 'operation',
      fixed: "right",
    }, */
  ];

  const childColumns: TableColumnList = [
    {
      label: t("主队事件数量"),
      slot: 't1',
      headerRenderer: (d) => handleSize(d, t('主队事件数量')),
    },
    {
      label: t("客队事件数量"),
      slot: 't2',
      headerRenderer: (d) => handleSize(d, t('客队事件数量'))
    },
    {
      label: t("事件编码"),
      slot: 'eventCode',
      headerRenderer: (d) => handleSize(d, t('事件编码'))
    },
    {
      label: t("进球时间"),
      slot: 'eventTime',
      headerRenderer: (d) => handleSize(d, t('进球时间'))
    },
    /*  {
       label: t("体育ID"),
       slot: 'sportId',
       width: 150
     }, */
    {
      label: t("比赛阶段"),
      slot: 'matchPeriodId',
      headerRenderer: (d) => handleSize(d, t('比赛阶段'))
    },
    {
      label: t("主/客队"),
      slot: 'homeAway',
      headerRenderer: (d) => handleSize(d, t('主/客队'))
    },
    {
      label: t("1号球员名称"),
      slot: 'player1Name',
      headerRenderer: (d) => handleSize(d, t('1号球员名称'))
    },
    {
      label: t("事件是否被取消"),
      slot: 'canceled',
      headerRenderer: (d) => handleSize(d, t('事件是否被取消'))
    },
    {
      label: t("操作"),
      slot: "operation",
      headerRenderer: (d) => handleSize(d, t('操作'))
    },
    {
      label: t("结算次数"),
      formatter: ({ }) => '-',
      headerRenderer: (d) => handleSize(d, t('结算次数'))
    },
    /* {
      label: t("未结算"),
      formatter: ({ }) => '-'
    },
    {
      label: t("已结算"),
      formatter: ({ }) => '-'
    }, */
    {
      label: t("数据商事件"),
      formatter: ({ }) => '-',
      headerRenderer: (d) => handleSize(d, t('数据商事件'))
    }
  ];

  function handleSizeChange(pageSize: number) {
    pagination.pageSize = pageSize;
    onSearch();
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
    onSearch('reload');
  };


  const addChildRow = (row: SaleDataAPI.PreSaleList) => {
    const tempList = {
      eventTime: null,
      homeAway: null,
      matchPeriodId: null,
      player1Name: null,
      isBackEndReturnData: false,
      t1: null,
      t2: null,
    }
    row.childrenData.push(tempList);
  }

  const editChild = (row: SattleDataAPI.MatchEventsList,) => {
    row.isEdit = true;
  }

  const getChildRenData = async (row) => {
    if (row.childrenData.length) return;
    childloading.value = true;
    const res = await API.getMatchEvents({ matchId: row.matchId })
    childloading.value = false;
    res.data.forEach(_ => {
      _.isEdit = false
      _.matchId = row.matchId;
      _.isBackEndReturnData = true;
      _.canceled = Boolean(_.canceled);
    });
    row.childrenData.push(...res.data);
  }

  const handleChildrenData = async (row: SattleDataAPI.MatchEventsList, parentIndex: number, type: 'add' | 'edit') => {
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
    })) return message('请输入完整的内容', { type: "error" })

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
      sportId: 1, // row.sportId,
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
    row.isBackEndReturnData = true;
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
    childColumns,
    getChildRenData,
    addChildRow,
    editChild,
    balanceLoading,
    settlementFunction,
    handleChildrenData,
  };
}
