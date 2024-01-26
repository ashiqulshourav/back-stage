import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { ElMessageBox } from 'element-plus';
import { SearchFormType } from './types';
import { usePublicHooks } from '@/hooks';
import { removeEmptyStringKeys } from '@/utils/utilFn';

export function useEsportSettlement() {
  const dataList = reactive<EsportsSettlementAPI.ESportMatchList[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const allSaleSatatus = ref(0);
  const { switchStyle } = usePublicHooks();
  const matchCondition = ref(1);
  const selectLockcList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const searchForm = reactive<SearchFormType>({
    matchId: '',
    matchName: '',
    isSale: '',
    sportId: '',
    startTime: '',
    endTime: '',
    leagueNameCn: '',
    leagueId: '',
    handicapStatus: '',
    gameName: ''
  });

  function changeSwitch({
    row
  }: {
    row: SaleDataAPI.PreSaleList;
    index: number;
  }) {
    ElMessageBox.confirm(
      row.isSale ? t(`确认要开售吗?`) : t('确认要下架吗？'),
      t('系统提示'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
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

  function handleTableWidthChange(pageSize: number) {
    pagination.pageSize = pageSize;
    pagination.currentPage = 1;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(slectList) {
    selectLockcList.length = 0;
    selectLockcList.push(...slectList);
  }

  const onSearch = async (type?: 'reload') => {
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const res = await API.getESportMatchList({
      ...removeEmptyStringKeys(searchForm),
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
  };

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const changeMatchCondition = (n: number) => {
    matchCondition.value = n;
    onSearch('reload');
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleTableWidthChange,
    switchLoadMap,
    handleCurrentChange,
    handleSelectionChange,
    changeSwitch,
    allSaleSatatus,
    searchForm,
    switchStyle,
    matchCondition,
    changeMatchCondition
  };
}
