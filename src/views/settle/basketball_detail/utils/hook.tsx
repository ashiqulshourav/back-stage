import { message } from '@/utils/message';
import { t } from '@/plugins/i18n';
import { columns, MATCH_PERIOD, MATCH_PERIOD_TYPES } from './tableColumnList';
import { ElMessageBox } from 'element-plus';
export function useBilliardsHook() {
  const dataList = reactive<SattleDataAPI.basketballData[]>([]);
  const allSettleLoading = ref(false);
  const loading = ref(true);
  const boardType = ref('INNING');
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    {} as SattleDataAPI.getSettlementDataList
  );

  // - 初始化
  const onSearch = async () => {
    const res = await API.getBasketballEvents({
      matchId: history.state.params.matchId
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data);
  };

  //- 新增局
  const addEventRow = () => {
    if (dataList.length !==0 && boardType.value !== dataList[0].gameRule) {
      message(t('当前游戏方法不可用'), {
        type: 'error'
      });
      return;
    }
    const params: Partial<SattleDataAPI.BasketBallEventsData> = {
      eventTime: '',
      matchId: history.state.params.matchId,
      inningNum: dataList.length + 1,
      gameRule: boardType.value,
      isEdit: false,
      t1: '',
      t2: '',
      matchPeriod: MATCH_PERIOD[boardType.value][dataList.length + 1]
    };
    dataList.push(params as SattleDataAPI.volleyballData);
  };
  //- 结算局事件
  const settlementHandicap = async (row: SattleDataAPI.BasketBallEventsData) => {
    const { eventTime, t1, t2 } = row;
    if (!eventTime || !t1 || !t2 ) {
      return message(t('请先完成并保存事件'), { type: 'error' });
    }
    ElMessageBox.confirm(
      `
      <div class="text-center">
          <div class="flex  justify-between">
            <span class="w-[45%]">${
              history.state.params.homeTeamNameCn ?? '_'
            }</span>
            <span class="font-bold">VS</span>
            <span class="w-[45%]">${
              history.state.params.awayTeamNameCn ?? '_'
            }</span>
         </div>
          <div>${t1} ： ${t2}</div>
          <div>${t('手动结算后无法回退，请再次确定结果')}</div>
      </div>
      `,
      `${t('结算')} ${MATCH_PERIOD_TYPES[row.matchPeriod]}`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认结算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      loading.value = true;
      const params = {
        eventTime,
        t1: row.t1,
        t2: row.t2,
        gameRule: boardType.value,
        matchId: history.state.params.matchId,
        inningNum: row.inningNum,
        matchPeriod: MATCH_PERIOD[boardType.value][row.inningNum]  
      };
      try {
        const res = await API.addBasketballEvent(params);
        if (res.code) {
          loading.value = false;
          return message(res.msg, { type: 'error' })
        };
        loading.value = false;
        onSearch();
      } catch (error) {
        loading.value = false;
      }
    });
  };

  //- 全场结算
  const allSettleBtnClick = async () => {
    let s1 = 0;
    const scoreList = dataList.map(item => [item.t1, item.t2]);
    scoreList.forEach(item => { 
      s1 += Number(item[0]) - Number(item[1]);
    });
    if (
      dataList.length < 2 ||
      dataList.some(item => !item.id) ||
      s1 === 0 ||
      (dataList[0].gameRule === 'INNING' && dataList.length < 4) 
    ) {
      return message(t('请先完成盘结算'), { type: 'error' });
    }
    ElMessageBox.confirm(
      `
      <div class="text-center">
          <div>${t('手动确认比赛结束后，即开始结算')}</div>
          <div>${t('全场比赛玩法，结算后无法回退。')}</div>
      </div>
      `,
      t('确认比赛结算'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认结算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      try {
        allSettleLoading.value = true;
        const res = await API.allBasketballSettlement({
          matchId: history.state.params.matchId
        });
        allSettleLoading.value = false;
        if (res.code) return message(res.msg, { type: 'error' });
        getMatchDetail();
      } catch (error) {
        allSettleLoading.value = false;
      }
    });
  };

  //- 获取比赛详情
  const getMatchDetail = async () => {
    const res = await API.getPreSaleInfo({
      matchId: history.state.params.matchId
    });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(renderObj, res.data);
  };
  
  const checkNoMore = () => {
    let s1 = 0;
    const scoreList = dataList.map(item => [item.t1, item.t2]);
    scoreList.forEach(item => { 
      s1 += Number(item[0]) - Number(item[1]);
    });
    if (dataList.length === 0)
      return true;
    if (
      (dataList[0].gameRule === 'INNING' && dataList.length === 5) ||
      (dataList[0].gameRule === 'INNING' && dataList.length === 4 && s1 !== 0) ||
      (dataList[0].gameRule === 'HT' && dataList.length === 3) ||
      (dataList[0].gameRule === 'HT' && dataList.length ===2 && s1 !== 0) 
    ) {
      return false;
    }
    return true;
  }

  onMounted(() => {
    getMatchDetail();
    onSearch();
  });

  return {
    onSearch,
    loading,
    columns,
    dataList,
    boardType,
    checkNoMore,
    addEventRow,
    settlementHandicap,
    allSettleBtnClick,
    renderObj,
    allSettleLoading
  };
}
