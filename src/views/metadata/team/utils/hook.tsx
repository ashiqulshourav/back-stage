import editForm from '../form.vue';
import { message } from '@/utils/message';
// import { ElMessageBox } from "element-plus";
import { addDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
// import { usePublicHooks } from "@/hooks";
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

  // const buttonClass = computed(() => {
  //   return [
  //     "!h-[20px]",
  //     "reset-margin",
  //     "!text-gray-500",
  //     "dark:!text-white",
  //     "dark:hover:!text-primary"
  //   ];
  // });

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
    const res: MetadataAPI.TeamListRes = await API.getTeamList({
      ...removeEmptyStringKeys(searchForm),
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
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (row) {
              updateTeam(curData, () => chores());
              // 实际开发先调用新增接口，再进行下面操作
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
              chores();
            }
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
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    // handleDatabase,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    searchForm
  };
}
