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
          :row-key="row => row.id"
          :expand-row-keys="expandMatchList"
          adaptive
          :adaptiveConfig="{
            offsetBottom: 48
          }"
          :data="dataList"
          :default-expand-all="true"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
          @expand-change="expandChange"
        >
          <template #operation="{ row: parentRow }">
            <el-button @click="settlementHandicap(parentRow)" type="primary">{{
              t('结算盘')
            }}</el-button>
          </template>

          <template #empty>
            <el-button @click="addEventRow" type="primary">{{
              t('新增盘')
            }}</el-button>
          </template>

          <template #expand="{ row: parentRow, index: parentIndex }">
            <div class="pl-12">
              <pure-table
                align-whole="center"
                :row-key="row => row.id"
                :data="parentRow.inningEvents"
                :loading="childloading"
                :columns="childColumns"
                row-class-name=""
                size="small"
                table-layout="auto"
                border
                :header-cell-style="tableHeaderStyle"
              >
                <template #t1="{ row: childRow }">
                  <Score :row="childRow" type="t1" />
                </template>
                <template #t2="{ row: childRow }">
                  <Score :row="childRow" type="t2" />
                </template>
                <template #eventTime="{ row: childRow, index: childIndex }">
                  <EventTime
                    :row="childRow"
                    :list="parentRow.inningEvents"
                    :index="childIndex"
                  />
                </template>
                <template #childOperation="{ row: childRow }">
                 <ChildOperation row="childRow"/>
                </template>
              </pure-table>
              <el-button
                class="mt-2"
                type="primary"
                size="small"
                @click="addChildRow(parentRow)"
                >{{ t('新增局') }}</el-button
              >
            </div>
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
import Score from './component/Score.vue';
import EventTime from './component/EventTime.vue';

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
  addEventRow,
  addChildRow,
  settlementHandicap
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
