import { message } from '@/utils/message';
import { SearchFormType, handicapListType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { baseHandicapList } from './baseData';
import {
  BO_DAN_CODE_LIST,
  MATCH_STATUS,
  SALE_STATUS,
  transferBoDanCol
} from './playMap';
import dayjs from 'dayjs';

export function useTradingHook(type: 'early' | 'in') {
  const loading = ref(true);
  const noMatchList = ref(false);
  const matchStatus = ref<'countDown' | 'canceled' | 'over'>('countDown');
  const matchStartTime = ref<number>();
  const matchList = reactive<sportTradingDataAPI.getMorningSetMatchListData[]>(
    []
  );
  const handicapList = reactive<handicapListType[]>(baseHandicapList);
  const panIsEmpty = ref(false);
  const currentMatch = reactive<sportTradingDataAPI.MatchDtoList>(
    {} as sportTradingDataAPI.MatchDtoList
  );

  const isShowDialog = ref(false);
  const searchForm = reactive<SearchFormType>({
    sportId: 1,
    leagueNameOrId: '',
    matchNameOrId: '',
    startTime:
      type === 'early'
        ? dayjs()
            .set('hour', 12)
            .set('minute', 0)
            .set('second', 0)
            .format('YYYY-MM-DD HH:mm:ss')
        : '',
    endTime:
      type === 'early'
        ? dayjs()
            .add(7, 'day')
            .set('hour', 12)
            .set('minute', 0)
            .set('second', 0)
            .format('YYYY-MM-DD HH:mm:ss')
        : ''
  });

  /* 
isHandicap: item.ptds?.filter((ptd) => ptd.kc === 'FT_AH' && ptd.ctid === 0)?.some((ptd) => ptd.hcl[0].bil.some((b) => (b.h.startsWith('-') && b.hoa?.toUpperCase() === 'HOME'))),
 */

  //- 盘口赛事列表接口
  const loopTimer = ref<NodeJS.Timeout>();
  //- 初始化搜索
  const onSearch = async () => {
    if (loopTimer.value) clearInterval(loopTimer.value);
    loading.value = true;
    noMatchList.value = false;
    const reqUrl =
      type === 'early' ? 'getMorningSetMatchList' : 'getRollingMatchList';
    const res = await API[reqUrl]({ ...removeEmptyStringKeys(searchForm) });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    if (!res.data.length) {
      loopTimer.value && clearInterval(loopTimer.value);
      return (noMatchList.value = true);
    }
    matchList.length = 0;
    const firstRenderList = res.data.slice(0, 1);
    matchList.push(...firstRenderList);
    Object.assign(currentMatch, matchList[0]?.matchDtoList[0]);
    //- 获取赛事盘口
    await getHandicapltems();
    //- 开启事件定时任务
    runLoopMatch();
    //- 后续列表填充
    res.data.slice(1).forEach(item => {
      setTimeout(() => matchList.push(item), 20);
    });
  };

  const getHandicapltems = async (noNprogress: boolean = false) => {
    const res = await API.getHandicapItems(
      { matchId: currentMatch.matchId },
      noNprogress
    );
    if (res.code) return message(res.msg, { type: 'error' });
    //- 检测是否比赛开始
    if (
      !checkisBeginMatch(
        res.data.status as 'countDown' | 'canceled' | 'over',
        res.data.beginTimeLong
      )
    ) {
      return clearTimeout(loopTimer.value);
    }
    //检测是否有盘数据返回
    checkHasData(res.data);

    const tempList = handicapList.slice(1);
    tempList.forEach(_ => {
      _.list = res.data[
        _.listType as keyof sportTradingDataAPI.getHandicapItemsData
      ] as sportTradingDataAPI.MainBetItemsDtoList[];
      _.amount = res.data[
        _.amountType as keyof sportTradingDataAPI.getHandicapItemsData
      ] as number;
      _.betItemsIdList = (
        res.data[
          _.listType as keyof sportTradingDataAPI.getHandicapItemsData
        ] as sportTradingDataAPI.MainBetItemsDtoList[]
      ).reduce((pre, next) => {
        pre.push(...next.betItemsIdList);
        return pre;
      }, [] as number[]);
    });

    //- 第一项单独处理
    handicapList[0].list = tempList.map(item => item.list).flat();
    handicapList[0].amount = tempList
      .map(item => item.amount)
      .reduce((pre, next) => pre + next);
    handicapList[0].betItemsIdList.length = 0;
    handicapList[0].list.forEach(item => {
      handicapList[0].betItemsIdList.push(...item.betItemsIdList);
      item.kindsCodeDtoList.forEach((_, i: number) => {
        _.betItemsDtoList.forEach(l => {
          if (l.kindsCode === 'FT_AH' && l.ctid === 0 && i === 0) {
            if (_.betItemsDtoList[0].handicap.startsWith('-')) {
              currentMatch.HandicapTeam = _.betItemsDtoList[0].homeOrAway;
            } else {
              currentMatch.HandicapTeam = _.betItemsDtoList[1].homeOrAway;
            }
          }
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
    handicapList[0] = JSON.parse(JSON.stringify(handicapList[0]));
  };

  //- 检测是否有盘数据
  const checkHasData = (d: sportTradingDataAPI.getHandicapItemsData) => {
    panIsEmpty.value = false;
    const arr: sportTradingDataAPI.MainBetItemsDtoList[] = [];
    Object.values(d).forEach(
      (v: keyof sportTradingDataAPI.getHandicapItemsData) => {
        if (Array.isArray(v)) {
          arr.push(...v);
        }
      }
    );
    if (!arr.length) panIsEmpty.value = true;
  };

  //- 检测是否开始比赛
  const checkisBeginMatch = (
    status: 'countDown' | 'canceled' | 'over',
    beginTimeLong: number
  ) => {
    matchStatus.value = status;
    matchStartTime.value = beginTimeLong;
    if (
      (beginTimeLong - Date.now() < 16000 && type === 'early') ||
      (type === 'in' && matchStatus.value === MATCH_STATUS.over) ||
      matchStatus.value === MATCH_STATUS.canceled
    ) {
      if (loopTimer.value) clearInterval(loopTimer.value);
      isShowDialog.value = true;
      return false;
    }
    return true;
  };

  const onCloseDialog = () => {
    isShowDialog.value = false;
    resetSearchForm();
    onSearch();
  };

  //- 重置表单
  const resetSearchForm = () => {
    Object.assign(searchForm, {
      sportId: 1,
      leagueNameOrId: '',
      matchNameOrId: '',
      startTime:
        type === 'early'
          ? dayjs()
              .set('hour', 12)
              .set('minute', 0)
              .set('second', 0)
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
      endTime:
        type === 'early'
          ? dayjs()
              .add(7, 'day')
              .set('hour', 12)
              .set('minute', 0)
              .set('second', 0)
              .format('YYYY-MM-DD HH:mm:ss')
          : ''
    });
  };

  //- 开启定时轮询任务
  const runLoopMatch = () => {
    if (loopTimer.value) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => {
      //- 轮询不现实进度条
      getHandicapltems(true);
    }, 5000);
  };

  //- 修改左侧选中比赛ID
  const changeSelectMatch = (data: sportTradingDataAPI.MatchDtoList) => {
    Object.assign(currentMatch, data);
    clearTimeout(loopTimer.value);
    getHandicapltems();
    selectContentType.value = 'mainBetItemsDtoList';
  };

  //- 修改内容部分导航标签分类
  const selectContentType = ref('mainBetItemsDtoList');
  const changeSelectType = (type: string) => {
    selectContentType.value = type;
  };

  //- 鼠标进入后清空定时器
  const clearMatchTime = (type: 1 | -1) => {
    if (type === 1) {
      clearInterval(loopTimer.value);
    } else {
      runLoopMatch();
    }
  };

  //-赛事盘口状态更新
  const riotPrevention = ref(false);
  const changeStatus = async ({
    status,
    classify,
    betItemsIdList,
    categoryData,
    item,
    matchId
  }: {
    status: Partial<SALE_STATUS>;
    classify: 'match' | 'category' | 'pan';
    betItemsIdList?: number[];
    categoryData?: sportTradingDataAPI.MainBetItemsDtoList;
    item?: handicapListType;
    matchId?: number;
  }) => {
    if (riotPrevention.value) return;
    riotPrevention.value = true;
    clearInterval(loopTimer.value);
    const res = await API.updateHandicapStatus({
      operateMenu: '操盘管理-早盘管理',
      matchId: matchId ? matchId : currentMatch.matchId,
      isSale: status,
      betItemsIds: betItemsIdList ?? []
    });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    runLoopMatch();
    riotPrevention.value = false;
    if (res.code) return;
    switch (classify) {
      case 'match':
        upateMatchSale(status, matchId as number);
      case 'pan':
        upatePanSale(
          status,
          categoryData as sportTradingDataAPI.MainBetItemsDtoList
        );
        break;
      case 'category':
        upatePalySale(status, item as handicapListType);
        break;
      default:
        break;
    }
  };

  //- 修改赛事图标状态
  const upateMatchSale = (status: number, m: number) => {
    currentMatch.isSale = status;
    matchList.some(item => {
      const r = item.matchDtoList.find(_ => _.matchId === m);
      if (r) {
        r.isSale = currentMatch.isSale;
        return true;
      } else return false;
    });
  };

  //- 修改盘赛事图标状态
  const upatePanSale = (
    status: number,
    categoryData: sportTradingDataAPI.MainBetItemsDtoList
  ) => {
    categoryData.isSale = status;
  };

  //- 修改玩法状态
  const upatePalySale = (status: number, item: handicapListType) => {
    item.isSale = status;
    item.list.forEach(item => (item.isSale = status));
  };

  //- 点击快捷键修改赔率
  const sendNewOdds = async (
    betItemsDtoList: { betItemsId: number; dpOdds: number }[]
  ) => {
    const res = await API.updateHandicapOdds({
      matchId: currentMatch.matchId,
      operateMenu: '操盘管理-早盘管理',
      betItemsDtoList
    });
    message(res.msg, { type: res.code ? 'error' : 'success' });
  };

  onMounted(() => {
    handicapList.forEach(item => {
      item.amount = 0;
      item.list = [];
    });
    if (loopTimer.value) clearInterval(loopTimer.value);
    onSearch();
  });

  onUnmounted(() => {
    if (loopTimer.value) clearInterval(loopTimer.value);
    handicapList.forEach(item => {
      item.amount = 0;
      item.list = [];
    });
  });

  return {
    loading,
    matchList,
    onSearch,
    searchForm,
    currentMatch,
    changeSelectMatch,
    handicapList,
    selectContentType,
    changeSelectType,
    clearMatchTime,
    changeStatus,
    sendNewOdds,
    noMatchList,
    matchStatus,
    matchStartTime,
    panIsEmpty,
    isShowDialog,
    onCloseDialog
  };
}
