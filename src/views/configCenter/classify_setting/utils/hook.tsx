import editForm from '../form.vue';
import { message } from '@/utils/message';
// import { ElMessageBox } from "element-plus";
import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
// import { usePublicHooks } from "@/hooks";
import { FormItemProps } from 'element-plus';
import { columns } from '../component/TableColumnList';
import { SearchFormType } from './types';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';

export function useClassifySettingHook() {
  const formRef = ref();
  const dataList = reactive<MetadataAPI.TeamList[]>([]);
  const loading = ref(true);

  const searchForm = reactive<SearchFormType>({
    sportId: 1
  });

  function handleDelete(row) {
    message(`您删除了角色名称为${row.name}的这条数据`, { type: 'success' });
    onSearch();
  }

  function handleTableWidthChange(val: number) {
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    loading.value = true;
    const res = await API.getKindsCodeList({
      ...searchForm
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title: string, row?: MetadataAPI.TeamList) {
    addDialog({
      title,
      width: '25%',
      closeOnClickModal: false,
      center: true,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          form: {
            sportId: searchForm.sportId,
            sportName: SPORT_ID_MAP.find(
              item => item.value === searchForm.sportId
            ).label,
            configValue: ''
          },
          onCloseDialog: () => {
            closeDialog(options, index);
          }
        })
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    // handleDatabase,
    handleTableWidthChange,
    handleSelectionChange,
    searchForm
  };
}
