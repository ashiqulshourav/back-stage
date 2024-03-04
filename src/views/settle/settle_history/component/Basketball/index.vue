<template>
  <div class="main">
    <PureTableBar
      :title="t('结算历史')"
      :columns="columns"
      @refresh="reloadTable"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
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
            <el-button
                class="reset-margin"
                type="primary"
                :size="size"
                @click="goTennisDetail(row)"
            >
              {{ t('结算详情') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { PureTableBar } from '@/components/RePureTableBar';
import { useSettle } from './utils/hook';
import { usePublicHooks } from '@/hooks';
const { tableHeaderStyle } = usePublicHooks();
defineOptions({ name: 'SETTLE_HISTORY' });
const router = useRouter();
const {
  loading,
  columns,
  dataList,
  pagination,
  handleTableWidthChange,
  handleCurrentChange,
  reloadTable,
} = useSettle();
const goTennisDetail = row => {
  const params = JSON.parse(JSON.stringify(row));
  router.push({
    name: 'SETTLE_NEW_BASKETBALL_DETAIL',
    state: { params }
  });
};
</script>

<style lang="scss">
.pure-warning-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-7);
  &:hover {
    td.el-table__cell {
      background-color: var(--el-color-danger-light-7) !important;
    }
  }
}
.canceled {
  .el-input__wrapper {
    box-shadow: none !important;
    border: none !important;
    background-color: transparent !important;
  }
}
</style>
