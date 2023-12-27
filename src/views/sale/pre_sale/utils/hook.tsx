import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";
import { ElMessageBox } from "element-plus";
import { removeEmptyStringKeys } from "@/utils/utilFn";
import { $t, transformI18n } from "@/plugins/i18n";
import { usePublicHooks } from "@/hooks";
import dayjs from "dayjs";
import { sportIdsMap } from "@/utils/maps/sports_map";

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
      label: transformI18n($t("sell.matchId")),
      prop: "matchId",
    },
    {
      label: transformI18n($t('sell.matchName')),
      prop: "matchName",
      minWidth: 200
    },
    {
      label: transformI18n($t('sell.level')),
      prop: "level",
    },
    {
      label: transformI18n($t('sell.beginTime')),
      prop: "beginTimeLong",
      minWidth: 150,
      formatter: ({ beginTimeLong }) => dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      label: transformI18n($t('sell.homeTeamId')),
      prop: "homeTeamId",
    },
    {
      label: transformI18n($t('sell.currentScore')),
      prop: "currentScore",
      formatter: ({ currentScore }) => currentScore.replace(/H(\d+)A(\d+)/, '$1 - $2')
    },
    {
      label: transformI18n($t('sell.awayTeamId')),
      prop: "awayTeamId",
      minWidth: 150
    },
    {
      label: transformI18n($t('sell.countryId')),
      prop: "countryId",
      minWidth: 150
    },
    {
      label: transformI18n($t('metadata.sportType')),
      prop: "sportId",
      formatter: ({ sportId }): string => sportIdsMap.find(_ => _.value === sportId).label,
      minWidth: 150
    },
    {
      label: transformI18n($t('sell.isNeutral')),
      slot: 'isNeutral',
      minWidth: 150
    },
    {
      label: transformI18n($t('sell.isSale')),
      minWidth: 150,
      slot: 'isSale',
    },
    {
      label: transformI18n($t('sell.leagueId')),
      prop: "leagueId",
      minWidth: 150
    },
  ];

  function changeSwitch({ row }: { row: SaleDataAPI.PreSaleList; index: number }) {
    ElMessageBox.confirm(
      `确认要${row.isSale === 0 ? "停用" : "启用"
      }<strong style='color:var(--el-color-primary)'>${row.matchName
      }</strong>开售状态吗?`,
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
    setTimeout(() => loading.value = false, 500);
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
    handleSizeChange,
    switchLoadMap,
    handleCurrentChange,
    handleSelectionChange,
    switchStyle,
    changeSwitch
  };
}
