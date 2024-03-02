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
        <div>
          <h2>{{ t('赛果结算') }}</h2>
        </div>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          :loading="loading"
          :size="size"
          :row-key="row => row.inningNum"
          :adaptiveConfig="{
            offsetBottom: 60
          }"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
        >
          <!-- -比分 -->
          <template #t1="{ row }">
            <Score :row="row" type="t1" :errorType="row.t1Error" />
          </template>
          <template #t2="{ row }">
            <Score :row="row" type="t2" :errorType="row.t2Error" />
          </template>

          <!-- -结算时间 -->
          <template #eventTime="{ row, index }">
            <EventTime
              :row="row"
              :index="index"
              :dataList="dataList"
              :errorType="row.eventTimeError"
            />
          </template>

          <!-- -局按钮 -->
          <template #operation="{ row, index }">
            <ChildOperation
              :row="row"
              :childIndex="index"
              @deleteChildItem="() => dataList.pop()"
              @settlementHandicap="settlementHandicap(row)"
            />
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <template v-if="renderObj.fullSettlementStatus !== 1 && checkNoMore()">
      <div class="flex mt-4">
        <el-button
          @click="boardType = '7-4'"
          :type="boardType === '7-4' ? 'primary' : 'default'"
          :disabled="dataList.length && dataList[0].gameRule === '5-3'"
        >
          {{ t('七局四胜') }}
        </el-button>
        <el-button
          @click="boardType = '5-3'"
          :type="boardType === '5-3' ? 'primary' : ''"
          :disabled="dataList.length && dataList[0].gameRule === '7-4'"
        >
          {{ t('五局三胜') }}
        </el-button>
      </div>
      <div class="mt-4">
        <el-button type="primary" @click="addEventRow">
          {{ t('新增局') }}</el-button
        >
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { usePublicHooks } from '@/hooks';
import { PureTableBar } from '@/components/RePureTableBar';
import DetiltTitle from './component/DetailTitle.vue';

import { useBilliardsHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import Score from './component/Score.vue';
import EventTime from './component/EventTime.vue';
import ChildOperation from './component/ChildOperation.vue';

defineOptions({ name: 'SETTLE_PINGPONG_DETAIL' });
const { tableHeaderStyle } = usePublicHooks();

const {
  onSearch,
  loading,
  columns,
  dataList,
  boardType,
  checkNoMore,
  addEventRow,
  settlementHandicap,
  allSettleBtnClick,
  renderObj,
  allSettleLoading
} = useBilliardsHook();
</script>
