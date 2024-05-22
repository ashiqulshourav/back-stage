import { message } from '@/utils/message';
import { SearchFormType, handicapListType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { baseHandicapList } from './baseData';
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

export function useTradingHook(type: 'early' | 'in') {
  const loading = ref(true);
  const handicapLoading = ref(true);
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
    noMatchList.value = false;
    const reqUrl =
      type === 'early' ? 'getMorningSetMatchList' : 'getRollingMatchList';
    const res = await API[reqUrl]({ ...removeEmptyStringKeys(searchForm) });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    if (!res.data.length) return (noMatchList.value = true);
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
  const loopTimer = ref<NodeJS.Timeout>();
  const getHandicapltems = async (noLoading?: boolean) => {
    !noLoading && (handicapLoading.value = true);
    const res = await API.getHandicapItems({ matchId: currentMatch.matchId });
    handicapLoading.value = false;
    if (res.code) return;
    //- 检测是否比赛开始
    if (
      !checkisBeginMatch(
        res.data.status as 'countDown' | 'canceled' | 'over',
        res.data.beginTimeLong
      )
    ) {
      if (loopTimer) clearTimeout(loopTimer.value);
      return;
    }
    //检测是否有盘数据返回
    checkHasData(res.data);

    const tempList = handicapList.slice(1);
    tempList.forEach(_ => {
      const iconMap = {
        0: 0,
        2: 0,
        3: 0,
        4: 0
      };
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
        iconMap[next.isSale as keyof typeof iconMap] += 1;
        pre.push(...next.betItemsIdList);
        return pre;
      }, [] as number[]);

      Object.keys(iconMap).forEach(key => {
        if (
          iconMap[+key as keyof typeof iconMap] == _.list.length &&
          _.list.length > 0
        ) {
          _.isSale = +key;
        }
      });
    });

    //- 第一项单独处理
    const map = { 0: 0, 2: 0, 3: 0, 4: 0 };
    handicapList[0].list = tempList.map(item => item.list).flat();
    handicapList[0].amount = tempList
      .map(item => item.amount)
      .reduce((pre, next) => pre + next);
    handicapList[0].betItemsIdList.length = 0;
    handicapList[0].list.forEach(item => {
      handicapList[0].betItemsIdList.push(...item.betItemsIdList);
      map[item.isSale as keyof typeof map] += 1;
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

    Object.keys(map).forEach(key => {
      if (
        map[+key as keyof typeof map] == handicapList[0].list.length &&
        handicapList[0].list.length > 0
      ) {
        handicapList[0].isSale = +key;
      }
    });
    handicapList[0] = JSON.parse(JSON.stringify(handicapList[0]));
    //- 开启事件定时任务
    runLoopMatch();
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
      addDialog({
        class: 'count_down_dialog',
        width: '8%',
        center: true,
        closeOnClickModal: false,
        hideFooter: true,
        alignCenter: true,
        showClose: false,
        contentRenderer: ({ options, index }) =>
          h(MatchCountDown, {
            status: matchStatus.value,
            onCloseDialog: (_: boolean) => {
              closeDialog(options, index);
              onSearch();
            }
          })
      });
      return false;
    }
    return true;
  };

  //- 开启定时轮询任务
  const runLoopMatch = () => {
    if (loopTimer) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => {
      getHandicapltems(true);
    }, 5000);
  };

  //- 修改左侧选中比赛ID
  const changeSelectMatch = (data: sportTradingDataAPI.MatchDtoList) => {
    Object.assign(currentMatch, data);
    clearTimeout(loopTimer.value);
    getHandicapltems();
  };

  //- 修改内容部分导航标签分类
  const selectContentType = ref('all');
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
  const changeStatus = ({
    status,
    classify,
    betItemsIdList,
    categoryData,
    item
  }: {
    status: Partial<SALE_STATUS>;
    classify: 'match' | 'category' | 'pan';
    betItemsIdList?: number[];
    categoryData?: sportTradingDataAPI.MainBetItemsDtoList;
    item?: handicapListType;
  }) => {
    clearInterval(loopTimer.value);
    ElMessageBox.confirm(icon_msg_tip[status], t('系统提示'), {
      confirmButtonText: t('确定'),
      cancelButtonText: t('取消'),
      type: 'warning',
      center: true
    })
      .then(async () => {
        const res = await API.updateHandicapStatus({
          operateMenu: '操盘管理-早盘管理',
          matchId: currentMatch.matchId,
          isSale: status,
          betItemsIds: betItemsIdList ?? []
        });
        message(res.msg, { type: res.code ? 'error' : 'success' });
        runLoopMatch();
        if (res.code) return;
        switch (classify) {
          case 'match':
            upateMatchSale(status);
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
      })
      .catch(() => runLoopMatch());
  };

  //- 修改赛事图标状态
  const upateMatchSale = (status: number) => {
    currentMatch.isSale = status;
    matchList.some(item => {
      const r = item.matchDtoList.find(_ => _.matchId === currentMatch.matchId);
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
    onSearch();
  });

  onUnmounted(() => {
    if (loopTimer) clearInterval(loopTimer.value);
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
    changeSelectType,
    clearMatchTime,
    changeStatus,
    sendNewOdds,
    noMatchList,
    matchStatus,
    matchStartTime,
    panIsEmpty
  };
}
