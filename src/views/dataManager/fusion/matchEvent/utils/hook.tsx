import editForm from '../form.vue';
import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
import { searchFormType } from './types';
import { removeEmptyStringKeys } from '@/utils/utilFn';

export function matchCombineHook() {
  const dataList = reactive<MatchCombineAPI.matchSourceDetail[]>([]);
  const matchInfoDataList = reactive<MatchCombineAPI.matchSourceDetail[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true
  });
  const form = reactive<searchFormType>({
    category: 0,
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val: number) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.getMatchPairingList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.data.list) {
        dataList.push(...res.data.list)
      }
    } catch (error) {
      loading.value = false;
    }
  }

  async function onModalSearch(type?: string) {
    loading.value = false;
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.getMatchDataSourceList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      matchInfoDataList.length = 0;
      matchInfoDataList.push(...res.data.list)
      pagination.total = res.data.total
    } catch (error) {
      loading.value = false;
    }
  }

  async function openDialog(title: string, row: MatchCombineAPI.matchSourceDetail) {
    onModalSearch();
    addDialog({
      title,
      width: '95%',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          matchDetail: row,
          matchInfoDataList: matchInfoDataList,
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            params && onSearch();
          }
        })
    });
  }
  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    matchInfoDataList,
    pagination,
    onSearch,
    openDialog,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    form,
    onModalSearch,
  };
}
