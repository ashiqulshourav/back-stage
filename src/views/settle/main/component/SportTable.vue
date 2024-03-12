<template>
  <PureTableBar :title="title" :columns="columns" @refresh="onSearch">
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        class="table_container"
        showOverflowTooltip
        align-whole="center"
        :loading="loading"
        :size="size"
        :row-key="row => row.matchId"
        adaptive
        :data="dataList"
        :columns="dynamicColumns"
        :pagination="{ ...pagination, pageSizes: [5, 10, 20, 50, 100] }"
        :paginationSmall="size === 'small' ? true : false"
        :header-cell-style="tableHeaderStyle"
        @page-size-change="handleTableWidthChange"
        @page-current-change="handleCurrentChange"
      >
        <template #operation>
          <slot></slot>
        </template>
      </pure-table>
    </template>
  </PureTableBar>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { usePublicHooks } from '@/hooks';

const props = defineProps<{
  title: string;
  columns;
  dataList;
  pagination;
  loading: boolean;
}>();

const emites = defineEmits([
  'onSearch',
  'handleTableWidthChange',
  'handleCurrentChange'
]);

const { tableHeaderStyle } = usePublicHooks();
const onSearch = () => emites('onSearch', 'reload');
const handleTableWidthChange = () => emites('handleTableWidthChange');
const handleCurrentChange = () => emites('handleCurrentChange');
</script>
