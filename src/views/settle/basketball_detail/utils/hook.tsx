import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { childColumns, columns } from './tableColumnList';
import { dateSetSecond, getSecondTime } from '@/utils/formatDate';
import { YELLOW_OR_RED } from '@/utils/maps/sports_map';

export function useBasketballDetailHook() {
  const dataList = reactive<SattleDataAPI.BasketballEvent[]>([]);
  const currentMatch = reactive<SattleDataAPI.getSettlementDataList | {}>({});
  const matchId = ref(0);
  const childloading = ref(true);
  const loading = ref(true);
  const childDataTotal = ref(0);
  const expandMatchList = reactive<number[]>([]);
  const expandRowList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const loopTimer = ref<NodeJS.Timeout>();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1
  });

  const handleTableWidthChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    onSearch();
  };

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    expandMatchList.length = 0;
    expandRowList.length = 0;
    onSearch();
  };

  /** 搜索初始化 */
  const onSearch = async () => {
    childloading.value = false;
    loading.value = false;
    console.log('test', matchId.value);
    const res: SattleDataAPI.getBasketballEventRes = await API.getBasketballEvents({ matchId: matchId.value });
    if (!res.code) {
      console.log(res.data, 'test');
      dataList.length = 0;
      dataList.push(...res.data);
    }
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
  const getCurrentMatchDetail = async (matchId1: number) => {
    matchId.value = matchId1
    const res:SattleDataAPI.getSettlementListRes = await API.getSettlementList({ matchId: matchId.value });
    if (!res.code) {
      Object.assign(currentMatch, res.data.list[0]);
    }
  };

  return {
    onSearch,
    loading,
    columns,
    dataList,
    pagination,
    currentMatch,
    handleTableWidthChange,
    handleCurrentChange,
    expandChange,
    getCurrentMatchDetail,
    expandMatchList,
    childloading,
    childColumns
  };
}
