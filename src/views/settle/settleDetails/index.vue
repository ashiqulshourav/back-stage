<template>
  <div class="main">
    <match-details 
      :renderObj="renderObj"
    />
    <goal-events 
      :columns="columns"
      :dataList="dataList"
      :onAddNewGoalEvent="onAddNewGoalEvent"
    />
  </div>
</template>

<script setup lang="ts">
import matchDetails from './components/matchDetails/index.vue';
import goalEvents from './components/goalEvents/index.vue';
import { useMatchDetailsHook } from './utils/hook';
defineOptions({ name: 'SETTLE_DETAILS' });

const {
  renderObj,
  columns,
  dataList,
  onAddNewGoalEvent
} = useMatchDetailsHook();
</script>

<style scoped>
</style>