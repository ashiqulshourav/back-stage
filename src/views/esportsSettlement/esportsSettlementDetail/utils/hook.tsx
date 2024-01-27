import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { usePublicHooks } from '@/hooks';
// import { useMatchStore } from '@/store/match';
import { parseCountry } from '@/utils/formatMatch';
import { SPORT_LEVEL_LIST_TYPE } from './type';
import { SPORT_LEVEL_LIST } from './map';
export function useEsportsSettlement() {
  const route = useRoute();
  const dataList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const renderObj = reactive<EsportsSettlementAPI.ESportMatchById>(
    {} as EsportsSettlementAPI.ESportMatchById
  );

  function handleTableWidthChange(val: number) {
    // pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    // pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    // if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const data = removeEmptyStringKeys(form);
    const res: SaleDataAPI.PreSaleListRes = await API.getMorningSets({
      ...data
      // pageSize: pagination.pageSize,
      // pageNum: pagination.currentPage
    });
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    // dataList.push(...res.data.list);
    // pagination.total = res.data.total;
    // pagination.pageSize = res.data.pageSize;
    // pagination.currentPage = res.data.pageNum;
    setTimeout(() => (loading.value = false), 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  //- 获取详情数据
  const getEsportMatchInfo = async () => {
    loading.value = true;
    const res = await API.getESportMatchById({
      matchId: +route.params.matchId
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    const keyList = Object.keys(res.data.betItemsMap);
    //- 清洗后端返回数据
    if (keyList.length) {
      keyList.forEach((key: string) => {
        const filterKey = key.replace(/^\["|"\]$/g, '');
        res.data.betItemsMap[filterKey] = res.data.betItemsMap[key];
        delete res.data.betItemsMap[key];
      });
    }
    Object.assign(renderObj, res.data);
    formatData();
  };

  const rList = reactive<SPORT_LEVEL_LIST_TYPE[]>([]);

  const formatData = () => {
    SPORT_LEVEL_LIST.forEach(item => {
      Object.keys(renderObj.betItemsMap).forEach(key => {
        if (item.key === key) {
          item.list = renderObj.betItemsMap[key];
          item.total = renderObj.betItemsMap[key].length;
        }
      });
    });
    rList.length = 0;
    rList.push(...SPORT_LEVEL_LIST.filter(_ => _.total));
    rList.forEach(item => {
      const l = item.list;
      l.sort((a: any, b: any) => a.displayIndex - b.displayIndex);
      const o = {};
      l.forEach(d => {
        if (!o[d.sourceBetItemsMid]) o[d.sourceBetItemsMid] = [];
        o[d.sourceBetItemsMid].push(d);
      });
      item.list.length = 0;
      Object.values(o).forEach(arr => {
        item.list.push({
          betOptions: -1,
          ...arr[0],
          arr
        });
      });
    });
    // console.log('hook.tsx文件 117==============行打印=', rList);
  };

  const manualSettleESportHandicapClick = async (
    row: EsportsSettlementAPI.BetItemsMapData
  ) => {
    if (row.betOptions < 0)
      return message(t('请先选择投注项'), { type: 'error' });
    const params = {
      matchId: row.matchId,
      betResultItems: row.arr.map((item, index) => {
        let betResult;
        if (index === 0) {
          betResult = row.betOptions === 0 ? 4 : 3;
        } else {
          betResult = row.betOptions === 1 ? 4 : 3;
        }
        return {
          betItemId: item.betItemsId,
          betResult,
          handicap: item.handicap,
          kindsCode: item.kindsCode
        };
      })
    };
    const res = await API.manualSettleESportHandicap(params);
    console.log('hook.tsx文件 134==============行打印=', res);
  };

  onMounted(() => {
    getEsportMatchInfo();
  });
  return {
    loading,
    dataList,
    onSearch,
    resetForm,
    handleTableWidthChange,
    switchLoadMap,
    handleCurrentChange,
    handleSelectionChange,
    switchStyle,
    renderObj,
    rList,
    manualSettleESportHandicapClick
  };
}
