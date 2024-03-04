import { message } from '@/utils/message';
import { childColumns } from './tableColumnList';
import { SearchFormType } from './type';
// import { compareTime } from '@/utils/formatDate';
import { ElMessageBox } from 'element-plus';
import { NEW_ROW_TYPE } from './map';

export function useNewBasketBallHook() {
  const eventList = reactive<SattleDataAPI.newBasketballEventsList[]>([]);
  const loading = ref(false);
  const switchLoadMap = ref({});
  const childDataTotal = ref(0);
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
  const addChildRow = () => {
    const isSettle = eventList.some(item => item.settleTimes === 0);
    if (
      (eventList.length !== 0 && !eventList[eventList.length - 1]?.id) ||
      isSettle
    ) {
      message('请先完成之前的事件结算', { type: 'error' });
    } else {
      const tempList = {
        settleTimes: 0,
        // eventTime: '',
        t1: '',
        t2: '',
        settleType: 1,
        isEdit: false,
        isSave: false,
        periodType: renderObj.periodType,
        matchPeriodId:
          NEW_ROW_TYPE[renderObj.periodType][eventList.length.toString()]
      };
      eventList.push(
        tempList as unknown as SattleDataAPI.newBasketballEventsList
      );
    }
  };
  //- 当前行编辑
  const editChild = (row: SattleDataAPI.newBasketballEventsList) => {
    row.isEdit = true;
  };

  //- 是否输入了完整的内容
  const isTheFormComplete = row => {
    const requireDdata = {
      t1: row.t1,
      t2: row.t2
      // eventTime: row.eventTime
    };
    return !Object.keys(requireDdata).every(key => {
      return key === 't1' || key === 't2'
        ? parseInt(requireDdata[key]) >= 0
        : requireDdata[key];
    });
  };

  //- 新增事件
  const handleChildrenData = async (
    row: SattleDataAPI.newBasketballEventsList,
    type: string
  ) => {
    if (isTheFormComplete(row)) {
      return message(t('请输入完整的内容'), { type: 'error' });
    }
    if (type === 'save') {
      if (row.t1 === row.t2 && row.matchPeriodId === 40) {
        message(t('结束局比分不能为平局'), { type: 'error' });
      } else {
        row.isEdit = false;
        row.isSave = true;
      }
      return;
    }

    const params: SattleDataAPI.addBasketballEventV2ReqType = {
      eventTime: 0,
      // eventTime:
      //   renderObj.beginTimeLong +
      //   compareTime(dayjs(row.eventTime).format('HH:mm:ss')) * 1000,
      matchId: renderObj.matchId,
      matchPeriodId: row.matchPeriodId,
      t1: +row.t1,
      t2: +row.t2
    };

    ElMessageBox.confirm('确定要增加一条事件么?', t('警告'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      loading.value = true;
      const res = await API.addBasketballEventV2(params);
      loading.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      getEventList();
    });
  };

  //- 初始化联赛
  const initMatchData = async () => {
    const res = await API.getPreSaleInfo({
      matchId: +history.state.params.matchId
    });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(renderObj, res.data);
    getEventList();
  };

  //- 获取事件列表
  const getEventList = async () => {
    loopTimer.value && clearInterval(loopTimer.value);
    loading.value = true;
    const res = await API.getNewBasketballEvents({
      matchId: renderObj.matchId
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    res.data.list.forEach(item => {
      item.periodType = renderObj.periodType;
    });
    eventList.length = 0;
    eventList.push(...res.data.list);
    //- 开启轮训
    if (renderObj.settlementType === 1) {
      loopTimer.value = setInterval(() => getEventList(), 10000);
    }
  };

  onMounted(() => {
    initMatchData();
  });

  onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  });

  const reloadTable = async () => {};

  //- 开启人工结算
  const changeSettleType = async () => {
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
      const res = await API.setManualMatchStatus({
        matchId: renderObj.matchId
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      loopTimer.value && clearInterval(loopTimer.value);
      initMatchData();
    });
  };

  //- 取消结算事件
  const cancelMatchEvent = async id => {
    ElMessageBox.confirm('确定要取消该事件么?', t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      const res = await API.basketballCancelMatchEvent({
        id,
        matchId: renderObj.matchId
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      getEventList();
    });
  };

  //- 全场结算事件
  const allSettleBtnClick = async () => {
    ElMessageBox.confirm('确定要全场结算么?', t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      const res = await API.v2ManualSettlementFullTime({
        matchId: renderObj.matchId
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      initMatchData();
    });
  };

  return {
    loading,
    eventList,
    form,
    switchLoadMap,
    childColumns,
    addChildRow,
    editChild,
    balanceLoading,
    handleChildrenData,
    childDataTotal,
    reloadTable,
    changeSettleType,
    cancelMatchEvent,
    renderObj,
    allSettleBtnClick
  };
}
