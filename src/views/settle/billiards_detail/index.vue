<template>
  <div class="main tennis_container">
    <!-- -盘口详情 -->
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
    />

    <PureTableBar :columns="columns" @refresh="onSearch()">
      <template #title>
        <div class="flex items-center">
          <el-button
            @click="addEventRow"
            size="small"
            type="primary"
            v-if="renderObj.fullSettlementStatus === 0"
            >{{ t('新增局') }}</el-button
          >
          <span></span>
        </div>
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
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { usePublicHooks } from '@/hooks';
import { PureTableBar } from '@/components/RePureTableBar';
import DetiltTitle from './component/DetailTitle.vue';
import { useVolleballDetailHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import Score from './component/Score.vue';
import EventTime from './component/EventTime.vue';
import ChildOperation from './component/ChildOperation.vue';

defineOptions({ name: 'SETTLE_TENNIS_DETAIL' });

const { tableHeaderStyle } = usePublicHooks();

//- 检测当前局结算状态
const checkScore = computed(() => {
  const l: SettleDataAPI.TennisEventsData = JSON.parse(
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
  //- 长盘制
  if ((s1 >= 6 && s1 - s2 >= 2) || (s2 >= 6 && s2 - s1 >= 2)) {
    canSettlement.value = true;
    return false;
  }
  //- 短盘制
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
  // boardType,
  // juType,
  // changeBoardType,
  // changeJuType
} = useVolleballDetailHook();
</script>
