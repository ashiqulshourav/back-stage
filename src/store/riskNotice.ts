import { defineStore } from 'pinia';

export const useRiskNoticeStore = defineStore('RISKNOTICESTATE', {
  state: ():RiskManagementDataAPI.RiskNotice => ({
    esportAuditCount: 0,
    jjAuditCount: 0,
    sportAuditCount: 0,
    riskNotificationRefresh: '30',
    riskNotificationSwitch: 0,
  }),
  actions: {
    async setRiskNotice() {      

      const riskNoticeRes = await API.getRiskNoticeAggregate();

        if (!riskNoticeRes.code) {
          // play sound
          if(this.esportAuditCount != riskNoticeRes.data.esportAuditCount ||
              this.jjAuditCount != riskNoticeRes.data.jjAuditCount ||
              this.sportAuditCount != riskNoticeRes.data.sportAuditCount) {
            const audio = new Audio('/src/assets/media/order.mp3');
            audio.play();
          }

          this.esportAuditCount = riskNoticeRes.data.esportAuditCount;
          this.jjAuditCount = riskNoticeRes.data.jjAuditCount;
          this.sportAuditCount = riskNoticeRes.data.sportAuditCount;   
        }       

        const res = await API.getRiskNotification();

        this.riskNotificationSwitch = res.data.riskNotificationSwitch;

    },
    setRiskNoticeRefreshSecond(second: string) {
      this.riskNotificationRefresh = second;
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
