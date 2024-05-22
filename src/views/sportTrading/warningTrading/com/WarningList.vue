<template>
  <div class="bg-bg_color w-full flex-grow ml-3 overflow-auto search-form p-5">
    <div class="flex justify-between">
      <div class="font-bold">{{ t('告警列表') }}</div>
      <div>
        <el-button type="primary">{{ t('刷新') }}</el-button>
      </div>
    </div>

    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :small="true"
      :background="pagination.background"
      layout="prev, pager, next, jumper"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import type { PaginationProps } from '@pureadmin/table';

const props = defineProps<{
  pagination: PaginationProps;
}>();

const handleSizeChange = () => {};
const handleCurrentChange = () => {};
</script>

<style scoped></style>
