import { message } from '@/utils/message';
// import editForm from '../form.vue';
import type { PaginationProps } from '@pureadmin/table';
// import { addDialog } from '@/components/ReDialog';
// import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { columns } from '../component/TableColumnList';

export function useLeague() {
  const dataList = reactive<ESportsAPI.ESportsLeagueListArrType[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  // const formRef = ref();
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  async function onSearch(type?: string, params?) {
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const res: ESportsAPI.ESportsLeagueListType =
      await API.getESportsLeagueList({
        ...params,
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
    setTimeout(() => (loading.value = false), 500);
  }

  /*  function openDialog(title: string, row?: ESportsAPI.League) {
    addDialog({
      title,
      props: {
        formInline: {
          leagueId: row?.leagueId ?? '',
          leagueNameCn: row?.leagueNameCn ?? '',
          leagueNameEn: row?.leagueNameEn ?? '',
          leagueName: row?.leagueName ?? '',
          dataSource: row?.dataSource ?? '',
          dataSourceName: row?.dataSourceName ?? '',
          sort: row?.sort
        }
      },
      width: '40%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as ESportsAPI.League;
        function chores() {
          done();
          onSearch();
        }
        // FormRef.validate(async valid => {
        //   if (valid) {
        //     console.log('curData', curData);

        //     if (title === '新增') {
        //       await API.createEMatch(curData);
        //       chores();
        //     } else {
        //       await API.updateEMatch(curData);
        //       chores();
        //     }
        //   }
        // });
      }
    });
  } */

  onMounted(() => {
    onSearch();
  });
  return {
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    handleTableWidthChange,
    switchLoadMap,
    handleCurrentChange,
    // openDialog,
    switchStyle
  };
}
