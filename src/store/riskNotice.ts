import { defineStore } from 'pinia';

export const useRiskNoticeStore = defineStore('RISKNOTICESTATE', {
  state: ():RiskManagementDataAPI.RiskNotice => ({
    esportAuditCount: 0,
    jjAuditCount: 0,
    sportAuditCount: 0,
    delaySecond: 30,
  }),
  actions: {
    async setRiskNotice() {      

      const refresh = async() => {
        const riskNoticeRes = await API.getRiskNotice();
        this.esportAuditCount = riskNoticeRes.data.esportAuditCount;
        this.jjAuditCount = riskNoticeRes.data.jjAuditCount;
        this.sportAuditCount = riskNoticeRes.data.sportAuditCount;
      }
      await refresh();

      const interval = ref<NodeJS.Timeout>();
      if (interval.value) clearInterval(interval.value);
      interval.value = setInterval(async () => {
        console.log("hitt111");
        await refresh();
      }, Number(this.delaySecond) * 1000);      
    },
    setDelaySecond(second: number) {
      this.delaySecond = second;
    }
  },
  getters: {
    totalCount: (state) => Number(state.esportAuditCount) + Number(state.jjAuditCount) + Number(state.sportAuditCount)
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }]
  }
});