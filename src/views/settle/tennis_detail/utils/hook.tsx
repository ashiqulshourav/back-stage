import { message } from '@/utils/message';
import { t } from '@/plugins/i18n';
import { columns, childColumns } from './tableColumnList';
import { ElMessageBox } from 'element-plus';

export function useTennisDetailHook() {
  const dataList = reactive<SattleDataAPI.TennisEventsData[]>([]);
  const childloading = ref(true);
  const loading = ref(true);
  const expandMatchList = reactive<number[]>([]);
  const t1Score = ref(0);
  const t2Score = ref(0);
  const canSettlement = ref(false);

  /** 搜索初始化 */
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
          t1: 0,
          t2: 0,
          eventTime: '',
          isEdit: false
        }
      ] as SattleDataAPI.InningEvent[]
    };
    dataList.push(params as any);
  };

  //- 新增局
  const addChildRow = parentRow => {
    const prevIdx = parentRow.inningEvents.length - 1;
    if (
      prevIdx > -1 &&
      (!parentRow.inningEvents[prevIdx].t1 ||
        !parentRow.inningEvents[prevIdx].t2 ||
        !parentRow.inningEvents[prevIdx].eventTime ||
        parentRow.inningEvents[prevIdx].isEdit)
    ) {
      return message(t('请选保存之前的事件'), { type: 'error' });
    }
    parentRow.inningEvents.push({
      inningNum: parentRow.inningEvents.length + 1,
      matchId: history.state.params.matchId,
      setNum: parentRow.setNum,
      t1: 0,
      t2: 0,
      eventTime: '',
      isEdit: false
    });
  };

  //- 结算盘
  const settlementHandicap = async parentRow => {
    ElMessageBox.confirm('确定要增加一条事件么?', t('警告'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
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

  const deleteChildItem = (list: SattleDataAPI.InningEvent[]) => {
    list.pop();
  };

  onMounted(() => onSearch());

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
    deleteChildItem,
    t1Score,
    t2Score,
    canSettlement
  };
}
