import { defineStore } from 'pinia';
import sound from '@/assets/media/order_sound.mp3';

export const useRiskNoticeStore = defineStore('RISKNOTICESTATE', {
  state: (): RiskManagementDataAPI.RiskNotice => ({
    esportAuditCount: 0,
    jjAuditCount: 0,
    sportAuditCount: 0,
    riskNotificationRefresh: '30',
    riskNotificationSwitch: 0
  }),
  actions: {
    async setRiskNotice() {
      const riskNoticeRes = await API.getRiskNoticeAggregate();

      if (!riskNoticeRes.code) {
        const res = await API.getRiskNotification();

        this.riskNotificationSwitch = res.data.riskNotificationSwitch;

        if (this.riskNotificationSwitch) {
          const existingValue =
            Number(this.esportAuditCount) +
            Number(this.jjAuditCount) +
            Number(this.sportAuditCount);
          const newValue =
            Number(riskNoticeRes.data.esportAuditCount) +
            Number(riskNoticeRes.data.jjAuditCount) +
            Number(riskNoticeRes.data.sportAuditCount);
          console.log({ existingValue, newValue });
          // play sound
          if (newValue > existingValue) {
            const audio = new Audio(sound);
            audio.play();
          }
        }

        this.esportAuditCount = riskNoticeRes.data.esportAuditCount;
        this.jjAuditCount = riskNoticeRes.data.jjAuditCount;
        this.sportAuditCount = riskNoticeRes.data.sportAuditCount;
      }
    },
    setRiskNoticeRefreshSecond(second: string) {
      this.riskNotificationRefresh = second;
    }
  },
  getters: {
    totalCount: state =>
      Number(state.esportAuditCount) +
      Number(state.jjAuditCount) +
      Number(state.sportAuditCount)
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }]
  }
});
