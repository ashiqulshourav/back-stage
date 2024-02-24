import editForm from '../form.vue';
import { message } from '@/utils/message';
import { addDialog } from '@/components/ReDialog';
import { FormItemProps } from 'element-plus';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
import { columns } from '../component/TableColumnList';
import { removeEmptyStringKeys } from '@/utils/utilFn';

export function useLeague() {
  const formRef = ref();
  const dataList = reactive<MetadataAPI.TeamList[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive({
    teamId: '',
    countryId: '',
    isCountryTeam: '',
    leagueId: '',
    level: '',
    sportId: '',
    stadiumName: '',
    teamLogo: '',
    teamNameCn: '',
    teamNameEn: ''
  });

  function handleDelete(row) {
    message(`您删除了角色名称为${row.name}的这条数据`, { type: 'success' });
    onSearch();
  }

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
    loading.value = true;
    const res: ESportsAPI.ESportsTeamListResType = await API.getESportsTeamList(
      {
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      }
    );
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
    setTimeout(() => (loading.value = false), 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title: string, row?: MetadataAPI.LeagueList) {
    addDialog({
      title,
      props: {
        formInline: {
          leagueNameCn: row?.leagueNameCn ?? '',
          leagueNameEn: row?.leagueNameEn ?? '',
          leagueId188Bet: row?.leagueId188Bet ?? '',
          leagueLogo: row?.leagueLogo ?? '',
          level: row?.level ?? '',
          countryId: row?.countryId ?? '',
          leagueId: row?.leagueId ?? '',
          sportId: row?.sportId ?? ''
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
            updateTeam(curData, () => chores());
          }
        });
      }
    });
  }

  const updateTeam = async (curData, cb) => {
    const res = await API.updateEMatch(curData);
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (!res.code) cb();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    form
  };
}
