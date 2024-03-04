import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { columns } from './tableColumnList';
import { SPORT_TYPE, SearchFormType } from '../../../utils/type';
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
  const switchLoadMap = ref({});
  const currentSportId = ref(1);
  const loopTimer = ref<NodeJS.Timeout>();

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

  //- 搜索初始化
  const onSearch = async (type?: 'reload', spoprtId?: number) => {
    loopTimer.value && clearInterval(loopTimer.value);
    try {
      if (spoprtId) currentSportId.value = spoprtId;
      if (type === 'reload') {
        pagination.currentPage = 1;
      }
      loading.value = true;
      const data = removeEmptyStringKeys(form);
      const res: SattleDataAPI.getSettlementListRes =
        await API.getSettlementHistory({
          ...data,
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage,
          sportId: SPORT_TYPE.basketball,
        });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  };

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch('reload');
  };
  onMounted(() => onSearch());
  onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  });
  const reloadTable = async () => {
    await onSearch('reload');
  };

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
    currentSportId,
    reloadTable
  };
}
