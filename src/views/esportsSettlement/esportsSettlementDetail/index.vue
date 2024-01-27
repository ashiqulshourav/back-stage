<template>
  <div class="main">
    <!-- -盘口详情 -->
    <MatchDetailCard :renderObj="renderObj" />

    <template v-if="!keyList.length">
      <el-empty :description="t('暂无结算信息')" />
    </template>
    <template v-else>
      <BtnGroup :keyList="keyList" @changeIndex="changeIndex" />
      <PureTableBar
        :title="t('盘口详情')"
        :columns="columns"
        @refresh="onSearch('reload')"
      >
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            adaptive
            :data="
              rList[selectIndex]?.list.slice(
                (pagination.currentPage - 1) * pagination.pageSize,
                pagination.pageSize
              )
            "
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="tableHeaderStyle"
            @selection-change="handleSelectionChange"
            @page-size-change="handleTableWidthChange"
            @page-current-change="handleCurrentChange"
          >
            <!-- - 盘口投注项 -->
            <template #betOptions="{ row }">
              <el-radio-group v-model="row.betOptions">
                <el-radio
                  :label="index"
                  border
                  class="min-w-40"
                  v-for="(item, index) in row.arr"
                  :key="index"
                >
                  <span>{{ item.handicap }}</span>
                  <span class="ml-3">{{ item.odds }}</span>
                </el-radio>
              </el-radio-group>
            </template>

            <!-- - 操作 -->
            <template #operaction="{ row }">
              <el-button
                type="primary"
                @click="manualSettleESportHandicapClick(row)"
                >{{ t('操作') }}</el-button
              >
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useEsportsSettlement } from './utils/hook';
import MatchDetailCard from './component/MatchDetailCard.vue';
import BtnGroup from './component/BtnGroup.vue';
import { usePublicHooks } from '@/hooks';
import { columns } from './utils/TableColumnList';
import { t } from '@/plugins/i18n';

defineOptions({ name: 'esportsSettlementDetail' });

const { tableHeaderStyle } = usePublicHooks();
const selectIndex = ref(0);
const changeIndex = index => (selectIndex.value = index);

const {
  loading,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  renderObj,
  rList,
  manualSettleESportHandicapClick
} = useEsportsSettlement();

const keyList = computed(() =>
  renderObj.betItemsMap
    ? Object.keys(renderObj.betItemsMap).map(key => key)
    : []
);

const pagination = computed(() => {
  const r = {
    total: 0,
    pageSize: 10,
    currentPage: 1
  };
  if (rList[selectIndex.value]) {
    r.total = rList[selectIndex.value]?.total;
    r.pageSize = rList[selectIndex.value].pageSize;
    r.currentPage = rList[selectIndex.value].currentPage;
  }
  return r;
});
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
