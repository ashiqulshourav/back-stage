import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { childColumns, columns } from './tableColumnList';
import { MatchEventType, SearchFormType } from './type';
import {useSettleHistoryStoreHook} from "@/views/settle/settle_history/store";
export function useSettle() {
  const useSettleHistoryStore=useSettleHistoryStoreHook();
  const form = reactive<SearchFormType>({
    leagueId: '',
    matchId: '',
    status: '',
    startTime: '',
    endTime: ''
  });

  const dataList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const loading = ref(true);
  const childloading = ref(true);
  const switchLoadMap = ref({});
  const currentSportId = ref(1);
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

  //- 搜索初始化
  const onSearch = async (type?: 'reload', spoprtId?: number) => {
    console.log(5555,spoprtId)
    loopTimer.value && clearInterval(loopTimer.value);
    try {
      if (spoprtId) currentSportId.value = spoprtId;
      if (type === 'reload') {
        pagination.currentPage = 1;
        expandMatchList.length = 0;
        expandRowList.length = 0;
      }
      loading.value = true;
      const data = removeEmptyStringKeys(form);
      const res: SattleDataAPI.getSettlementListRes =
        await API.getSettlementHistory({
          ...data,
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage,
          sportId: useSettleHistoryStore.sportId,
        });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      dataList.forEach(
        _ =>
          (_.childrenData = [
            {
              type: MatchEventType.Goal,
              key: 'matchScoreRecordList',
              tableList: []
            },
            {
              type: MatchEventType.YellowRedCard,
              key: 'penaltyCardRecordList',
              tableList: []
            },
            {
              type: MatchEventType.Corner,
              key: 'cornerRecordList',
              tableList: []
            }
          ])
      );
      pagination.total = res.data.total;
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  };

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch('reload');
  };




  onMounted(() => onSearch());
  onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  });

  const reloadTable = async () => {
    await onSearch('reload');
    expandRowList.forEach(async row => {
      dataList.forEach(d => {
        if (d.matchId === row.matchId) d.childrenData = row.childrenData;
      });
    });
  };

  return {
    form,
    loading,
    childloading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleTableWidthChange,
    switchLoadMap,
    handleCurrentChange,
    childColumns,
    currentSportId,
    expandMatchList,
    reloadTable
  };
}
