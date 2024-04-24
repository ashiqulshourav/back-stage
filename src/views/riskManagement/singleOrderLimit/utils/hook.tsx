import { message } from '@/utils/message';
import { reactive, ref, onMounted } from 'vue';
import { columns, columns2 } from '../component/TableColumnList';
import { ElMessageBox } from 'element-plus';

export function useOrderLimitHook() {
  const sportList = reactive<RiskManagementDataAPI.LimitListType[]>([]);
  const sourceSportList = reactive<RiskManagementDataAPI.LimitListType[]>([]);
  const delList = reactive<RiskManagementDataAPI.LimitListType[]>([]);
  const isEditSport = ref(false);
  const currentSportId = ref(0);
  const loading = ref(true);

  // 初始化
  async function onSearch() {
    loading.value = true;
    const res = await API.getGameLimitList(currentSportId.value);
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    sportList.length = 0;
    sourceSportList.length = 0;
    sportList.push(...res.data);
    sourceSportList.push(...res.data);
    loading.value = false;
  }
  const addSportItem = () => {
    sportList.push({
      leagueLevel: (sportList[sportList.length - 1]?.leagueLevel ?? 0) + 1,
      gameType: currentSportId.value,
      singleUserMaxWin: null,
      handicapSingleMaxWin: null,
      handicapWholeMaxBetMorning: null,
      handicapWholeMaxBetRolling: null,
      handicapHalfMaxBetMoring: null,
      handicapHalfMaxBetRolling: null,
      bigsmallSingleMaxWin: null,
      bigsmallWholeMaxBetMoring: null,
      bigsmallWholeMaxBetRolling: null,
      bigsmallHalfMaxBetMoring: null,
      bigsmallHalfMaxBetRolling: null,
      winSingleMaxWin: null,
      winWholeMaxBetMoring: null,
      winWholeMaxBetRolling: null,
      winHalfMaxBetMoring: null,
      winHalfMaxBetRolling: null,
      otherSingleMaxWin: null,
      otherMaxBetMoring: null,
      otherMaxBetRolling: null,
      esportSingleMaxWin: null,
      esportWholeMaxBetRolling: null,
      esportWholeMaxBetMoring: null,
      esportSingleMaxBetRolling: null,
      esportSingleMaxBetMoring: null,
      esportRoundMaxBetRolling: null,
      esportRoundMaxBetMoring: null,
    });
  }
  // 等级；修改
  const confirmSportClick = () => {
    ElMessageBox.confirm(t('确定要修改限额吗？'), t('警告'), {
      center: true
    }).then(async () => {
      loading.value = true;
      const res = await API.updateLevelLimit([...sportList, ...delList]);
      delList.length = 0;
      loading.value = false;
      isEditSport.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      onSearch();
    });
  };
  // 编辑取消
  const cancelSportEdit = () => {
    isEditSport.value = false;
    sportList.length = 0;
    sportList.push(...sourceSportList);
  };
  // 删除
  const delSportItem = () => {
    const item = sportList.pop();
    delList.push({ ...item, delFlag: 1 });
  };
  const changeType = (id: number) => {
    currentSportId.value = id;
    cancelSportEdit();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    columns2,
    sportList,
    onSearch,
    isEditSport,
    addSportItem,
    confirmSportClick,
    delSportItem,
    cancelSportEdit,
    currentSportId,
    changeType
  };
}
