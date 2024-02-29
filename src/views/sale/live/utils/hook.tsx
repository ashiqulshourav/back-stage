import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { ElMessageBox } from 'element-plus';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import dayjs from 'dayjs';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { useMatchStore } from '@/store/match';
import { parseCountry } from '@/utils/formatMatch';

export function useLeague() {
  const form = reactive({
    matchId: '',
    matchName: '',
    isSale: '',
    beginTime: ''
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
      label: t('赛事ID'),
      prop: 'matchId'
    },
    {
      label: t('赛事名称'),
      prop: 'matchName',
      minWidth: 200
    },
    {
      label: t('热门排序'),
      prop: 'level'
    },
    {
      label: t('比赛时间'),
      prop: 'beginTimeLong',
      minWidth: 150,
      formatter: ({ beginTimeLong }) =>
        dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      label: t('主队ID'),
      prop: 'homeTeamId'
    },
    {
      label: t('当前比分'),
      prop: 'currentScore',
      formatter: ({ currentScore }) =>
        currentScore.replace(/H(\d+)A(\d+)/, '$1 - $2')
    },
    {
      label: t('客队ID'),
      prop: 'awayTeamId',
      minWidth: 150
    },
    {
      label: t('国家地区'),
      prop: 'countryId',
      minWidth: 150,
      formatter: ({ countryId }) => parseCountry(countryId)
    },
    {
      label: t('赛种'),
      prop: 'sportId',
      formatter: ({ sportId }): string =>
        SPORT_ID_MAP.find(_ => _.value === sportId)?.label ?? '-',
      minWidth: 150
    },
    {
      label: t('是否中立场地'),
      slot: 'isNeutral',
      minWidth: 150
    },
    {
      label: t('开售状态'),
      minWidth: 150,
      slot: 'isSale'
    },
    {
      label: t('联赛杯赛ID'),
      prop: 'leagueId',
      minWidth: 150
    }
  ];

  function changeSwitch({
    row
  }: {
    row: SaleDataAPI.PreSaleList;
    index: number;
  }) {
    ElMessageBox.confirm(
      `确认要${
        row.isSale === 0 ? '停用' : '启用'
      }<strong style='color:var(--el-color-primary)'>${
        row.matchName
      }</strong>开售状态吗?`,
      '系统提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        const res = await API.updateSaleStatus({
          isSale: row.isSale,
          matchId: row.matchId
        });
        if (res.code) return message(res.msg, { type: 'error' });
        message(res.msg, { type: 'success' });
        onSearch();
      })
      .catch(() => (row.isSale = row.isSale === 0 ? 1 : 0));
  }

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
    loading.value = true;
    const data = removeEmptyStringKeys(form);
    const res: SaleDataAPI.PreSaleListRes = await API.getRollingBall({
      ...data,
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
    setTimeout(() => (loading.value = false), 500);
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
