import { message } from '@/utils/message';
import { WarningSearchFormType, handicapListType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { baseHandicapList, warningBaseList } from './baseData';
import type { PaginationProps } from '@pureadmin/table';
import { addDialog, closeDialog } from '@/components/ReDialog';
import MatchCountDown from '../com/MatchCountDown.vue';
import {
  BO_DAN_CODE_LIST,
  MATCH_STATUS,
  SALE_STATUS,
  icon_msg_tip,
  transferBoDanCol
} from './playMap';
import { ElMessageBox } from 'element-plus';

export function useWarningHook() {
  const loading = ref(true);
  const noMatchList = ref(false);
  const matchList = reactive<sportTradingDataAPI.getAlarmMatchListType[]>([]);
  const matchStatus = ref<'countDown' | 'canceled' | 'over'>('countDown');
  const matchStartTime = ref<number>();

  const handicapList = reactive<handicapListType[]>(baseHandicapList);
  const panIsEmpty = ref(false);
  const currentMatch = reactive<sportTradingDataAPI.MatchDtoList>(
    {} as sportTradingDataAPI.MatchDtoList
  );

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const searchForm = reactive<WarningSearchFormType>({
    sportId: 1,
    leagueNameOrId: '',
    matchNameOrId: '',
    startTime: '',
    endTime: ''
  });

  //- 初始化搜索
  const onSearch = async () => {
    loading.value = true;
    noMatchList.value = false;
    const res = await API.getAlarmMatchList({
      ...removeEmptyStringKeys(searchForm)
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    pagination.total = res.data.total;
    res.data.list.forEach((item: sportTradingDataAPI.getAlarmMatchListType) => {
      const baseDatat: typeof warningBaseList = JSON.parse(
        JSON.stringify(warningBaseList)
      );
      baseDatat.forEach(_ => {
        const arr =
          item.betItemsResultDto[
            _.listType as keyof sportTradingDataAPI.BetItemsResultDto
          ];
        arr.forEach((d: sportTradingDataAPI.MainListType) => {
          d.kindsCodeDtoList.forEach(_ => {
            _.betItemsDtoList.forEach(l => {
              if (!l.dpOdds) l.dpOdds = l.odds;
            });
          });
          // - 波胆单独处理
          if (BO_DAN_CODE_LIST.includes(d.kindsCode)) {
            transferBoDanCol(
              d as sportTradingDataAPI.MainBetItemsDtoList,
              currentMatch.homeTeamNameCn,
              currentMatch.awayTeamNameCn
            );
          }
        });
        _.list = arr;
      });
      item.renderList = baseDatat.filter(item => {
        return item.list.length;
      });
    });
    matchList.length = 0;
    matchList.push(...res.data.list);
  };

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    pagination,
    loading,
    matchList
  };
}
