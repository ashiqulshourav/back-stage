import editForm from '../form.vue';
import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, h } from 'vue';
import {editSearchFormType, searchFormType} from './types';
import { removeEmptyStringKeys } from '@/utils/utilFn';

export function matchCombineHook() {
  const dataList = reactive<MatchCombineAPI.matchSourceDetail[]>([]);
  const matchInfoDataList = reactive<MatchCombineAPI.matchSourceDetail[]>([]);
  const loading = ref(true);
  const levelList = reactive<ConfigCenterDataAPI.leagueLevelList[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
  });
  const editPagination = reactive<PaginationProps>({
      total: 0,
      pageSize: 20,
      currentPage: 1,
  });
  const form = reactive<searchFormType>({
    category: 0,
  });

  const editFrom =reactive<editSearchFormType>({
      category: 0,
      sportId:'',
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

  //- 获取联赛等级列表
  const initLevelList = async () => {
    const res = await API.getLevelList();
    if (res.code) return;
    levelList.length = 0;
    levelList.push(...res.data);
  };

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
    if (type === 'reload') editPagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.getMatchDataSourceList({
        ...removeEmptyStringKeys(editFrom),
        pageSize: editPagination.pageSize,
        pageNum: editPagination.currentPage
      });
      loading.value = false;
      matchInfoDataList.length=0;
      if (res.data.list) {
        matchInfoDataList.push(...res.data.list)
      }
    } catch (error) {
      loading.value = false;
    }
  }

  async function openDialog(title: string, row?: MatchCombineAPI.matchSourceDetail) {
    addDialog({
      title,
      width: '95%',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
            rowData:row,
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            params && onSearch();
          }
        })
    });
  }
  return {
    loading,
    dataList,
    matchInfoDataList,
    pagination,
    onSearch,
    openDialog,
    levelList,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    form,
    onModalSearch,
      editFrom
  };
}
