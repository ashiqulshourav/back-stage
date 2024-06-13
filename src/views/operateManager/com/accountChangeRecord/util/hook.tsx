import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { accountChangeRecordSearchFormType, userDataType } from '../util/types';
import ModifyBalanceForm from '../modifyBalanceModal.vue';
import { addDialog, closeDialog } from '@/components/ReDialog';
import dayjs from 'dayjs';
import { FormInstance } from 'element-plus';

export function useAccountChangeRecordHook() {
  const route = useRoute();
  const dataList = reactive<OperateManagementDataAPI.AccountChangeRecordType[]>([]);
  const loading = ref(true);
  const modifyBalanceLoading = ref(false);
  const router = useRouter();
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
    startCreatedAt: '',
    endCreatedAt: '',
    userId: route.query.userId
  });

  const userData = reactive<userDataType>({
    userId: renderObj.id,
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

  // const changeBalance = (amount: number) => {
  //   userData.balance = Number(userData.balance) + Number(amount);
  // };


  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  const goToUserListPage = () => {
    router.push({
      name:
        route.path === '/operateManager/sportChangeAccountRecord'
          ? 'OPERATEMANAGER_SPORTPLAYERLIST'
          : 'OPERATEMANAGER_ESPORTPLAYERLIST',
    });
  };

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
      pagination.currentPage = res.data.pageNumber;
      if (!form.accountChangeTypeCode && !form.endCreatedAt && !form.startCreatedAt && res.data.pageNum === 1) {
        userData.balance = res.data.pageData[0].balance;
      }
    } catch (error) {
      loading.value = false;
    }
  }

  async function openModifyBalanceDialog(title?: string) {
    addDialog({
      title,
      width: '30%',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(ModifyBalanceForm, {
          userName: renderObj.userName,
          // changeBalance: (amount: number) => {
          //   userData.balance = Number(userData.balance) + Number(amount);
          // },
          search: () => {
            onSearch();
          },
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            onSearch();
          }
        })
    });
  }

  const resetForm = (formEl: FormInstance | undefined) => {
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
    userData,
    goToUserListPage,
    // changeBalance
  };
}
