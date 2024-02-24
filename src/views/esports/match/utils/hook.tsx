import { message } from '@/utils/message';
import editForm from '../form.vue';
import type { PaginationProps } from '@pureadmin/table';
// import { addDialog } from '@/components/ReDialog';
// import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { columns } from '../component/TableColumnList';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { addDialog } from '@/components/ReDialog';

export function useLeague() {
  const dataList = reactive<ESportsAPI.ESportsLeagueListArrType[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const formRef = ref();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive({
    leagueNameCn: '',
    leagueNameEn: '',
    level: '',
    countryId: '',
    leagueId: '',
    leagueId188Bet: '',
    sportId: ''
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const res: ESportsAPI.ESportsLeagueListType =
      await API.getESportsLeagueList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    setTimeout(() => (loading.value = false), 500);
  }

  function openDialog(
    title: string,
    row?: ESportsAPI.ESportsLeagueListArrType
  ) {
    addDialog({
      title,
      props: {
        formInline: {
          leagueId: row?.leagueId ?? '',
          leagueNameCn: row?.leagueNameCn ?? '',
          leagueNameEn: row?.leagueNameEn ?? ''
        }
      },
      width: '40%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, { ref: formRef, onReloadTable: () => onSearch() }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        function chores() {
          done();
          onSearch();
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (formRef.value.uploadFormFile) {
              let formData = new FormData();
              formData.append('file', formRef.value.uploadFormFile);
              formData.append('fileUsageCategory', '3');
              const res = await API.fileUpload(formData);
              if (res.data?.url) {
                (curData as any).leagueLogo = res.data?.url;
              }
            }

            const r = await API.updateEMatch(curData);
            message(r.msg, { type: r.code ? 'error' : 'success' });
            chores();
            // if (title === '新增') {
            //   await API.createEMatch(curData);
            //   chores();
            // } else {
            //   const res = await API.updateEMatch(curData);
            //   message(res.msg, { type: res.code ? 'error' : 'success' });
            //   chores();
            // }
          }
        });
      }
    });
  }

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
    openDialog,
    switchStyle,
    form
  };
}
