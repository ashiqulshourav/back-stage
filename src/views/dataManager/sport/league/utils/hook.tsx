import editForm from '../form.vue';
import { message } from '@/utils/message';
import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { searchFormType } from './types';

export function useLeague() {
  const dataList = reactive<MetadataAPI.LeagueList[]>([]);
  const loading = ref(true);
  const levelList = reactive<ConfigCenterDataAPI.leagueLevelList[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<searchFormType>({
    leagueNameCn: '',
    leagueNameEn: '',
    level: '',
    countryId: '',
    leagueId: '',
    leagueId188Bet: '',
    sportId: 1,
    riskLevel: '',
    category: 0
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val: number) {
    console.log('handleSelectionChange', val);
  }

  //- 获取联赛等级列表
  const initLevelList = async () => {
    const res = await API.getLevelList();
    if (res.code) return;
    levelList.length = 0;
    levelList.push(...res.data);
  };

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res: MetadataAPI.LeagueListRes = await API.getLeagueList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
    } catch (error) {
      loading.value = false;
    }
  }

  async function openDialog(title: string, row?: MetadataAPI.LeagueList) {
    addDialog({
      title,
      width: '40%',
      draggable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          levelList,
          formInline: {
            leagueLogo: row?.leagueLogo ?? '',
            leagueId: row?.leagueId ?? '',
            countryId: row?.countryId ?? '',
            leagueId188Bet: row?.leagueId188Bet ?? '',
            leagueNameCn: row?.leagueNameCn ?? '',
            leagueNameEn: row?.leagueNameEn ?? '',
            level: row?.level ?? '',
            sportId: row?.sportId ?? '',
            category: row?.category ?? '',
            leagueTagsId: row?.leagueTagsId ?? [],
            isEsportType: form.category === 1,
            riskLevel: row?.riskLevel ?? ''
          },
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            params && onSearch();
          }
        })
    });
  }

  onMounted(() => {
    onSearch();
    initLevelList();
  });

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    openDialog,
    levelList,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    form
  };
}
