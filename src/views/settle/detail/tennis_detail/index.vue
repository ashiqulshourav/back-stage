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
          <el-button
            @click="addEventRow"
            size="small"
            type="primary"
            v-if="renderObj.fullSettlementStatus === 0"
            >{{ t('新增盘') }}</el-button
          >
          <span></span>
        </div>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :row-key="row => row.setNum"
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
          <template #expand="{ row: parentRow }">
            <div class="pl-12">
              <pure-table
                class="table_container"
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

                <!-- -局按钮 -->
                <template
                  #childOperation="{ row: childRow, index: childIndex }"
                >
                  <ChildOperation
                    v-if="renderObj.fullSettlementStatus === 0 && !parentRow.id"
                    :row="childRow"
                    :list="parentRow.inningEvents"
                    :childIndex="childIndex"
                    @deleteChildItem="
                      parentRow.inningEvents.splice(childIndex, 1)
                    "
                  />
                  <span v-else>-</span>
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
import DetiltTitle from '../../component/Settle_detail_title.vue';
import { useTennisDetailHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import Score from './component/Score.vue';
import ChildOperation from './component/ChildOperation.vue';

defineOptions({ name: 'SETTLE_TENNIS_DETAIL' });

const { tableHeaderStyle } = usePublicHooks();

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
  //- 长盘制
  // if ((s1 >= 6 && s1 - s2 >= 2) || (s2 >= 6 && s2 - s1 >= 2)) {
  if (s1 >= 6 || s2 >= 6) {
    canSettlement.value = true;
    // return false;
  }
  //- 短盘制
  // canSettlement.value = false;
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
  allSettleLoading
} = useTennisDetailHook();
</script>
