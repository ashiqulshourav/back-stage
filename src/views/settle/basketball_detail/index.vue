<template>
  <div class="main">
    <!-- -盘口详情 -->
    <DetiltTitle :renderObj="currentMatch" />

    <PureTableBar
      :title="t('賽果結算')"
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
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @expand-change="expandChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
        </pure-table>
      </template>
    </PureTableBar>
    <el-button 
      type="primary" 
      class="mt-3 px-24">新增節</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePublicHooks } from '@/hooks';
import { PureTableBar } from '@/components/RePureTableBar';
import DetiltTitle from './component/DetailTitle.vue';
import { useBasketballDetailHook } from './utils/hook';
import { t } from '@/plugins/i18n';

defineOptions({ name: 'SETTLE_BASKETBALL_DETAIL' });
const router = useRoute();
const { matchId } = router.params;
const isEdit = ref(false);
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
  currentMatch,
  getCurrentMatchDetail
} = useBasketballDetailHook();

onMounted(() => {
  getCurrentMatchDetail(Number(matchId));
  onSearch();
});
</script>

<style scoped></style>
