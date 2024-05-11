import { searchFormType } from './types';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { message } from '@/utils/message';

export function useEventQueryHook() {
  const matchEventList = reactive<EventAPI.MatchEvent[]>([]);
  const matchInfo = reactive<EventAPI.MatchInfo>({
    aTeamName: '',
    hTeamName: '',
    league: '',
    matchId: '',
    sportName: '',
    startDateTime: ''
  });
  const loading = ref(false);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive<searchFormType>({
    matchId: '',
    dataSourceCode: '',
    eventCode: '',
    endTime: '',
    startTime: ''
  });

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;

    if (!form.matchId) {
      matchEventList.length = 0;
      pagination.total = 0;
      matchInfo.aTeamName = '';
      matchInfo.aTeamName = '';
      matchInfo.hTeamName = '';
      matchInfo.league = '';
      matchInfo.matchId = '';
      matchInfo.sportName = '';
      matchInfo.startDateTime = '';
      return;
    }

    try {
      loading.value = true;
      const res = await API.getMatchEventByMatchId({
        ...(removeEmptyStringKeys(form) as searchFormType),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });

      loading.value = false;

      if (res?.code) return message(res?.msg, { type: 'error' });
      matchEventList.length = 0;

      const matchInfoRes = await API.getMatchInfoByMatchId({
        matchId: form.matchId
      });

      if (matchInfoRes?.code) return message(res?.msg, { type: 'error' });

      console.log('fuck', matchInfoRes.data);

      matchInfo.aTeamName = matchInfoRes.data.aTeamName;
      matchInfo.aTeamName = matchInfoRes.data.aTeamName;
      matchInfo.hTeamName = matchInfoRes.data.hTeamName;
      matchInfo.league = matchInfoRes.data.league;
      matchInfo.matchId = matchInfoRes.data.matchId;
      matchInfo.sportName = matchInfoRes.data.sportName;
      matchInfo.startDateTime = matchInfoRes.data.startDateTime;

      matchEventList.push(...res.data.list);
      pagination.total = res.data.total;
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  }

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }
  function handlePageSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  onMounted(() => {
    // onSearch();
  });

  return {
    loading,
    pagination,
    onSearch,
    form,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    // openDialog,
    matchEventList,
    handlePageSizeChange,
    matchInfo
  };
}
