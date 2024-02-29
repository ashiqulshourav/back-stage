import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { columns } from './tableColumnList';
import { SPORT_TYPE, SearchFormType } from '../../../utils/type';
import { useMatchStore } from '@/store/match';

export function useSportHook() {
  const dataList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const matchStore = useMatchStore();
  const form = ref<SearchFormType>({} as SearchFormType);

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
      const data = removeEmptyStringKeys(form.value ?? {});
      matchStore.set_settleRequestLoading(true);
      const res: SattleDataAPI.getSettlementListRes =
        await API.getSettlementList({
          ...data,
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage,
          sportId: SPORT_TYPE.handball
        });
      matchStore.set_settleRequestLoading(false);
      if (res.code) return message(res.msg, { type: 'error' });
      res.data.list.forEach(item => {
        item.isShowCancelBtn = +res.ts < +item.beginTimeLong;
      });
      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      matchStore.settleRequestLoading = false;
    }
  };

  onMounted(() => onSearch());

  return {
    form,
    onSearch,
    columns,
    dataList,
    pagination,
    handleTableWidthChange,
    handleCurrentChange
  };
}
