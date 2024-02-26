import editForm from '../form.vue';
import { message } from '@/utils/message';
import { addDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
import { FormItemProps } from 'element-plus';
import { columns } from '../component/TableColumnList';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { SearchFormType } from './types';

export function useTeam() {
  const formRef = ref();
  const dataList = reactive<MetadataAPI.TeamList[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const searchForm = reactive<SearchFormType>({
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
    const res: MetadataAPI.TeamListRes = await API.getTeamList({
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

  function openDialog(title: string, row?: MetadataAPI.TeamList) {
    addDialog({
      title,
      props: {
        formInline: {
          countryId: row?.countryId ?? '',
          isCountryTeam: row?.isCountryTeam ?? '',
          leagueId: row?.leagueId ?? '',
          level: row?.level ?? '',
          sportId: row?.sportId ?? '',
          teamId: row?.teamId ?? '',
          stadiumName: row?.stadiumName ?? '',
          teamNameCn: row?.teamNameCn ?? '',
          teamNameEn: row?.teamNameEn ?? '',
          teamLogo: row?.teamLogo ?? ''
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
                (curData as any).teamLogo = res.data?.url;
              }
            }
            updateTeam(curData, () => chores());
          }
        });
      }
    });
  }

  const updateTeam = async (curData, cb) => {
    const res = await API.updateTeam(curData);
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
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    searchForm
  };
}
