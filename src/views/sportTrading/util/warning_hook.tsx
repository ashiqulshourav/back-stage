import { message } from '@/utils/message';
import { WarningSearchFormType, handicapListType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { baseHandicapList, warningBaseList } from './baseData';
import type { PaginationProps } from '@pureadmin/table';
import { addDialog, closeDialog } from '@/components/ReDialog';
import MatchCountDown from '../com/MatchCountDown.vue';
import {
  BO_DAN_CODE_LIST,
  MATCH_STATUS,
  SALE_STATUS,
  icon_msg_tip,
  transferBoDanCol
} from './playMap';
import { ElMessageBox } from 'element-plus';

export function useWarningHook() {
  const loading = ref(true);
  const noMatchList = ref(false);
  const matchList = reactive<sportTradingDataAPI.getAlarmMatchListType[]>([]);
  const matchStatus = ref<'countDown' | 'canceled' | 'over'>('countDown');
  const matchStartTime = ref<number>();
  const matchIdList = reactive<number[]>([]);
  const pages = ref<number>();
  const size = ref<number>();

  const handicapList = reactive<handicapListType[]>(baseHandicapList);
  const currentMatch = reactive<sportTradingDataAPI.MatchDtoList>(
    {} as sportTradingDataAPI.MatchDtoList
  );

  //- 分页内容
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 5,
    currentPage: 1,
    background: true
  });

  //- 搜索表单
  const searchForm = reactive<WarningSearchFormType>({
    sportId: 1,
    leagueNameOrId: '',
    matchNameOrId: '',
    startTime: '',
    endTime: ''
  });

  //- 更新界面
  const reloadList = async () => {
    pagination.currentPage = 1;
    onSearch();
  };

  //- 分页改变
  const changePageSize = () => onSearch();

  //- 初始化搜索
  const onSearch = async () => {
    loading.value = true;
    noMatchList.value = false;
    const res = await API.getAlarmMatchList({
      ...removeEmptyStringKeys(searchForm),
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    //获取当前页面IDS
    matchIdList.length = 0;
    matchIdList.push(...res.data?.list.map(item => item.matchId));
    saveList(res.data);
    //- 开启事件定时任务
    runLoopMatch();
  };

  //- 处理数据填充逻辑
  const saveList = (data: sportTradingDataAPI.getAlarmMatchListData) => {
    pages.value = data.pages;
    size.value = data.size;
    pagination.total = data?.total;
    data.list.forEach((item: sportTradingDataAPI.getAlarmMatchListType) => {
      const baseDatat: typeof warningBaseList = JSON.parse(
        JSON.stringify(warningBaseList)
      );
      baseDatat.forEach(_ => {
        const arr =
          item.betItemsResultDto[
            _.listType as keyof sportTradingDataAPI.BetItemsResultDto
          ];
        arr.forEach((d: sportTradingDataAPI.MainListType) => {
          d.kindsCodeDtoList.forEach(_ => {
            _.betItemsDtoList.forEach(l => {
              if (!l.dpOdds) l.dpOdds = l.odds;
            });
          });
          // - 波胆单独处理
          if (BO_DAN_CODE_LIST.includes(d.kindsCode)) {
            transferBoDanCol(
              d as sportTradingDataAPI.MainBetItemsDtoList,
              currentMatch.homeTeamNameCn,
              currentMatch.awayTeamNameCn
            );
          }
        });
        _.list = arr;
      });
      item.renderList = baseDatat.filter(item => {
        return item.list.length;
      });
    });
    matchList.length = 0;
    matchList.push(...data.list);
  };

  //- 开启定时轮询任务
  const loopTimer = ref<NodeJS.Timeout>();
  const runLoopMatch = () => {
    if (loopTimer) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => {
      getLoopMatchData();
    }, 5000);
  };

  //- 轮询更新当前页面赛事信息
  const getLoopMatchData = async () => {
    const res = await API.loopAlarmMatchList({
      sportId: searchForm.sportId,
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      total: pagination.total,
      pages: pages.value as number,
      size: size.value as number,
      matchIdList
    });
    if (res.code) {
      clearInterval(loopTimer.value);
      return message(res.msg, { type: 'error' });
    }
    saveList(res.data);
  };

  onMounted(() => {
    onSearch();
  });

  //- 卸载定时器
  onUnmounted(() => loopTimer.value && clearInterval(loopTimer.value));

  return {
    searchForm,
    pagination,
    loading,
    matchList,
    changePageSize,
    reloadList
  };
}
