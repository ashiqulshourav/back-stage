<template>
  <div class="bg-bg_color w-full flex-grow ml-3 overflow-auto search-form p-5">
    <div class="flex justify-between">
      <div class="font-bold">{{ t('告警列表') }}</div>
      <div>
        <el-button type="primary">{{ t('刷新') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
</script>

<style scoped></style>
