import { useRiskNoticeStore } from '@/store/riskNotice';

export function useRiskNotice() {
  const riskNotificationRefresh = ref('30');
  const riskNotificationSwitch = ref(0);
  const riskNoticeStore = useRiskNoticeStore();

  async function getRiskNotification() {
    const res = await API.getRiskNotification();
    if (!res.code) {
      riskNotificationRefresh.value = res.data.riskNotificationRefresh!;
      riskNotificationSwitch.value = res.data.riskNotificationSwitch!;
    }
  }

  async function setRiskNotification() {
    const res = await API.setRiskNotification({
      riskNotificationRefresh: riskNotificationRefresh.value,
      riskNotificationSwitch: riskNotificationSwitch.value
    });

    if (!res.code) {
      await riskNoticeStore.setRiskNotice();
    }
  }

  onMounted(() => {
    getRiskNotification();
  });

  return {
    riskNotificationRefresh,
    riskNotificationSwitch,
    setRiskNotification,
  };
}
