import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { t } from '@/plugins/i18n';
import { columns, childColumns } from './tableColumnList';
import { dateSetSecond, getSecondTime } from '@/utils/formatDate';
import { YELLOW_OR_RED } from '@/utils/maps/sports_map';
import { useMatchStore } from '@/store/match';

export function useTennisDetailHook() {
  const dataList = reactive<SattleDataAPI.TennisEventsData[]>([]);
  const childloading = ref(true);
  const loading = ref(true);
  const childDataTotal = ref(0);
  const expandMatchList = reactive<number[]>([]);
  const loopTimer = ref<NodeJS.Timeout>();

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

  //- 获取当前展开行结算列表
  const getChildrenData = async row => {
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
          } else {
            _.eventTime = getSecondTime(_.eventTime, row.beginTime);
          }
          item.type === 'yellow_red_card' &&
            (_.redOrYellow = YELLOW_OR_RED[_.eventCode]);
        });
      }
    });
    if (loopTimer.value) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => getChildrenData(row), 10000);
  };

  const expandChange = () => {};

  //- 新增盘信息
  const addEventRow = row => {
    const params = {
      inningNum: 0,
      matchId: history.state.params.matchId,
      setNum: 1,
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
      ]
    };
    dataList.push(params);
  };

  //- 新增局
  const addChildRow = parentRow => {
    const prevIdx = parentRow.inningEvents.length - 1;
    if (
      !parentRow.inningEvents[prevIdx].t1 ||
      !parentRow.inningEvents[prevIdx].t2 ||
      !parentRow.inningEvents[prevIdx].eventTime ||
      parentRow.inningEvents[prevIdx].isEdit
    ) {
      return message('请先完成之前的事件结算', { type: 'error' });
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
    const inningEvents = parentRow.inningEvents.map(item => {
      delete item['isEdit'];
      return item;
    });
    const params = {
      eventTime:
        parentRow.inningEvents[parentRow.inningEvents.length - 1].eventTime,
      inningEvents,
      t1: 3,
      t2: 2,
      inningNum: 0,
      setNum: parentRow.setNum,
      matchId: history.state.params.matchId
    };
    const res = await API.addTennisEvent(params);
    console.log('hook.tsx文件 132==============行打印=', res);
  };

  onMounted(() => onSearch());

  return {
    onSearch,
    loading,
    columns,
    dataList,
    expandChange,
    expandMatchList,
    childloading,
    childColumns,
    addEventRow,
    addChildRow,
    settlementHandicap
  };
}
