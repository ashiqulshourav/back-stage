<template>
  <div class="main">
    <match-details 
      :renderObj="renderObj"
      @allSettleBtnClick="allSettleBtnClick"
      :onSearch="onSearch"
    />
    <baskectball-goal-events 
      :columns="columns"
      :dataList="dataList"
      :onAddNewGoalEvent="onAddNewGoalEvent"
    />
  </div>
</template>

<script setup lang="ts">
import matchDetails from './components/matchDetails/index.vue';
import baskectballGoalEvents from './components/goalEvents/baskectball.vue';
import { useMatchDetailsHook } from './utils/hook';
defineOptions({ name: 'SETTLE_DETAILS' });

const {
  renderObj,
  columns,
  dataList,
  onSearch,
  allSettleBtnClick,
  onAddNewGoalEvent
} = useMatchDetailsHook();
</script>

<style scoped>
</style>