import { defineStore } from 'pinia';
import { BetType } from './types';

export const useBetStore = defineStore('BETSTATE', {
  state: (): BetType => ({
    gameplayData: {
      matchId: '',
      betItemsId: ''
    }
  }),
  actions: {
    set_gameplay_data(d: Omit<BetType, 'gameplayData'>) {
      Object.assign(this.gameplayData, d)
    },
  },
});
