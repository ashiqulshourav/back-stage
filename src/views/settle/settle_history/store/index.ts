import { defineStore } from 'pinia';
import {store} from "@/store";
export const useSettleHistoryStore = defineStore('SETTLEHISTORYSTATE', {
  state: (): {sportId:number} => ({
    sportId: 1,
  }),
  getters: {
    getSportId(state) {
      return state.sportId;
    },
  },
  actions: {
    setSportId(sportId:number){
      this.sportId = sportId;
    }
  },
});

export function useSettleHistoryStoreHook() {
  return useSettleHistoryStore(store);
}
