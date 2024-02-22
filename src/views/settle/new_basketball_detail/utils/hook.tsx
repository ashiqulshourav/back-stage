import { message } from '@/utils/message';
import { t } from '@/plugins/i18n';
import { childColumns } from './tableColumnList';
import { SPORT_TYPE, SearchFormType, TempListType } from './type';
import { compareTime, dateSetSecond } from '@/utils/formatDate';
import { ElMessageBox, dayjs } from 'element-plus';
import { YELLOW_OR_RED } from '@/utils/maps/sports_map';

export function useNewBasketBallHook() {
  const dataList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const childloading = ref(true);
  const allSettleLoading = ref(false);
  const switchLoadMap = ref({});
  const childDataTotal = ref(0);
  const expandMatchList = reactive<number[]>([]);
  const expandRowList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const loopTimer = ref<NodeJS.Timeout>();
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    {} as SattleDataAPI.getSettlementDataList
  );
  const form = ref<SearchFormType>({} as SearchFormType);
  const balanceLoading = reactive<{ half: boolean; all: boolean }>({
    half: false,
    all: false
  });

  //- 人工结算新增一行
  const addChildRow = (tableList, type) => {
    const isSettle = tableList.some(item => item.settleTimes === 0);
    if (
      (tableList.length !== 0 &&
        !tableList[tableList.length - 1]?.isBackEndReturnData) ||
      isSettle
    ) {
      message('请先完成之前的事件结算', { type: 'error' });
    } else {
      loopTimer.value && clearInterval(loopTimer.value);
      const tempList: TempListType = {
        eventTime: '',
        homeAway: null,
        matchPeriodId: null,
        isBackEndReturnData: false,
        t1: null,
        t2: null,
        eventCode: type
      };
      type === 'yellow_red_card' && (tempList.redOrYellow = 2);
      tableList.push(tempList);
    }
  };

  //- 当前行编辑
  const editChild = (row: SattleDataAPI.MatchEventsList) => (row.isEdit = true);

  //- 获取当前展开行结算列表
  const initListData = async row => {
    childloading.value = true;
    const res = await API.getMatchEvents({ matchId: row.matchId });
    childloading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    childDataTotal.value = 0;
    row.childrenData.forEach((item: SaleDataAPI.ChildrenDataList) => {
      item.tableList = res.data[item.key];
      childDataTotal.value += item.tableList.length;
      if (item.tableList.length) {
        item.tableList.forEach(_ => {
          _.createdAt = new Date(_.createdAt).getTime() + 1000 * 60 * 5;
          _.isEdit = false;
          _.isSave = false;
          _.isShowCount = false;
          _.matchId = row.matchId;
          _.t = res.ts;
          _.isBackEndReturnData = true;
          if (_.eventTime.toString().length < 10) {
            _.eventTime = dateSetSecond(_.eventTime as number);
          } /*  else {
            _.eventTime = getSecondTime(_.eventTime, row.beginTime);
          } */
          item.type === 'yellow_red_card' &&
            (_.redOrYellow = YELLOW_OR_RED[_.eventCode]);
        });
      }
    });
    if (loopTimer.value) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => initListData(row), 10000);
  };

  //- 是否输入了完整的内容
  const isTheFormComplete = row => {
    const requireDdata = {
      t1: row.t1,
      t2: row.t2,
      eventCode: row.eventCode,
      eventTime: row.eventTime,
      sportId: SPORT_TYPE.football,
      matchPeriodId: row.matchPeriodId,
      homeAway: row.homeAway
    };
    return !Object.keys(requireDdata).every(key => {
      return key === 't1' || key === 't2'
        ? parseInt(requireDdata[key]) >= 0
        : requireDdata[key];
    });
  };

  //- 新增事件
  const handleChildrenData = async (
    row: SattleDataAPI.MatchEventsList,
    parentIndex: number,
    type: 'save' | 'upload',
    parentRow
  ) => {
    if (isTheFormComplete(row)) {
      return message(t('请输入完整的内容'), { type: 'error' });
    }
    if (type === 'save') {
      row.isSave = true;
      row.isEdit = false;
      return;
    }
    if (((type === 'upload' && !row.isSave) || row.isEdit) && !row.id) {
      return message(t('请先保存事件'), { type: 'error' });
    }

    //- 单独处理红黄牌
    const eventCode =
      row.eventCode === 'yellow_red_card'
        ? row.redOrYellow === 1
          ? 'yellow_card'
          : 'red_card'
        : row.eventCode;

    const params: SattleDataAPI.MatchEventParams = {
      canceled: 0,
      eventCode,
      eventTime:
        parentRow.beginTimeLong +
        compareTime(dayjs(row.eventTime).format('HH:mm:ss')) * 1000,
      homeAway: row.homeAway,
      matchId: dataList[parentIndex].matchId,
      matchPeriodId: +row.matchPeriodId,
      player1Name: row.player1Name,
      dataSourceCode: 'SK',
      sourceType: 1,
      sportId: SPORT_TYPE.football,
      t1: +row.t1,
      t2: +row.t2,
      id: row.id ?? null
    };

    ElMessageBox.confirm('确定要增加一条事件么?', t('警告'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      childloading.value = true;
      const res = await API.addMatchEvent(params);
      childloading.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      row.isEdit = false;
      initListData(parentRow);
      reloadCurrentMatch(row.matchId, 'unSettlementEvents');
    });
  };

  //- 重新渲染赛事更新外层列表
  const reloadCurrentMatch = async (matchId: number, type: string) => {
    const r = await API.getSettlementList({ matchId });
    dataList.some(item => {
      if (item.matchId === r.data.list[0].matchId) {
        item[type] = r.data.list[0][type];
        return true;
      }
      return false;
    });
  };

  //- 结算
  const settlementFunction = async (matchId: number, type: 'half' | 'all') => {
    try {
      balanceLoading[type] = true;
      const res = await API[
        type === 'half' ? 'firstHalfSettlement' : 'allSettlement'
      ]({ matchId });

      balanceLoading[type] = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      const row = dataList.find(_ => _.matchId === matchId);
      initListData(row);
    } catch (error) {
      balanceLoading[type] = false;
    }
  };

  //- 初始化联赛
  const route = useRoute();
  const initMatchList = async () => {
    const res = await API.getPreSaleInfo({
      matchId: +route.params.matchId
    });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(renderObj, res.data);
  };

  onMounted(() => {
    initMatchList();
  });
  onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  });

  const reloadTable = async () => {
    expandRowList.forEach(async row => {
      await initListData(row);
      dataList.forEach(d => {
        if (d.matchId === row.matchId) d.childrenData = row.childrenData;
      });
    });
  };

  //- 自动结算转手动结算
  const changeSettleType = async matchId => {
    ElMessageBox.confirm(
      `${t('一但此赛事开启人工结算模式，无法关闭')}<br/>${t(
        '后面只能以人工录入事件，无法自动化推送数据商事件'
      )}
      `,
      t('警告'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认开启'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      const res = await API.setManualMatchStatus({ matchId });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      const row = dataList.find(_ => _.matchId === matchId);
      initListData(row);
      reloadCurrentMatch(row.matchId, 'settlementType');
    });
  };

  const advanceSettlement = async (row, parentRow) => {
    ElMessageBox.confirm('确定要提前结算么?', t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      const res = await API.addMatchEvent({ id: row.id });
      childloading.value = false;
      row.isShowCount = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      initListData(parentRow);
    });
  };

  //- 取消结算事件
  const cancelMatchEvent = async (
    id: number,
    matchId: number,
    settleTimes: number
  ) => {
    ElMessageBox.confirm('确定要取消该事件么?', t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      const res = await API.cancelMatchEvent({
        id,
        matchId,
        remark: settleTimes === 0 ? '未结算' : '已结算'
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      const row = dataList.find(_ => _.matchId === matchId);
      initListData(row);
      reloadCurrentMatch(row.matchId, 'settlementType');
    });
  };

  //- todo
  const allSettleBtnClick = () => {};

  return {
    childloading,
    allSettleLoading,
    dataList,
    form,
    switchLoadMap,
    childColumns,
    initListData,
    addChildRow,
    editChild,
    balanceLoading,
    settlementFunction,
    handleChildrenData,
    childDataTotal,
    expandMatchList,
    reloadTable,
    changeSettleType,
    cancelMatchEvent,
    advanceSettlement,
    renderObj,
    allSettleBtnClick
  };
}
