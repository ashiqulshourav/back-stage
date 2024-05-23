<template>
  <div
    class="bg-bg_color w-full flex-grow ml-3 search-form p-5 flex flex-col h-full"
    v-loading="loading"
  >
    <div class="flex justify-between">
      <div class="font-bold">{{ t('告警列表') }}</div>

      <div>
        <el-button type="primary">{{ t('刷新') }}</el-button>
      </div>
    </div>

    <div class="flex-grow h-[calc(100%-80px)]">
      <el-scrollbar>
        <WarningMatch
          v-for="(item, index) in matchList"
          :matchData="item"
          :matchList="matchList"
          :key="index"
        />
      </el-scrollbar>
    </div>

    <div class="flex justify-end pt-2">
      <PaginationCom :pagination="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import type { PaginationProps } from '@pureadmin/table';
import PaginationCom from './PaginationCom.vue';
import WarningMatch from './WarningMatch.vue';

defineProps<{
  pagination: PaginationProps;
  loading: boolean;
  matchList: sportTradingDataAPI.getAlarmMatchListType[];
}>();
</script>

<style scoped></style>
