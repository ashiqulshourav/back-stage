<template>
  <div class="main">
    <SearchForm
      :form="form"
      @resetForm="resetForm"
      :loading="loading"
      @onSearch="onSearch"
    />
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
import { useSettle } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import SportTypeNav from './component/SportTypeNav.vue';
import FootBall from './component/FootBall/index.vue';
import BasketBall from './component/Basketball/index.vue';
import Tennis from './component/Tennis/index.vue';
import { useSettingStoreHook } from '@/store/settings';
import Volleyball from './component/Volleyball/index.vue';
import { useMatchStore } from '@/store/match';

defineOptions({ name: 'SETTLE_HISTORY' });
const componentStrName = ref<any>('FootBall');
const settingStore = useSettingStoreHook();
const currentSportId = ref<number>(
  settingStore.settleHistoryPageInfo.matchType ?? 1
);
const { form, loading, resetForm } = useSettle();
const comoMap = {
  FootBall,
  BasketBall,
  Tennis,
  Volleyball
};
const matchStore = useMatchStore();
const comType = SPORT_ID_MAP.find(item => {
  return item.value === (settingStore.settleHistoryPageInfo.matchType ?? 1);
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
