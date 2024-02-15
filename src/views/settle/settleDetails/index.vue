<template>
  <div class="main">
    <match-details
      :renderObj="renderObj"
      @allSettleBtnClick="allSettleBtnClick"
      :onSearch="onSearch"
    />
    <baskectball-goal-events
      v-if="sportId == 2"
      :columns="columns"
      :dataList="dataList"
      :onAddNewGoalEvent="onAddNewGoalEvent"
    />
    <badminton-goal-events
      v-if="sportId === 19"
      :columns="columns"
      :dataList="dataList"
      :onAddNewGoalEvent="onAddNewGoalEvent"
    />
  </div>
</template>

<script setup lang="ts">
import matchDetails from './components/matchDetails/index.vue';
import baskectballGoalEvents from './components/goalEvents/baskectball.vue';
import badmintonGoalEvents from './components/goalEvents/badminton.vue';
import { useMatchDetailsHook } from './utils/hook';
defineOptions({ name: 'SETTLE_DETAILS' });

const {
  renderObj,
  columns,
  dataList,
  sportId,
  onSearch,
  allSettleBtnClick,
  onAddNewGoalEvent
} = useMatchDetailsHook();
console.log(sportId);
</script>

<style scoped></style>
