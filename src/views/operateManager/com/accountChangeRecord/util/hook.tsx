import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { accountChangeRecordSearchFormType, modifyBalanceFormType } from '../util/types';
import ModifyBalanceForm from '../modifyBalanceModal.vue';
import ConfirmModifyBalanceForm from '../confirmModifyBalanceModal.vue';
import { addDialog, closeDialog } from '@/components/ReDialog';
import dayjs from 'dayjs';
export function useAccountChangeRecordHook() {
  const route = useRoute();
  const dataList = reactive<MemberAdminAPI.PageData[]>([]);
  const loading = ref(true);
  const modifyBalanceLoading = ref(false);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<accountChangeRecordSearchFormType>({
    createTimeStart: dayjs().startOf('month')?.valueOf(),
    createTimeEnd: dayjs().endOf('day').valueOf(),
    userId: route.query.userId,
  });

  const editFrom = reactive<modifyBalanceFormType>({
    userId: route.query.userId,
    amount: null,
    accountChangeTypeCode: null,
    remark: '',
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

  async function openModifyBalanceDialog(title?: string) {
    addDialog({
      title,
      width: 'auto',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(ModifyBalanceForm, {
          userId: route.query.userId,
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            onSearch();
          }
        })
    });
  }

  async function openConfirmModifyBalanceDialog(title?: string, data: modifyBalanceFormType) {
    addDialog({
      title,
      width: '25%',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(ConfirmModifyBalanceForm, {
          data: data,
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
          }
        })
    });
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
    handleSelectionChange,
    openModifyBalanceDialog,
    modifyBalanceLoading,
    editFrom,
    openConfirmModifyBalanceDialog,
  };
}
