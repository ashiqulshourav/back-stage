import { searchFormType } from './types';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';

export function useEventQueryHook() {
  const downloading = ref(false);
  const matchEventList = reactive<EventAPI.MatchEvent[]>([]);
  const matchInfo = reactive<EventAPI.MatchInfo>({
    aTeamName: '',
    hTeamName: '',
    league: '',
    matchId: '',
    level: '',
    sportName: '',
    leagueId: '',
    startDateTime: ''
  });
  const loading = ref(false);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 30,
    currentPage: 1,
    background: true
  });

  const form = reactive<searchFormType>({
    // matchId: '302309',
    matchId: '',
    dataSourceCode: '',
    eventCode: [],
    endTime: '',
    startTime: '',
    canceled: ' '
  });

  async function onSearch(type?: string) {
    if (type === 'reload' || type === 'init') pagination.currentPage = 1;
    if (!form.matchId) {
      matchEventList.length = 0;
      pagination.total = 0;
      matchInfo.aTeamName = '';
      matchInfo.hTeamName = '';
      matchInfo.leagueId = '';
      matchInfo.league = '';
      matchInfo.level = '';
      matchInfo.matchId = '';
      matchInfo.sportName = '';
      matchInfo.startDateTime = '';
      return;
    }

    try {
      loading.value = true;
      const temp = Array.isArray(form.eventCode) ? [...form.eventCode] : [];
      const res = await API.getMatchEventByMatchId({
        ...removeEmptyStringKeys({
          ...form,
          eventCode: temp?.length ? temp.toString() : ''
        }),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });

      loading.value = false;

      if (res.code) return message(res.msg, { type: 'error' });
      matchEventList.length = 0;

      if (type === 'init') {
        const matchInfoRes = await API.getMatchInfoByMatchId({
          matchId: form.matchId
        });

        if (matchInfoRes?.code) return message(res?.msg, { type: 'error' });

        matchInfo.aTeamName = matchInfoRes.data.aTeamName;
        matchInfo.hTeamName = matchInfoRes.data.hTeamName;
        matchInfo.leagueId = matchInfoRes.data.leagueId;
        matchInfo.league = matchInfoRes.data.league;
        matchInfo.level = matchInfoRes.data.level;
        matchInfo.matchId = matchInfoRes.data.matchId;
        matchInfo.sportName = matchInfoRes.data.sportName;
        matchInfo.startDateTime = matchInfoRes.data.startDateTime;
      }

      matchEventList.push(...res.data.list);
      pagination.total = res.data.total;
      document!
        .querySelector('.table_container .el-scrollbar__wrap')!
        .scroll(0, 0);
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
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

  const router = useRouter();
  const exportFile = async () => {
    ElMessageBox.confirm(
      <div class="flex flex-col pl-4">
        <span class="font-bold text-[16px]">{t('导出当前事件列表数据?')}</span>
        <span>{t('点击确认立即导出')}</span>
      </div>,
      t('操作确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        customClass: 'export_dialog',
        dangerouslyUseHTMLString: true
      }
    )
      .then(async () => {
        const res = await API.matchEventDataExport({
          ...removeEmptyStringKeys({
            ...form,
            eventCode: form.eventCode?.length ? form.eventCode?.toString() : ''
          })
        });
        if (res.code) return message(res.msg, { type: 'error' });
        ElMessageBox.confirm(
          <div class="flex flex-col pl-4">
            <span class="font-bold text-[16px]">{t('正在执行导出任务')}</span>
            <span>{t('点击确认前往任务中心?')}</span>
          </div>,
          t(''),
          {
            confirmButtonText: t('确定'),
            cancelButtonText: t('留在当前页面'),
            customClass: 'export_dialog',
            dangerouslyUseHTMLString: true
          }
        ).then(() => {
          router.push('/taskCenter');
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  return {
    loading,
    pagination,
    onSearch,
    form,
    handleTableWidthChange,
    handleCurrentChange,
    matchEventList,
    handlePageSizeChange,
    matchInfo,
    exportFile
  };
}
