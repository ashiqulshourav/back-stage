<template>
  <div class="main tennis_container">
    <!-- -盘口详情 -->
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
      :allSettleLoading="allSettleLoading"
    />
    <PureTableBar :columns="columns" @refresh="onSearch()">
      <template #title>
        <div class="flex items-center">
          <div
            class="mt-2 cursor-pointer"
            v-if="
              !renderObj.fullSettlementStatus || renderObj.reSettleStatus === 1
            "
          >
            <el-button
              v-if="
                renderObj.settlementType === 1 && renderObj.reSettleStatus !== 1
              "
              class="ml-1 reset-margin"
              @click="changeSettleType"
              >{{ t('开启人工结算') }}</el-button
            >
            <div
              class="flex items-center"
              v-if="
                renderObj.settlementType !== 1 || renderObj.reSettleStatus === 1
              "
            >
              <span class="mr-3 text-[var(--el-color-danger)] text-sm"
                >{{
                  renderObj.reSettleStatus === 1
                    ? t('重新结算中')
                    : t('人工结算中')
                }}...</span
              >
              <el-button @click="addEventRow" size="small" type="primary">
                {{ t('新增盘') }}
              </el-button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :row-key="row => row.matchPeriodId"
          :expand-row-keys="expandMatchList"
          @expand-change="expandChange"
          adaptive
          :adaptiveConfig="{
            offsetBottom: 60
          }"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
        >
          <template #operation="{ row: parentRow }">
            <template v-if="renderObj.fullSettlementStatus === 0">
              <el-button
                v-if="parentRow.id !== null"
                @click="settlementHandicap(parentRow)"
                type="primary"
                size="small"
                :disabled="canSettlement(parentRow.childEvents)"
                >{{ t('结算盘') }}</el-button
              >
              <el-button
                class="reset-margin"
                type="primary"
                size="small"
                v-if="renderObj.settlementType === 2 && parentRow.id === null"
                @click="resetMatchEvent(parentRow)"
              >
                {{
                  parentRow.isCanResetSettle ? t('重新结算') : t('开启重新结算')
                }}
              </el-button>
            </template>
            <span v-else>-</span>
          </template>

          <template
            #expand="{
              row: parentRow
            }: {
              row: SattleDataAPI.TennisEventsData
            }"
          >
            <div class="pl-12">
              <pure-table
                class="table_container"
                align-whole="center"
                :row-key="row => row.id"
                :data="parentRow.childEvents"
                :loading="childloading"
                :columns="childColumns"
                row-class-name=""
                size="small"
                table-layout="auto"
                border
                :header-cell-style="tableHeaderStyle"
              >
                <!-- -比分 -->
                <template #secondT1="{ row: childRow }">
                  <Score :row="childRow" type="secondT1" />
                </template>
                <template #secondT2="{ row: childRow }">
                  <Score :row="childRow" type="secondT2" />
                </template>

                <!-- -数据商 -->
                <template #dataSourceCode="{ row }">
                  <div v-if="row.id && row.settleType === 0">
                    <el-text
                      v-for="(_, index) in eventQuotientList"
                      :key="index"
                      :type="row[_.type] === 1 ? 'primary' : 'info'"
                      :class="['!text-xs', index === 1 && '!mr-2 !ml-2']"
                      >{{ _.val }}</el-text
                    >
                  </div>
                  <span v-else>-</span>
                </template>

                <!-- -局按钮 -->
                <template
                  #childOperation="{
                    row: childRow,
                    index: childIndex
                  }: {
                    row: SattleDataAPI.ChildEvent,
                    index: number
                  }"
                >
                  <ChildOperation
                    v-if="
                      (renderObj.fullSettlementStatus === 0 &&
                        !(parentRow.id === null)) ||
                      parentRow.isCanResetSettle
                    "
                    :row="childRow"
                    :list="parentRow.childEvents"
                    :childIndex="childIndex"
                    @deleteChildItem="
                      parentRow.childEvents.splice(childIndex, 1)
                    "
                  />
                  <span v-else>-</span>
                </template>
              </pure-table>
              <el-button
                v-if="parentRow.id !== null || parentRow.isCanResetSettle"
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
import DetiltTitle from '../../component/Settle_detail_title.vue';
import { useTennisDetailHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import Score from './component/Score.vue';
import ChildOperation from './component/ChildOperation.vue';

defineOptions({ name: 'SETTLE_DETAIL_TENNIS_DETAIL' });

const { tableHeaderStyle } = usePublicHooks();

const eventQuotientList = [
  { type: 'xjFlag', val: t('188数据') },
  { type: 'psFlag', val: t('熊猫数据') },
  { type: 'vsFlag', val: t('播控数据') }
];

const canSettlement = (list: SattleDataAPI.ChildEvent[]) => {
  return !list.every(item => {
    return item.secondT1 !== '' && item.secondT2 !== '' && !item.isEdit;
  });
};

const {
  onSearch,
  loading,
  columns,
  dataList,
  expandMatchList,
  childloading,
  childColumns,
  addEventRow,
  addChildRow,
  settlementHandicap,
  allSettleBtnClick,
  renderObj,
  expandChange,
  allSettleLoading,
  changeSettleType,
  resetMatchEvent
} = useTennisDetailHook();
</script>
