<template>
  <div class="flex flex-col h-full">
    <Serach :form="searchForm" />
    <div class="flex flex-grow">
      <WarningList />
      <MatchList />
    </div>
  </div>
</template>

<script setup lang="ts">
import WarningList from './com/WarningSetting.vue';
import MatchList from './com/WarningList.vue';
import { useWarningHook } from '../util/warning_hook';
import Serach from './com/Search.vue';

const { searchForm } = useWarningHook();
</script>

<style lang="scss">
.el-scrollbar__view {
  height: 97%;
}
</style>
