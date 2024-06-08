import { useRiskNoticeStore } from '@/store/riskNotice';

export function useRiskNotice() {
  const riskNotificationRefresh = ref('30');
  const riskNotificationSwitch = ref(0);
  const jjAuditCount = ref(0);
  const sportAuditCount = ref(0);
  const esportAuditCount = ref(0);
  const riskNoticeStore = useRiskNoticeStore();

  async function getRiskNotification() {
    const res = await API.getRiskNotification();
    if (!res.code) {
      riskNotificationRefresh.value = res.data.riskNotificationRefresh!;
      riskNotificationSwitch.value = res.data.riskNotificationSwitch!;
    }
  }

  async function getRiskNoticeAggregate() {
    const res = await API.getRiskNoticeAggregate();
    if (!res.code) {
      jjAuditCount.value = res.data.jjAuditCount!;
      sportAuditCount.value = res.data.sportAuditCount!;
      esportAuditCount.value = res.data.esportAuditCount!;
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
    getRiskNoticeAggregate();
  });

  return {
    riskNotificationRefresh,
    riskNotificationSwitch,
    setRiskNotification,
    jjAuditCount,
    sportAuditCount,
    esportAuditCount
  };
}
