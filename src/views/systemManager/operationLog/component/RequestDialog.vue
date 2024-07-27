<template>
  <!-- <div v-html="renderData" style="white-space: pre-wrap" class="ml-5"></div> -->
  <PureTableBar :columns="columns">
    <template v-slot="{size, dynamicColumns}">
      <pure-table
        align-whole="center"
        table-layout="auto"
        :size="size"
        :columns="dynamicColumns"
        :header-cell-style="tableHeaderStyle"
      >

      </pure-table>
    </template>
  </PureTableBar>
</template>

<script setup lang="ts">
import { usePublicHooks } from '@/hooks';
import { PureTableBar } from '@/components/RePureTableBar';
const { tableHeaderStyle } = usePublicHooks();
import { columns } from './optLogColumnList';
const props = defineProps<{
  requestLog: any;
}>();

const renderData = reactive<Record<string, unknown>>(
  props.requestLog as Record<string, unknown>
);
</script>

<style scoped></style>
