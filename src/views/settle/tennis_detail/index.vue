<template>
  <div class="main tennis_container">
    <!-- -盘口详情 -->
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
    />

    <PureTableBar
      :title="t('网球结算管理')"
      :columns="columns"
      @refresh="onSearch()"
    >
      <template #title>
        <el-button
          v-if="renderObj.fullSettlementStatus === 0"
          @click="addEventRow"
          size="small"
          type="primary"
          :disabled="dataList.length >= 5"
          >{{ t('新增盘') }}</el-button
        >
        <span></span>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :row-key="row => row.eventTime"
          :expand-row-keys="expandMatchList"
          adaptive
          :adaptiveConfig="{
            offsetBottom: 48
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
                <!-- -比分 -->
                <template #t1="{ row: childRow }">
                  <Score :row="childRow" type="t1" />
                </template>
                <template #t2="{ row: childRow }">
                  <Score :row="childRow" type="t2" />
                </template>

                <!-- -结算时间 -->
                <template #eventTime="{ row: childRow, index: childIndex }">
                  <EventTime
                    :row="childRow"
                    :list="parentRow.inningEvents"
                    :index="childIndex"
                    :dataList="dataList"
                    :parentIndex="parentIndex"
                  />
                </template>
                <!-- -局结算按钮 -->
                <template
                  #childOperation="{ row: childRow, index: childIndex }"
                >
                  <ChildOperation
                    :row="childRow"
                    :list="parentRow.inningEvents"
                    :childIndex="childIndex"
                    @deleteChildItem="
                      parentRow.inningEvents.splice(childIndex, 1)
                    "
                  />
                </template>
              </pure-table>

              <el-button
                v-if="checkScore && !parentRow.id"
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
import ChildOperation from './component/ChildOperation.vue';

defineOptions({ name: 'SETTLE_TENNIS_DETAIL' });

const { tableHeaderStyle } = usePublicHooks();
// const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
//   {} as SattleDataAPI.getSettlementDataList
// );

// onMounted(() => {
//   Object.assign(renderObj, history.state.params);
// });

//- 检测当前局结算状态
const checkScore = computed(() => {
  const l: SattleDataAPI.TennisEventsData = JSON.parse(
    JSON.stringify(dataList)
  )?.pop();
  if (!l || l.inningEvents.length < 6) {
    canSettlement.value = false;
    return true;
  }
  const scoreList = l.inningEvents.map(item => [item.t1, item.t2]);
  let s1 = 0;
  let s2 = 0;
  scoreList.forEach(item => (item[0] > item[1] ? ++s1 : ++s2));
  t1Score.value = s1;
  t2Score.value = s2;
  if ((s1 >= 6 && s1 - s2 >= 2) || (s2 >= 6 && s2 - s1 >= 2)) {
    canSettlement.value = true;
    return false;
  }
  canSettlement.value = false;
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
  renderObj
} = useTennisDetailHook();
</script>
