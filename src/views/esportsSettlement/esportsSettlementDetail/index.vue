<template>
  <div class="main">
    <!-- -盘口详情 -->
    <MatchDetailCard />
    <BtnGroup />

    <PureTableBar :title="''" :columns="columns" @refresh="onSearch('reload')">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #betOptions="{ row }">
            <el-radio-group v-model="row.betOptions">
              <el-radio label="1" border>西安WE</el-radio>
              <el-radio label="2" border>OMG</el-radio>
            </el-radio-group>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useLeague } from './utils/hook';
import MatchDetailCard from './component/MatchDetailCard.vue';
import BtnGroup from './component/BtnGroup.vue';
import { usePublicHooks } from '@/hooks';
import { columns } from './utils/TableColumnList';

const { tableHeaderStyle } = usePublicHooks();
defineOptions({ name: 'esportsSettlementDetail' });

const {
  loading,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange
} = useLeague();
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
