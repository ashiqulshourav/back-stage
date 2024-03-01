import { message } from '@/utils/message';
import { t } from '@/plugins/i18n';
import { columns, MATCH_PERIOD } from './tableColumnList';
import { ElMessageBox } from 'element-plus';

export function useBilliardsHook() {
  const dataList = reactive<SattleDataAPI.rugbyData[]>([]);
  const allSettleLoading = ref(false);
  const loading = ref(true);
  const boardType = ref('HT');
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    {} as SattleDataAPI.getSettlementDataList
  );

  // - 初始化
  const onSearch = async () => {
    const res = await API.getRugbyEvents({
      matchId: history.state.params.matchId
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data);
  };

  //- 新增局
  const addEventRow = () => {
    
    if ((dataList.length > 0 && !dataList[dataList.length - 1].id))
      return message(t('请先结算之前的局赛事'), { type: 'error' });
    const params: Partial<SattleDataAPI.rugbyData> = {
      eventTime: '',
      matchId: history.state.params.matchId,
      inningNum: dataList.length === 2 ? 40 : dataList.length + 1,
      gameRule: boardType.value,
      isEdit: false,
      t1: '',
      t2: ''
    };
    dataList.push(params as SattleDataAPI.rugbyData);
  };

  //- 结算局事件
  const settlementHandicap = async (row: SattleDataAPI.rugbyData) => {
    const { eventTime, t1, t2, inningNum } = row;
    if (!eventTime || !t1 || !t2 ) {
      return message(t('请先完成并保存事件'), { type: 'error' });
    }
    let s1 = 0;
    let s2 = 0;
    dataList.forEach(item => {
      s1 += item.t1 as number;
      s2 += item.t2 as number;
    })
    if (
      t1 as number < 0 ||
      t2 as number < 0 ||
      (inningNum === 40 && s1 ===s2)
    ) {
      return message(t('无效值'), { type: 'error' });
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
      `${t('结算') + t(MATCH_PERIOD[inningNum])}`,
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
        inningNum: row.inningNum
      };
      try {
        const res = await API.addRugbyEvent(params);
        if (res.code) return message(res.msg, { type: 'error' });
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
    let s2 = 0;
    dataList.forEach(item => {
      s1 += item.t1 as number;
      s2 += item.t2 as number;
    })
    if (
      dataList.length < 2 ||
      dataList.some(item => !item.id) ||
      Math.abs(s1 - s2) < 1
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
        const res = await API.RugbyManualSettlementFullTime({
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

  onMounted(() => {
    getMatchDetail();
    onSearch();
  });
  const noMore = () => {
    let s1 = 0;
    let s2 = 0;
    dataList.forEach(item => {
      s1 += item.t1 as number;
      s2 += item.t2 as number;
    })
    if (
      dataList.length === 3 ||
      (dataList.length === 2 && s1 !== s2)
    ) {
      return true;
      }
    return false;
  }
  return {
    onSearch,
    loading,
    columns,
    dataList,
    noMore,
    addEventRow,
    settlementHandicap,
    allSettleBtnClick,
    renderObj,
    allSettleLoading
  };
}
