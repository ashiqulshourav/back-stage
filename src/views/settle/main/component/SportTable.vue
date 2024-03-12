<template>
  <PureTableBar
    :title="currentSport.label + t('列表')"
    :columns="columns"
    @refresh="onSearch"
  >
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
        <template #operation="{ row }">
          <slot :row="row"></slot>
        </template>
      </pure-table>
    </template>
  </PureTableBar>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { usePublicHooks } from '@/hooks';
import type { PaginationProps } from '@pureadmin/table';
import { sport_list_map_type } from '../utils/type';
import { t } from '@/plugins/i18n';

defineProps<{
  columns: TableColumnList;
  dataList: SattleDataAPI.getSettlementDataList[];
  pagination: PaginationProps;
  currentSport: sport_list_map_type;
  loading: boolean;
}>();

const emites = defineEmits([
  'onSearch',
  'handleTableWidthChange',
  'handleCurrentChange'
]);

const { tableHeaderStyle } = usePublicHooks();
const onSearch = () => emites('onSearch', 'reload');
const handleTableWidthChange = v => emites('handleTableWidthChange', v);
const handleCurrentChange = v => emites('handleCurrentChange', v);
</script>
