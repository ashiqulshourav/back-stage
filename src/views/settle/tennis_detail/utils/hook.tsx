import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { columns, childColumns } from './tableColumnList';
import { useMatchStore } from '@/store/match';

export function useTennisDetailHook() {
  const dataList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const matchStore = useMatchStore();
  const loading = ref<boolean>(false);
  const childloading = ref<boolean>(false);
  const expandMatchList = reactive<number[]>([]);

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

  /** 搜索初始化 */
  const onSearch = async (type?: 'reload') => {
    try {
      if (type === 'reload') pagination.currentPage = 1;
      matchStore.set_settleRequestLoading(true);
      const res: SattleDataAPI.getSettlementListRes =
        await API.getSettlementList({
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage
        });
      matchStore.set_settleRequestLoading(false);
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
      pagination.pageSize = res.data.pageSize;
      pagination.currentPage = res.data.pageNum;
    } catch (error) {
      matchStore.settleRequestLoading = false;
    }
  };

  const expandChange = () => {};

  onMounted(() => onSearch());

  return {
    onSearch,
    columns,
    loading,
    dataList,
    pagination,
    handleTableWidthChange,
    handleCurrentChange,
    expandChange,
    expandMatchList,
    childloading,
    childColumns
  };
}
