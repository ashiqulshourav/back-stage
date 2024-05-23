<template>
  <el-pagination
    v-model:current-page="pagination.currentPage"
    v-model:page-size="pagination.pageSize"
    :small="true"
    :background="pagination.background"
    layout="prev, pager, next, jumper"
    :total="pagination.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
import type { PaginationProps } from '@pureadmin/table';
defineProps<{
  pagination: PaginationProps;
}>();

const handleSizeChange = () => {};
const handleCurrentChange = () => {};
</script>

<style scoped></style>
