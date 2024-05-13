<template>
  <div class="flex min-h-full 0">
    <WarningList />
    <MatchList />
  </div>
</template>

<script setup lang="ts">
import WarningList from './com/WarningSetting.vue';
import MatchList from './com/WarningList.vue';
</script>

<style lang="scss">
.el-scrollbar__view {
  height: 95%;
}
</style>
