import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { accountChangeRecordSearchFormType } from '../util/types';
import dayjs from 'dayjs';
export function useAccountChangeRecordHook() {
  const dataList = reactive<MemberAdminAPI.PageData[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<accountChangeRecordSearchFormType>({
    createTimeStart: dayjs().startOf('month')?.valueOf(),
    createTimeEnd: dayjs().endOf('day').valueOf(),
    userId: '1790032619430216671',
  });
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
    try {
      loading.value = true;
      const res = await API.getAccountChangeRecord({
        ...removeEmptyStringKeys({ ...form }),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage,
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.pageData);
      pagination.total=res.data.count;
      pagination.pageSize = res.data.pageSize;
      pagination.currentPage = res.data.pageNum;
    } catch (error) {
      loading.value = false;
    }
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
    loading,
    dataList,
    pagination,
    onSearch,
    resetForm,
    form,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
