import { message } from '@/utils/message';
import { SearchFormType, handicapListType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { baseHandicapList } from './baseData';
import { BO_DAN_CODE_LIST, transferBoDanCol } from './playMap';

export function useTradingHook() {
  const loading = ref(true);
  const handicapLoading = ref(true);

  const matchList = reactive<sportTradingDataAPI.getMorningSetMatchListData[]>(
    []
  );
  const handicapList = reactive<handicapListType[]>(baseHandicapList);
  const currentMatch = reactive<sportTradingDataAPI.MatchDtoList>(
    {} as sportTradingDataAPI.MatchDtoList
  );
  const searchForm = reactive<SearchFormType>({
    sportId: 1,
    leagueNameOrId: '',
    matchNameOrId: '',
    startTime: '',
    endTime: ''
  });

  //- 初始化搜索
  const onSearch = async () => {
    loading.value = true;
    const res = await API.getMorningSetMatchList({
      ...removeEmptyStringKeys(searchForm)
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    matchList.length = 0;
    const firstRenderList = res.data.slice(0, 1);
    matchList.push(...firstRenderList);
    Object.assign(currentMatch, matchList[0]?.matchDtoList[0]);
    //- 获取赛事盘口
    getHandicapltems();
    //- 后续列表填充
    res.data.slice(1).forEach(item => {
      setTimeout(() => matchList.push(item), 20);
    });
  };

  //- 盘口赛事列表接口
  const getHandicapltems = async () => {
    handicapLoading.value = true;
    const res = await API.getHandicapItems({ matchId: currentMatch.matchId });
    handicapLoading.value = false;
    if (res.code) return;
    const tempList = handicapList.slice(1);

    tempList.forEach(_ => {
      _.list = res.data[
        _.listType as keyof sportTradingDataAPI.getHandicapItemsData
      ] as sportTradingDataAPI.MainBetItemsDtoList[];
      _.amount = res.data[
        _.amountType as keyof sportTradingDataAPI.getHandicapItemsData
      ] as number;
    });
    handicapList[0].list = tempList.map(item => item.list).flat();
    handicapList[0].amount = tempList
      .map(item => item.amount)
      .reduce((pre, next) => pre + next);

    handicapList[0].list.forEach(item => {
      item.kindsCodeDtoList.forEach(_ => {
        _.betItemsDtoList.forEach(l => {
          if (!l.dpOdds) l.dpOdds = l.odds;
        });
      });
      // - 波胆单独处理
      if (BO_DAN_CODE_LIST.includes(item.kindsCode)) {
        transferBoDanCol(
          item,
          currentMatch.homeTeamNameCn,
          currentMatch.awayTeamNameCn
        );
      }
    });
  };

  //- 修改左侧选中比赛ID
  const changeSelectMatch = (data: sportTradingDataAPI.MatchDtoList) => {
    Object.assign(currentMatch, data);
    getHandicapltems();
  };

  //- 修改内容部分导航标签分类
  const selectContentType = ref('all');
  const changeSelectType = (type: string) => {
    selectContentType.value = type;
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    matchList,
    onSearch,
    handicapLoading,
    searchForm,
    currentMatch,
    changeSelectMatch,
    handicapList,
    selectContentType,
    changeSelectType
  };
}
