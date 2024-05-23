<template>
  <div class="flex flex-col h-full">
    <Serach :form="searchForm" :loading="loading" />
    <div class="flex flex-grow h-[calc(100%-60px)]">
      <WarningList />
      <MatchList
        :pagination="pagination"
        :loading="loading"
        :matchList="matchList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import WarningList from './com/WarningSetting.vue';
import MatchList from './com/WarningList.vue';
import { useWarningHook } from '../util/warning_hook';
import Serach from './com/Search.vue';

const { searchForm, pagination, loading, matchList } = useWarningHook();
</script>

<style lang="scss">
.el-scrollbar__view {
  height: 97%;
}
</style>
