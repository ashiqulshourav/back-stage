import { searchFormType } from './types';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { message } from '@/utils/message';
import { addThousandSeparator } from '@/utils/formatNumber';
import { usePublicHooks } from '@/hooks';
const { exportDialog } = usePublicHooks();
import { columns } from '../component/TableColumnList';

export function useOddsHistoryDetailHook() {
  const matchEventList = reactive<EventAPI.MatchEvent[]>([]);
  const matchInfo = reactive<EventAPI.MatchInfo>({
    aTeamName: '',
    hTeamName: '',
    league: '',
    matchId: '',
    level: '',
    sportName: '',
    riskLevel: '',
    leagueId: '',
    startDateTime: ''
  });
  const loading = ref(false);

  const pagination = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [5, 10, 15, 20]
  });

  const vxeTableRef = ref();
  const tableData = ref([]);

  async function onSearch(type?: string) {
    loading.value = true;
    // 模拟数据
    const mockList = [];
    for (let index = 0; index < 5000; index++) {
      mockList.push({
        id: index,
        name: 'Test' + index,
        role: 'Developer123122312321',
        sex: '男'
      });
    }
    pagination.total = 50000;
    tableData.value = mockList;
    console.log('hook.tsx文件 58==============行打印=', tableData);
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const handlePageChange = ({ currentPage, pageSize }) => {
    pagination.currentPage = currentPage;
    pagination.pageSize = pageSize;
    onSearch();
  };

  const changeColumn = () => {
    columns1.value[0].visible = !columns1.value[0].visible;
    console.log('pageList.vue文件 96==============行打印=', columns1.value);
    vxeTableRef.value.refreshColumn();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    pagination,
    tableData,
    vxeTableRef,
    onSearch,
    changeColumn,
    matchEventList,
    handlePageChange,
    matchInfo,
    columns
  };
}
