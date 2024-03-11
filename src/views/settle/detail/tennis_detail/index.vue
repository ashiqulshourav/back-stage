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
              <span class="mr-3 text-[var(--el-color-danger)]"
                >{{
                  renderObj.reSettleStatus === 1
                    ? t('重新结算中')
                    : t('人工结算中')
                }}...</span
              >
              <IconifyIconOffline
                width="25px"
                icon="icon_circle_fill"
                @click="addChildRow"
              />
            </div>
          </div>
          <el-button @click="addEventRow" size="small" type="primary" v-else>{{
            t('新增盘')
          }}</el-button>
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
            <el-button
              v-if="!parentRow.id"
              @click="settlementHandicap(parentRow)"
              type="primary"
              size="small"
              :disabled="!canSettlement"
              >{{ t('结算盘') }}</el-button
            >
            <span v-else>{{ t('已结算') }}</span>
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
                      renderObj.fullSettlementStatus === 0 &&
                      !parentRow.id === null
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
                v-if="checkScore && !parentRow.id === null"
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

//- 检测当前局结算状态
const checkScore = computed(() => {
  const l: SattleDataAPI.TennisEventsData = JSON.parse(
    JSON.stringify(dataList)
  )?.pop();
  if (!l || l.childEvents.length < 6) {
    canSettlement.value = false;
    return true;
  }
  const scoreList = l.childEvents.map(item => [item.t1, item.t2]);
  let s1 = 0;
  let s2 = 0;
  scoreList.forEach(item => (item[0] > item[1] ? ++s1 : ++s2));
  t1Score.value = s1;
  t2Score.value = s2;
  if (s1 >= 6 || s2 >= 6) {
    canSettlement.value = true;
  }
  return true;
});

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
  t1Score,
  t2Score,
  canSettlement,
  allSettleBtnClick,
  renderObj,
  expandChange,
  allSettleLoading,
  changeSettleType
} = useTennisDetailHook();
</script>
