<template>
  <div class="main">
    <!-- -盘口详情 -->
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
      :allSettleLoading="loading"
    />
    <PureTableBar :columns="childColumns" @refresh="reloadTable">
      <template #title>{{ baseTitle }}</template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          :row-key="row => row.id"
          :data="eventList"
          :loading="loading"
          :columns="dynamicColumns"
          :row-class-name="tableRowClassName"
          :size="size"
          table-layout="auto"
          border
          :header-cell-style="tableHeaderStyle"
        >
          <!-- - 比分 -->
          <template #score="{ row }: MatchEventRowType">
            <div class="flex justify-center items-center">
              <Score :row="row" type="t1" />
              <span class="ml-1 mr-1 font-bold leading-[2]">:</span>
              <Score :row="row" type="t2" />
            </div>
          </template>

          <!-- -事件生成时间 -->
          <template #eventTime="{ row, index }: MatchEventRowType">
            <MatchTime
              :row="row"
              :index="index"
              :beginTime="renderObj.beginTimeLong"
              :dataList="eventList"
            />
          </template>

          <!-- -操作 -->
          <template #operation="{ row }: MatchEventRowType">
            <div
              class="flex items-center justify-center"
              v-if="!renderObj.fullSettlementStatus"
            >
              <template v-if="row.id">
                <BackEndBtnGroupCom
                  :row="row"
                  @cancelMatchEvent="cancelMatchEvent"
                />
              </template>
              <template v-else>
                <FrontBtnGroupCom
                  :size="size"
                  :row="row"
                  @editChild="editChild"
                  @handleChildrenData="handleChildrenData(row, 'save')"
                />
              </template>
              <el-button
                class="reset-margin"
                link
                type="danger"
                :size="size"
                v-if="!row.id"
                :disabled="!row.isSave || row.isEdit"
                :icon="useRenderIcon('uploadIcon')"
                @click="handleChildrenData(row, 'upload')"
              >
                {{ t('确认结算') }}
              </el-button>
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                v-if="!row.id"
                :icon="useRenderIcon(Delete)"
                @click="eventList.pop()"
              >
                {{ t('取消') }}
              </el-button>
            </div>
            <div v-else>-</div>
          </template>

          <!-- -数据商 -->
          <template #dataSourceCode="{ row }: MatchEventRowType">
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
        </pure-table>
        <div class="mt-2 cursor-pointer">
          <el-button
            v-if="renderObj.settlementType === 1"
            class="ml-1 reset-margin"
            @click="changeSettleType"
            >{{ t('开启人工结算') }}</el-button
          >
          <div
            class="flex items-center"
            v-if="renderObj.settlementType !== 1 && isShowSettleBen"
          >
            <span class="mr-3 text-[var(--el-color-danger)]"
              >{{ t('人工结算中') }}...</span
            >
            <IconifyIconOffline
              width="25px"
              icon="icon_circle_fill"
              @click="addChildRow"
            />
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { MATH_RULE } from '@/utils/maps/sports_map';
import BackEndBtnGroupCom from './component/BackEndBtnGroup.vue';
import FrontBtnGroupCom from './component/FrontBtnGroup.vue';
import MatchTime from './component/MatchTime.vue';
import Score from './component/Score.vue';
import { t } from '@/plugins/i18n';
import { useNewBasketBallHook } from './utils/hook';
import { usePublicHooks } from '@/hooks';
import Delete from '@iconify-icons/ep/delete';
import { MatchEventRowType } from './utils/type';

import DetiltTitle from '../../component/Settle_detail_title.vue';
defineOptions({ name: 'SETTLE_NEW_BASKETBALL_DETAIL' });

const {
  loading,
  childColumns,
  addChildRow,
  editChild,
  handleChildrenData,
  reloadTable,
  changeSettleType,
  cancelMatchEvent,
  eventList,
  renderObj,
  allSettleBtnClick
} = useNewBasketBallHook();

const { tableHeaderStyle } = usePublicHooks();

const eventQuotientList = [
  { type: 'xjFlag', val: t('188数据') },
  { type: 'psFlag', val: t('熊猫数据') },
  { type: 'vsFlag', val: t('播控数据') }
];

//- 人工结算是否需要加时赛
const isShowSettleBen = computed(() => {
  if (
    eventList[eventList.length - 1]?.matchPeriodId === 40 &&
    eventList[eventList.length - 1]?.id
  ) {
    return false;
  }
  let homeScore = 0;
  let awayScore = 0;
  const matchType = renderObj.periodType;
  if (matchType === eventList.length) {
    eventList.forEach(item => {
      homeScore += +item.t1;
      awayScore += +item.t2;
    });
    return homeScore === awayScore;
  }
  return true;
});

//- 取消事件置灰
const tableRowClassName = ({ row }: MatchEventRowType) =>
  row.canceled === 1 ? 'pure-warning-row' : '';

const baseTitle = computed(() => {
  return MATH_RULE.basketBall.find(item => item.key === renderObj.periodType)
    ?.val;
});
</script>

<style scoped></style>
