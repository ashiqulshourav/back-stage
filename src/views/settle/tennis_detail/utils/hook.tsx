import { message } from '@/utils/message';
import { t } from '@/plugins/i18n';
import { columns, childColumns } from './tableColumnList';
import { ElMessageBox } from 'element-plus';
import { isNumber } from '@pureadmin/utils';

export function useTennisDetailHook() {
  const dataList = reactive<SattleDataAPI.TennisEventsData[]>([]);
  const childloading = ref(true);
  const loading = ref(true);
  const expandMatchList = reactive<number[]>([]);
  const t1Score = ref(0);
  const t2Score = ref(0);
  const canSettlement = ref(false);
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    {} as SattleDataAPI.getSettlementDataList
  );

  // - 初始化
  const onSearch = async () => {
    const res = await API.getTennisEvents({
      matchId: history.state.params.matchId
    });
    childloading.value = false;
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data);
  };

  //- 新增盘信息
  const addEventRow = () => {
    if (dataList.length > 0 && !dataList[dataList.length - 1].id) {
      return message(t('请先结算上一盘'), { type: 'error' });
    }
    const params: Partial<SattleDataAPI.TennisEventsData> = {
      inningNum: 0,
      matchId: history.state.params.matchId,
      setNum: dataList.length + 1,
      t1: 0,
      t2: 0,
      inningEvents: [
        {
          inningNum: 1,
          matchId: history.state.params.matchId,
          setNum: 0,
          t1: '',
          t2: '',
          eventTime: '',
          isEdit: false
        }
      ] as SattleDataAPI.InningEvent[]
    };
    dataList.push(params as any);
  };

  //- 新增局
  const addChildRow = parentRow => {
    const noEmpty = parentRow.inningEvents.every(
      item =>
        isNumber(+item.t1) &&
        isNumber(+item.t2) &&
        item.eventTime &&
        !item.isEdit
    );

    if (!noEmpty)
      return message(t('请先完成并保存之前的事件'), { type: 'error' });

    parentRow.inningEvents.push({
      inningNum: parentRow.inningEvents.length + 1,
      matchId: history.state.params.matchId,
      setNum: parentRow.setNum,
      t1: '',
      t2: '',
      eventTime: '',
      isEdit: false
    });
  };

  //- 结算盘
  const settlementHandicap = async parentRow => {
    ElMessageBox.confirm(
      `
      <div>
          <div>${history.state.params.homeTeamNameCn ?? '_'}VS${
        history.state.params.awayTeamNameCn ?? '_'
      }</div>
          <div>${t1Score.value}局 ： ${t2Score.value}局</div>
          <div>${t('手动结算后无法回退，请再次确定结果')}</div>
      </div>
      `,
      `${t('结算第')}${parentRow.setNum}${t('盘')}`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认结算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      const inningEvents = parentRow.inningEvents.map(item => {
        delete item['isEdit'];
        return item;
      });
      const params = {
        eventTime:
          parentRow.inningEvents[parentRow.inningEvents.length - 1].eventTime,
        inningEvents,
        t1: t1Score.value,
        t2: t2Score.value,
        inningNum: 0,
        setNum: parentRow.setNum,
        matchId: history.state.params.matchId
      };
      const res = await API.addTennisEvent(params);
      if (res.code) return message(res.msg, { type: 'error' });
      onSearch();
    });
  };

  onMounted(() => {
    getMatchDetail();
    onSearch();
  });

  //- 全场结算
  const allSettleBtnClick = async () => {
    let s1 = 0;
    let s2 = 0;
    const scoreList = dataList.map(item => [item.t1, item.t2]);
    scoreList.forEach(item => (item[0] > item[1] ? ++s1 : ++s2));
    if (dataList.length < 2 || Math.abs(s1 - s2) < 1) {
      return message(t('请先完成结算'), { type: 'error' });
    }
    ElMessageBox.confirm(
      `
      <div>
          <div>手动确认比赛结束后，即开始结算</div>
          <div>全场比赛玩法，结算后无法回退。</div>
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
      const res = await API.manualSettlementFullTime({
        matchId: history.state.params.matchId
      });
      if (res.code) return message(res.msg, { type: 'error' });
      getMatchDetail();
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

  return {
    onSearch,
    loading,
    columns,
    dataList,
    expandMatchList,
    childloading,
    childColumns,
    addEventRow,
    addChildRow,
    settlementHandicap,
    t1Score,
    t2Score,
    canSettlement,
    allSettleBtnClick,
    renderObj
  };
}
