import type { PaginationProps } from '@pureadmin/table';
import { childColumns, columns } from './tableColumnList';

export function useBasketballDetailHook() {
  const dataList = reactive<SattleDataAPI.BasketballEvent[]>([]);
  const currentMatch = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const matchId = ref(0);
  const loading = ref(true);
  const expandMatchList = reactive<number[]>([]);
  const expandRowList = reactive<SattleDataAPI.getSettlementDataList[]>([]);

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
    loading.value = false;
    const res: SattleDataAPI.getBasketballEventRes = await API.getBasketballEvents({ matchId: matchId.value });
    if (!res.code) {
      dataList.length = 0;
      dataList.push(...res.data);
    }
  };

  //- 获取当前展开行结算列表

  const expandChange = () => {};
  const getCurrentMatchDetail = async (matchId1: number) => {
    matchId.value = matchId1
    const res:SattleDataAPI.getSettlementListRes = await API.getSettlementList({ matchId: matchId.value });
    if (!res.code && res.data.list[0] !== undefined && res.data.list[0] !== null) {
      currentMatch.length = 0;
      currentMatch.push(res.data.list[0]);
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
    childColumns
  };
}
