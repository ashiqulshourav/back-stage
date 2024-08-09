import { searchFormType } from './types';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { message } from '@/utils/message';
import { addThousandSeparator } from '@/utils/formatNumber';
import { usePublicHooks } from '@/hooks';
const { exportDialog } = usePublicHooks();
import { columns } from '../component/TableColumnList';

export function useOddsHistoryDetailHook() {
  const list = reactive<EventAPI.getMatchEventWithOddsHistoryResData[]>([]);
  const route = useRoute();
  const loading = ref(false);

  const vxeTableRef = ref();
  const tableData = ref([]);

  const selectData = reactive<EventAPI.getMatchEventWithOddsHistoryReqType>({
    matchId: '316066' /*  route.params.type as string */,
    dataSourceCode: ['XJ'],
    oddsType: 'OU',
    kindsCode: 'FT_1X2'
  });

  async function onSearch() {
    loading.value = true;
    const res = await API.getMatchEventWithOddsHistory({
      ...selectData,
      dataSourceCode: (selectData.dataSourceCode as string[]).join('')
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    list.length = 0;
    list.push(...res.data);
    // const mockList = [];
    // for (let index = 0; index < 5000; index++) {
    //   mockList.push({
    //     id: index,
    //     name: 'Test' + index,
    //     role: 'Developer123122312321',
    //     sex: '男'
    //   });
    // }
    // pagination.total = 50000;
    // tableData.value = mockList;
    // console.log('hook.tsx文件 58==============行打印=', tableData);
    // setTimeout(() => {
    //   loading.value = false;
    // }, 500);
  }

  const changeColumn = () => {
    columns1.value[0].visible = !columns1.value[0].visible;
    console.log('pageList.vue文件 96==============行打印=', columns1.value);
    vxeTableRef.value.refreshColumn();
  };

  onMounted(() => init());

  const init = async () => {
    await getMatchDetail();
    onSearch();
  };

  const matchDetail = reactive<EventAPI.oddsHistoryMatchDetailData>(
    {} as EventAPI.oddsHistoryMatchDetailData
  );
  const getMatchDetail = async () => {
    const matchId = +route.params.type;
    const res = await API.oddsHistoryMatchDetail({ matchId });
    if (res.code) return;
    Object.assign(matchDetail, res.data);
  };

  const changeList = (d: { type: string; val: string }) => {
    if (d.type === 'kindsCode') {
    } else if (d.type === 'odds') {
    }
    console.log('hook.tsx文件 76==============行打印=', d);
  };

  return {
    loading,
    tableData,
    vxeTableRef,
    onSearch,
    changeColumn,
    matchDetail,
    columns,
    selectData,
    list,
    changeList
  };
}
