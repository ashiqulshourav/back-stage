import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import {
  accountChangeRecordSearchFormType,
  modifyBalanceFormType
} from '../util/types';
import ModifyBalanceForm from '../modifyBalanceModal.vue';
import ConfirmModifyBalanceForm from '../confirmModifyBalanceModal.vue';
import { addDialog, closeAllDialog, closeDialog } from '@/components/ReDialog';
import dayjs from 'dayjs';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';

export function useAccountChangeRecordHook() {
  const route = useRoute();
  const dataList = reactive<MemberAdminAPI.PageData[]>([]);
  const loading = ref(true);
  const modifyBalanceLoading = ref(false);
  const { openPasswordInput } = usePasswordInputHook();
  const renderObj = reactive<UserAPI.operateUserList>(
    history.state.params as UserAPI.operateUserList
  );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<accountChangeRecordSearchFormType>({
    createTimeStart: dayjs().startOf('month')?.valueOf(),
    createTimeEnd: dayjs().endOf('day').valueOf(),
    userId: route.query.userId
  });

  const editFrom = reactive<modifyBalanceFormType>({
    userId: route.query.userId,
    amount: null,
    accountChangeTypeCode: null,
    remark: ''
  });

  const userData = reactive<UserAPI.operateUserList>({
    id: renderObj.id,
    userName: renderObj.userName,
    tenantName: renderObj.tenantName,
    balance: renderObj.balance
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  const changeBalance = (amount: number) => {
    console.log('hook.tsx文件 62==============行打印=', userData.balance);
    userData.balance = Number(userData.balance) + Number(amount);
    console.log('hook.tsx文件 63==============行打印=', userData.balance);
  };


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
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.pageData);
      pagination.total = res.data.count;
      pagination.pageSize = res.data.pageSize;
      pagination.currentPage = res.data.pageNum;
    } catch (error) {
      loading.value = false;
    }
  }

  async function openModifyBalanceDialog(title?: string) {
    const r = await openPasswordInput();
    if (r) {
      addDialog({
        title,
        width: '30%',
        alignCenter: true,
        closeOnClickModal: false,
        hideFooter: true,
        contentRenderer: ({ options, index }) =>
          h(ModifyBalanceForm, {
            userName: renderObj.userName,
            changeBalance: (amount: number) => {
              userData.balance = Number(userData.balance) + Number(amount);
            },
            onCloseDialog: (params: string) => {
              closeDialog(options, index);
              onSearch();
            }
          })
      });
    }
  }

  // async function openConfirmModifyBalanceDialog(
  //   title?: string,
  //   data: modifyBalanceFormType
  // ) {
  //   addDialog({
  //     title,
  //     width: '20%',
  //     alignCenter: true,
  //     closeOnClickModal: false,
  //     hideFooter: true,
  //     contentRenderer: ({ options, index }) =>
  //       h(ConfirmModifyBalanceForm, {
  //         data: data,
  //         userName: renderObj.userName,
  //         onCloseDialog: (params: string) => {
  //           closeDialog(options, index);
  //         },
  //         onCloseAllDialog: (params: string) => {
  //           closeAllDialog();
  //           onSearch();
  //         }
  //       })
  //   });
  // }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

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
    // openConfirmModifyBalanceDialog,
    userData,
    changeBalance
  };
}
