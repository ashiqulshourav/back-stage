import { message } from '@/utils/message';
import { reactive, ref } from 'vue';

export function useAppointmentHook() {
  const dataList = reactive<RiskManagementDataAPI.getLeagueConfigListType[]>([]);
  const loading = ref(true);

  async function onSearch(sportId: number) {
    try {
      loading.value = true;
      const res =
        await API.getLeagueConfigList({
          sportId: sportId
        });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
    } catch (error) {
      loading.value = false;
    }
  }

  const upateLeagueStatus = async (row: RiskManagementDataAPI.getLeagueConfigListType) => {
    const res = await API.updateLeagueConfig({
      id: row.id,
      reservationSwitch: row.reservationSwitch,
      updatedBy: row.updatedBy
    })
    message(res.msg, { type: res.code ? 'error' : 'success' })
    if (res.code) row.reservationSwitch = row.reservationSwitch === 0 ? 1 : 0
  }

  onMounted(() => {
    onSearch(1)
  })

  //- 游戏切换
  const changeNavType = (v: number) => onSearch(v)

  return {
    loading, dataList, onSearch, upateLeagueStatus,
    changeNavType
  };
}
