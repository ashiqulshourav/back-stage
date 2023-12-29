import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";
import { ElMessageBox } from "element-plus";
import { removeEmptyStringKeys } from "@/utils/utilFn";
import { t } from "@/plugins/i18n";
import { usePublicHooks } from "@/hooks";
import dayjs from "dayjs";
import { handleTableWidth } from "@/utils/getTableWidth";

export function useLeague() {
  const form = reactive({
    matchId: '',
    matchName: '',
    isSale: '',
    beginTime: '',
  });
  const dataList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const loading = ref(true);
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
      label: t("赛事ID"),
      prop: "matchId",
      headerRenderer: (d) => handleTableWidth(d, t('赛事ID'), 'auto')
    },
    {
      label: t('赛事名称'),
      prop: "matchName",
      headerRenderer: (d) => handleTableWidth(d, t('赛事名称'), 'auto')
    },
    {
      label: t('联赛等级'),
      prop: "level",
      headerRenderer: (d) => handleTableWidth(d, t('联赛等级'), 'auto')
    },
    {
      label: t('比赛时间'),
      prop: "beginTimeLong",
      formatter: ({ beginTimeLong }) => dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss'),
      headerRenderer: (d) => handleTableWidth(d, t('比赛时间'), 'auto')
    },
    {
      label: t('主队'),
      prop: "homeTeamNameCn",
      headerRenderer: (d) => handleTableWidth(d, t('比赛时间'), 'auto')
    },
    {
      label: t('当前比分'),
      prop: "currentScore",
      formatter: ({ currentScore }) => currentScore.replace(/H(\d+)A(\d+)/, '$1 - $2'),
      headerRenderer: (d) => handleTableWidth(d, t('当前比分'), 'auto')
    },
    {
      label: t('客队'),
      prop: "awayTeamNameCn",
      headerRenderer: (d) => handleTableWidth(d, t('客队'), 'auto')
    },
    {
      label: t('国家地区ID'),
      prop: "countryId",
      headerRenderer: (d) => handleTableWidth(d, t('国家地区ID'), 'auto')
    },
    /*  {
       label: t('赛种'),
       prop: "sportId",
       formatter: ({ sportId }): string => SPORT_ID_MAP.find(_ => _.value === sportId).label,
       minWidth: 150
     }, */
    {
      label: t('是否中立场地'),
      slot: 'isNeutral',
      headerRenderer: (d) => handleTableWidth(d, t('是否中立场地'), 'auto')
    },
    {
      label: t('开售状态'),
      slot: 'isSale',
      headerRenderer: (d) => handleTableWidth(d, t('开售状态'), 'auto')
    },
    {
      label: t('联赛杯赛ID'),
      prop: "leagueId",
      headerRenderer: (d) => handleTableWidth(d, t('联赛杯赛ID'), 'auto')
    },
  ];

  function changeSwitch({ row }: { row: SaleDataAPI.PreSaleList; index: number }) {
    ElMessageBox.confirm(
      `确认要调整开售状态吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        const res = await API.updateSaleStatus({
          isSale: row.isSale,
          matchId: row.matchId
        });
        if (res.code) return message(res.msg, { type: "error" });
        message(res.msg, { type: "success" })
        onSearch();
      })
      .catch(() => row.isSale = row.isSale === 0 ? 1 : 0);
  }

  function handleTableWidthChange(pageSize: number) {
    pagination.pageSize = pageSize;
    pagination.currentPage = 1;
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
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const data = removeEmptyStringKeys(form);
    const res: SaleDataAPI.PreSaleListRes = await API.getPreSaleList({
      ...data,
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
    if (res.code) return message(res.msg, { type: "error" });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
    loading.value = false;
    setTimeout(() => 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });
  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleTableWidthChange,
    switchLoadMap,
    handleCurrentChange,
    handleSelectionChange,
    switchStyle,
    changeSwitch
  };
}
