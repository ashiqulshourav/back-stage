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
import FootBall from './component/FootBallCom/index.vue';
import BasketBall from './component/BasketballCom/index.vue';
import SearchForm from './component/SearchForm.vue';
import SportTypeNav from './component/SportTypeNav.vue';
import { SearchFormType } from './utils/type';

defineOptions({ name: 'SETTLE_ADMIN' });
const componentStrName = ref<any>('FootBall');
const currentSportId = ref<number>(1);

const form = reactive<SearchFormType>({
  leagueId: '',
  matchId: '',
  status: '',
  startTime: '',
  endTime: ''
});
const comoMap = {
  FootBall,
  BasketBall
};
const currentComponentName = reactive({
  name: markRaw(comoMap.FootBall)
});

const changeCurrentComponentName = (_: { value: number; type: string }) => {
  currentComponentName.name = markRaw(comoMap[_.type]);
  currentSportId.value = _.value;
  onSearch('reload');
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
