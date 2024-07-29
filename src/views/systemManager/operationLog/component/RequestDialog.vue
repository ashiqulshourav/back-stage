<template>
  <pure-table
    class="my-1"
    align-whole="center"
    table-layout="auto"
    border
    stripe
    :data="row"
    :columns="columns"
    :header-cell-style="tableHeaderStyle"
  >
    <template #requestLog="{ row }">
      <el-text class="whitespace-pre-wrap">
        {{ row.requestLog ?  row.requestLog : "-"}}
      </el-text>
    </template>
    <template #operateBefore="{ row }">
      <el-text class="whitespace-pre-wrap">
        {{ row.operateBefore ?  row.operateBefore : "-"}}
        <span :class="row.operateBefore !== row.operateAfter?'text-red-400 block':''">
          {{ row.operateBefore !== row.operateAfter ? "Open" : ""}}
        </span>
      </el-text>
    </template>
    <template #operateAfter="{ row }">
      <el-text class="whitespace-pre-wrap">
        {{ row.operateAfter ?  row.operateAfter : "-"}}
        <span :class="row.operateBefore !== row.operateAfter?'text-red-400 block':''">
          {{ row.operateBefore !== row.operateAfter ? "Closure" : ""}}
        </span>
      </el-text>
    </template>
  </pure-table>
</template>

<script setup lang="ts">
import { usePublicHooks } from '@/hooks';
const { tableHeaderStyle } = usePublicHooks();
import { columns } from './optLogColumnList';

const props = defineProps<{
  row: OperationLogDataAPI.OperationLogList[];
}>();

</script>

<style scoped></style>
