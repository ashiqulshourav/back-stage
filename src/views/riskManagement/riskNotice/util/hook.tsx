export function useRiskNotice() {
  const esportAuditCount = ref(0);
  const jjAuditCount = ref(0);
  const sportAuditCount = ref(0);

  async function getRiskNotice() {
    const res = await API.getRiskNotice();
    esportAuditCount.value = res.data.esportAuditCount;
    jjAuditCount.value = res.data.jjAuditCount;
    sportAuditCount.value = res.data.sportAuditCount;
  }

  //- 切换比赛类型
  onMounted(() => {
    getRiskNotice();
  });

  return {
    esportAuditCount,
    jjAuditCount,
    sportAuditCount,
    getRiskNotice
  }
}
