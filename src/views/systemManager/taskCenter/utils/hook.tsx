import { message } from '@/utils/message';

import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { searchFormType } from './types';
import { removeEmptyStringKeys } from '@/utils/utilFn';

export function useUserManager() {
  const dataList = reactive<TaskCenterAPI.ListItem[]>([]);
  const loading = ref(true);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true
  });

  const form = reactive<searchFormType>({
    fileName: ''
  });
  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  //- 初始化
  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.taskList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.records);
      pagination.total = res.data.total;
    } catch (error) {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };
  const handleDelete = (row: { id: number }) => {
    API.deleteTask({ id: row.id }).then(res => {
      message(res.msg, { type: res.code === 0 ? 'success' : 'error' });
      if (res.code === 0) {
        onSearch();
      }
    });
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
    handleCurrentChange,
    handleDelete,
  };
}
