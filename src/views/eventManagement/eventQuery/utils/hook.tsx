import { searchFormType } from './types';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { message } from '@/utils/message';

export function useEventQueryHook() {
  const pandaMatchEventList = reactive<EventAPI.PandaMatchEvent[]>([]);
  const loading = ref(false);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive<searchFormType>({
    eventId: '',
    startTime: '',
    endTime: '',
    eventName: ''
  });

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.getPandaMatchEventList({
        ...(removeEmptyStringKeys(form) as searchFormType),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });

      loading.value = false;

      console.log(res);
      if (res?.code) return message(res?.msg, { type: 'error' });
      pandaMatchEventList.length = 0;
      pandaMatchEventList.push(...res.data);
      // pagination.total = res.data.total;
      // document
      //   .querySelector('.table_container .el-scrollbar__wrap')
      //   .scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  }

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }
  function handlePageSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    pagination,
    onSearch,
    form,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    // openDialog,
    pandaMatchEventList,
    handlePageSizeChange
  };
}
