<template>
  <div class="main">
    <SearchForm :form="form" @resetForm="resetForm" @onSearch="onSearch" />
    <SportTypeNav
      @changeCurrentComponentName="changeCurrentComponentName"
      :currentSportId="currentSportId"
    />
    <component
      :is="currentComponentName.name"
      ref="componentStrName"
      :form="form"
    ></component>
  </div>
</template>

<script setup lang="ts">
import SearchForm from './component/SearchForm.vue';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import SportTypeNav from './component/SportTypeNav.vue';
import FootBall from './component/FootBall/index.vue';
import BasketBall from './component/Basketball/index.vue';
import Tennis from './component/Tennis/index.vue';
import Handball from './component/Handball/index.vue';
import Volleyball from './component/Volleyball/index.vue';
import IceHockey from './component/IceHockey/index.vue';
import PingPong from './component/PingPong/index.vue';
import Badminton from './component/Badminton/index.vue';
import Billiards from './component/Billiards/index.vue';
import { useSettingStoreHook } from '@/store/settings';
import { useMatchStore } from '@/store/match';
import { SearchFormType } from './utils/type';


defineOptions({ name: 'SETTLE_SETTLE_HISTORY' });
const componentStrName = ref<any>('FootBall');
const settingStore = useSettingStoreHook();
const currentSportId = ref<number>(
  settingStore.settleHistoryPageInfo.matchType ?? 1
);

const form = reactive<SearchFormType>({
  leagueId: '',
  matchId: '',
  status: '',
  startTime: '',
  endTime: ''
});
const comoMap = {
  FootBall,
  BasketBall,
  Tennis,
  Volleyball,
    Handball,
    IceHockey,
    PingPong,
  Badminton,
  Billiards

};
const matchStore = useMatchStore();
const comType = SPORT_ID_MAP.find(item => {
  return item.value === (settingStore.settleHistoryPageInfo.matchType ?? 1);
}).type;
const currentComponentName = reactive({
  name: markRaw(comoMap[comType])
});
const changeCurrentComponentName = (_: { value: number; type: string }) => {

    console.log(2222,_,_.type)
  currentComponentName.name = markRaw(comoMap[_.type]);
  currentSportId.value = _.value;
  matchStore.set_lagueList(0, _.value);
  settingStore.save_selttle_history_page_info({ page: null, matchType: null });
  form.leagueId = '';
};
//- 搜索相关
const onSearch = val => {
  componentStrName.value.filterData(val, form);
};

const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch('reload');
};
</script>

<style lang="scss">
.pure-warning-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-7);
  &:hover {
    td.el-table__cell {
      background-color: var(--el-color-danger-light-7) !important;
    }
  }
}
.canceled {
  .el-input__wrapper {
    box-shadow: none !important;
    border: none !important;
    background-color: transparent !important;
  }
}
</style>
