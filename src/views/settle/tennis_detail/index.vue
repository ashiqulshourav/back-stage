<template>
  <div class="main tennis_container">
    <!-- -盘口详情 -->
    <DetiltTitle />

    <PureTableBar
      :title="t('网球结算管理')"
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
          default-expand-all
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
          @expand-change="expandChange"
        >
          <template #operation>
            <el-button @click="addEventRow" type="primary">{{
              t('结算盘')
            }}</el-button>
          </template>

          <template #empty>
            <el-button @click="addEventRow" type="primary">{{
              t('新增盘')
            }}</el-button>
          </template>
          <template #expand="{ row }">
            <pure-table
              align-whole="center"
              :row-key="row => row.id"
              :data="row.inningEvents"
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
  expandChange,
  expandMatchList,
  childloading,
  childColumns,
  addEventRow
} = useTennisDetailHook();
</script>

<style lang="scss">
.tennis_container {
  .el-table__empty-block {
    .el-table__empty-text {
      width: 100%;
      text-align: left;
    }
  }
}
</style>
