<template>
  <div class="main">
    <!-- -盘口详情 -->
    <DetiltTitle :renderObj="{}" />

    <PureTableBar
      :title="t('足球结算管理')"
      :columns="columns"
      @refresh="onSearch()"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :row-key="row => row.matchId"
          :expand-row-keys="expandMatchList"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @expand-change="expandChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #expand="{ row, index }">
            <pure-table
              align-whole="center"
              :row-key="row => row.id"
              :data="item.tableList"
              :loading="childloading"
              :columns="childColumns"
              row-class-name=""
              size="small"
              table-layout="auto"
              border
              :header-cell-style="tableHeaderStyle"
            >
            </pure-table>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { usePublicHooks } from '@/hooks';
import { PureTableBar } from '@/components/RePureTableBar';
import DetiltTitle from './component/DetailTitle.vue';
import { useTennisDetailHook } from './utils/hook';
import { t } from '@/plugins/i18n';

defineOptions({ name: 'SETTLE_TENNIS_DETAIL' });

const { tableHeaderStyle } = usePublicHooks();
const {
  onSearch,
  loading,
  columns,
  dataList,
  pagination,
  handleTableWidthChange,
  handleCurrentChange,
  expandChange,
  expandMatchList,
  childloading,
  childColumns
} = useTennisDetailHook();
</script>

<style scoped></style>
