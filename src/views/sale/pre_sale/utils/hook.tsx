import { message } from '@/utils/message';
import editForm from '../form.vue';
import type { PaginationProps } from '@pureadmin/table';
import { ElMessageBox } from 'element-plus';
import { FormItemProps } from 'element-plus';
import { addDialog } from '@/components/ReDialog';
import { SearchFormType } from './types';
import { usePublicHooks } from '@/hooks';
import { removeEmptyStringKeys } from '@/utils/utilFn';

export function usePreSale() {
  const formRef = ref();
  const dataList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const allSaleSatatus = ref(0);
  const { switchStyle } = usePublicHooks();
  const isLockAll = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const searchForm = reactive<SearchFormType>({
    matchId: '',
    matchName: '',
    isSale: '',
    sportId: '',
    beginTime: '',
    leagueNameCn: ''
  });

  function changeSwitch({
    row
  }: {
    row: SaleDataAPI.PreSaleList;
    index: number;
  }) {
    ElMessageBox.confirm(t('确认要调整开售状态吗?'), t('系统提示'), {
      confirmButtonText: t('确定'),
      cancelButtonText: t('取消'),
      type: 'warning',
      dangerouslyUseHTMLString: true,
      draggable: true
    })
      .then(async () => {
        const res = await API.updateSaleStatus({
          isSale: row.isSale,
          matchId: row.matchId
        });
        if (res.code) return message(res.msg, { type: 'error' });
        message(res.msg, { type: 'success' });
        onSearch();
      })
      .catch(() => (row.isSale = row.isSale === 0 ? 1 : 0));
  }

  function handleTableWidthChange(pageSize: number) {
    pagination.pageSize = pageSize;
    pagination.currentPage = 1;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(slectList) {
    console.log('handleSelectionChange', slectList);
    isLockAll.value = slectList.length !== dataList.length;
  }

  const openDialog = (title: string, row?: SaleDataAPI.PreSaleList) => {
    addDialog({
      title,
      props: {
        formInline: {
          matchId: row?.matchId ?? '',
          sportId: row?.sportId ?? '',
          matchName: row?.matchName ?? '',
          beginTime: row?.beginTime ?? '',
          level: row?.level ?? ''
        }
      },
      width: '40%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (row) {
              updateSaleList(curData, () => chores());
            } else {
              chores();
            }
          }
        });
      }
    });
  };

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const res: SaleDataAPI.PreSaleListRes = await API.getPreSaleList({
      ...removeEmptyStringKeys(searchForm),
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const updateSaleList = async (curData, cb) => {
    const res = await API.updateMatch(curData);
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (res.code) return;
    cb();
  };

  const changeAllSaleStatus = () => {
    console.log('hook.tsx文件 131==============行打印=', allSaleSatatus.value);
    ElMessageBox.confirm(t('确认要调整开售状态吗?'), t('系统提示'), {
      confirmButtonText: t('确定'),
      cancelButtonText: t('取消'),
      type: 'warning',
      dangerouslyUseHTMLString: true,
      draggable: true
    })
      .then(async () => {
        // const res = await API.updateSaleStatus({
        //   isSale: row.isSale,
        //   matchId: row.matchId
        // });
        // if (res.code) return message(res.msg, { type: 'error' });
        // message(res.msg, { type: 'success' });
        // onSearch();
      })
      .catch(() => (allSaleSatatus.value = 0));
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
    handleTableWidthChange,
    switchLoadMap,
    handleCurrentChange,
    handleSelectionChange,
    openDialog,
    changeSwitch,
    changeAllSaleStatus,
    allSaleSatatus,
    searchForm,
    isLockAll,
    switchStyle
  };
}
