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
import FootBall from './component/FootBall/index.vue';
import BasketBall from './component/Basketball/index.vue';
import Tennis from './component/Tennis/index.vue';
import Billiards from './component/Billiards/index.vue';
import Volleyball from './component/Volleyball/index.vue';
import Hockey from './component/Hockey/index.vue';
import Boxing from './component/Boxing/index.vue';
import Darts from './component/Darts/index.vue';
import Badminton from './component/Badminton/index.vue';
import PingPong from './component/PingPong/index.vue';
import Rugby from './component/Rugby/index.vue';
import AmericanFootball from './component/American_football/index.vue';
import Handball from './component/Handball/index.vue';
import IceHockey from './component/IceHockey/index.vue';
import Cricket from './component/Cricket/index.vue';
import SearchForm from './component/SearchForm.vue';
import SportTypeNav from './component/SportTypeNav.vue';
import { SearchFormType } from './utils/type';
import { useMatchStore } from '@/store/match';
import { useSettingStoreHook } from '@/store/settings';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';

defineOptions({ name: 'VOLLEYBALL' });
const componentStrName = ref<any>('FootBall');
const settingStore = useSettingStoreHook();
const currentSportId = ref<number>(settingStore.settlePageInfo.matchType ?? 1);
const matchStore = useMatchStore();

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
  Billiards,
  Volleyball,
  Badminton,
  PingPong,
  Handball,
  IceHockey,
  Cricket,
  Hockey,
  Boxing,
  Darts,
  Rugby,
  AmericanFootball
};

const comType = SPORT_ID_MAP.find(item => {
  return item.value === (settingStore.settlePageInfo.matchType ?? 1);
}).type;

const currentComponentName = reactive({
  name: markRaw(comoMap[comType])
});

const changeCurrentComponentName = (_: { value: number; type: string }) => {
  currentComponentName.name = markRaw(comoMap[_.type]);
  currentSportId.value = _.value;
  matchStore.set_lagueList(0, _.value);
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
