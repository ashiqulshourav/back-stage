import { message } from '@/utils/message';
import { WarningSearchFormType, handicapListType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { baseHandicapList } from './baseData';
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
  const matchStatus = ref<'countDown' | 'canceled' | 'over'>('countDown');
  const matchStartTime = ref<number>();
  const matchList = reactive<sportTradingDataAPI.getMorningSetMatchListData[]>(
    []
  );
  const handicapList = reactive<handicapListType[]>(baseHandicapList);
  const panIsEmpty = ref(false);
  const currentMatch = reactive<sportTradingDataAPI.MatchDtoList>(
    {} as sportTradingDataAPI.MatchDtoList
  );

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
    if (res.code) return message(res.msg, { type: 'error' });
    console.log('warning_hook.tsx文件 42==============行打印=', res);
  };

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm
  };
}
