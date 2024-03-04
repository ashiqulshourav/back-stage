<template>
  <div class="main football_detail">
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
      :allSettleLoading="allSettleLoading"
      :hideAllSettleBtn="renderObj.fullSettlementStatus ? false : true"
      :isFootBallTitle="true"
    >
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="flex item-center text-sm">
            <span>{{ t('目前比分') }}: </span>
            <span>
              {{ dataList[0].tableList[dataList[0].tableList.length - 1]?.t1 }}
              -
              {{ dataList[0].tableList[dataList[0].tableList.length - 1]?.t2 }}
            </span>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="flex text-sm">
            <div class="flex">
              <span>{{ t('目前红牌') }}：</span>
              <el-text type="danger">{{ getCurrentCard.home.red }}</el-text>
              <span>-</span>
              <el-text type="danger">{{ getCurrentCard.away.red }}</el-text>
            </div>
            <div class="flex ml-3">
              <span class="text-sm">{{ t('目前黄牌') }}：</span>
              <span>{{ t('主队') }}-</span>
              <el-text type="primary">{{ getCurrentCard.home.yellow }}</el-text>
              <span class="2">-</span>
              <el-text type="primary">{{ getCurrentCard.away.yellow }}</el-text>
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="flex text-sm">
            <span>{{ t('目前角球') }}：</span>
            <span>
              {{ dataList[2].tableList[dataList[2].tableList.length - 1]?.t1 }}
              -
              {{ dataList[2].tableList[dataList[2].tableList.length - 1]?.t2 }}
            </span>
          </div>
        </el-col>
      </el-row>
    </DetiltTitle>
    <PureTableBar @refresh="reloadTable" :columns="childColumns">
      <template #title>
        <div class="flex items-center">
          <template v-if="!renderObj.fullSettlementStatus">
            <SettleMatchBtn
              :balanceLoading="balanceLoading"
              :parentRow="renderObj"
              :childDataTotal="childDataTotal"
              @settlementFunction="settlementFunction"
            />
            <!-- -开启人工结算 -->
            <div class="cursor-pointer">
              <el-button
                v-if="renderObj.settlementType === 1"
                class="ml-1 reset-margin"
                @click="changeSettleType"
                >{{ t('开启人工结算') }}</el-button
              >
            </div>
            <el-text type="danger" class="!ml-2">{{
              t('请依照正序进行确认结算')
            }}</el-text>
          </template>
        </div>
      </template>
      <template v-slot="{ size }">
        <el-tabs tab-position="top" :lazy="true">
          <el-tab-pane
            :label="item.val"
            v-for="(item, idx) in dataList"
            :key="item.type"
          >
            <pure-table
              class="table_container"
              table-layout="auto"
              :fit="true"
              align-whole="center"
              :data="item.tableList"
              :row-key="row => row.id"
              :loading="childloading"
              adaptive
              :columns="
                item.type === 'yellow_red_card'
                  ? [...yellow_red_column, ...childColumns.slice(1)]
                  : childColumns
              "
              :row-class-name="tableRowClassName"
              size="small"
              border
              :header-cell-style="tableHeaderStyle"
            >
              <!-- -事件编码 -->
              <template #eventCode="{ row, index }: MatchEventRowType">
                <EventCode
                  :row="row"
                  :index="index"
                  :item="item"
                  @teamChangeEvent="teamChangeEvent"
                />
              </template>
              <!-- -结算类型 -->
              <template #settleType="{ row }: MatchEventRowType">
                <CountDownBtn
                  :row="row"
                  :parentRow="renderObj"
                  v-show="row.isShowCount"
                />
                <span v-show="!row.isShowCount">
                  {{
                    row.settleType === 0 || renderObj.settlementType === 1
                      ? t('自动结算')
                      : t('人工结算')
                  }}
                </span>
              </template>

              <!-- -比赛进行时间 -->
              <template #eventTime="{ row, index }: MatchEventRowType">
                <MatchTime
                  v-if="renderObj.beginTimeLong"
                  :row="row"
                  :index="index"
                  :item="item"
                  :beginTime="renderObj.beginTimeLong"
                />
              </template>

              <!-- -比赛阶段 -->
              <template #matchPeriodId="{ row, index }: MatchEventRowType">
                <MatchStage :row="row" :item="item" :index="index" />
              </template>

              <!-- -事件来源 -->
              <template #homeAway="{ row, index }: MatchEventRowType">
                <EventSource
                  :row="row"
                  :index="index"
                  :item="item"
                  @teamChangeEvent="teamChangeEvent"
                />
              </template>

              <!-- -操作 -->
              <template #operation="{ row, index: i }: MatchEventRowType">
                <div class="flex items-center justify-center">
                  <template v-if="!renderObj.fullSettlementStatus">
                    <template v-if="row.isBackEndReturnData">
                      <BackEndBtnGroupCom
                        :row="row"
                        :parentRow="renderObj"
                        :size="size"
                        @changeSettleType="changeSettleType"
                        @handleChildrenData="handleChildrenData"
                        @cancelMatchEvent="cancelMatchEvent"
                        :dataList="dataList[idx].tableList"
                        :index="i"
                        :isShowCount="row.isShowCount"
                        @advanceSettlement="advanceSettlement"
                      />
                    </template>
                    <template v-else>
                      <FrontBtnGroupCom
                        :size="size"
                        :index="i"
                        :row="row"
                        :list="item.tableList"
                        @editChild="editChild"
                        @handleChildrenData="handleChildrenData(row, 'save')"
                      />
                    </template>
                  </template>
                  <template v-else>-</template>
                  <el-button
                    class="reset-margin"
                    link
                    type="danger"
                    :size="size"
                    v-if="!row.isBackEndReturnData"
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
                    v-if="!row.isBackEndReturnData"
                    :icon="useRenderIcon(Delete)"
                    @click="item.tableList.pop()"
                  >
                    {{ t('取消') }}
                  </el-button>
                </div>
              </template>
              <!-- -数据商 -->
              <template #dataSourceCode="{ row }: MatchEventRowType">
                <el-text
                  v-if="row.isBackEndReturnData && row.settleType === 0"
                  v-for="(_, index) in eventQuotientList"
                  :key="index"
                  :type="row[_.type] === 1 ? 'primary' : 'info'"
                  :class="['!text-xs', index === 1 && '!mr-2 !ml-2']"
                  >{{ _.val }}</el-text
                >
                <span v-else>-</span>
              </template>
            </pure-table>
            <div
              class="flex items-center mt-2 text-sm"
              v-if="
                renderObj.settlementType !== 1 &&
                !renderObj.fullSettlementStatus
              "
            >
              <span
                class="mr-3 text-[var(--el-color-danger)] cursor-pointer"
                @click="addChildRow(item.tableList, item.type)"
                >{{ t('人工结算中') }}...</span
              >
              <IconifyIconOffline
                class="cursor-pointer"
                width="25px"
                icon="icon_circle_fill"
                @click="addChildRow(item.tableList, item.type)"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import DetiltTitle from '../../component/Settle_detail_title.vue';
import BackEndBtnGroupCom from './BackEndBtnGroup.vue';
import FrontBtnGroupCom from './FrontBtnGroup.vue';
import CountDownBtn from './CountDownBtn.vue';
import SettleMatchBtn from './SettleMatchBtn.vue';
import MatchTime from './MatchTime.vue';
import EventCode from './EventCode.vue';
import MatchStage from './MatchStage.vue';
import EventSource from './EventSource.vue';
import { t } from '@/plugins/i18n';
import { useFootball } from './util/hook';
import { usePublicHooks } from '@/hooks';
import Delete from '@iconify-icons/ep/delete';
import { MatchEventRowType, MatchEventType } from './util/type';

const { tableHeaderStyle } = usePublicHooks();

const eventQuotientList = [
  { type: 'xjFlag', val: t('188数据') },
  { type: 'psFlag', val: t('熊猫数据') },
  { type: 'vsFlag', val: t('播控数据') }
];

const getCurrentCard = computed(() => {
  const data = {
    home: {
      red: 0,
      yellow: 0
    },
    away: {
      red: 0,
      yellow: 0
    }
  };
  dataList[1].tableList.forEach(item => {
    if (item.homeAway === 'home') {
      item.eventCode === 'yellow_card'
        ? (data.home.yellow += 1)
        : (data.home.red += 1);
    } else {
      item.eventCode === 'red_card'
        ? (data.away.yellow += 1)
        : (data.away.red += 1);
    }
  });
  return data;
});

//- 取消事件置灰
const tableRowClassName = ({ row }: MatchEventRowType) =>
  row.canceled === 1 ? 'pure-warning-row' : '';

const teamChangeEvent = (
  row: SattleDataAPI.MatchEventsList,
  childIndex: number,
  childrenData: SattleDataAPI.MatchEventsList[],
  type: string
) => {
  if (!row.homeAway) return;
  const isHome = row.homeAway === 'home';
  const isYellowRedCard = type === MatchEventType.YellowRedCard;
  if (childIndex === 0) {
    row.t1 = isHome ? 1 : 0;
    row.t2 = isHome ? 0 : 1;
    if (isYellowRedCard) {
      if (row.redOrYellow === 2) {
        row.t1R = isHome ? 1 : 0;
        row.t2R = isHome ? 0 : 1;
      } else {
        row.t1Y = isHome ? 1 : 0;
        row.t2Y = isHome ? 0 : 1;
      }
    }
  } else {
    const prevRow = childrenData[childIndex - 1];
    const t1Increment = isHome ? 1 : 0;
    const t2Increment = isHome ? 0 : 1;
    row.t1 = +prevRow.t1 + t1Increment;
    row.t2 = +prevRow.t2 + t2Increment;
    if (isYellowRedCard) {
      if (row.redOrYellow === 2) {
        row.t1R = +(prevRow.t1R ?? 0) + t1Increment;
        row.t2R = +(prevRow.t2R ?? 0) + t2Increment;
        row.t1 = row.t1R;
        row.t2 = row.t2R;
        row.t1Y = prevRow.t1Y;
        row.t2Y = prevRow.t2Y;
      } else {
        row.t1Y = +(prevRow.t1Y ?? 0) + t1Increment;
        row.t2Y = +(prevRow.t2Y ?? 0) + t2Increment;
        row.t1 = row.t1Y;
        row.t2 = row.t2Y;
        row.t1R = +(prevRow.t1R ?? 0);
        row.t2R = +(prevRow.t2R ?? 0);
      }
    }
  }
};

const {
  childloading,
  dataList,
  childColumns,
  addChildRow,
  cancelMatchEvent,
  editChild,
  balanceLoading,
  settlementFunction,
  handleChildrenData,
  childDataTotal,
  reloadTable,
  changeSettleType,
  advanceSettlement,
  renderObj,
  yellow_red_column,
  allSettleBtnClick,
  allSettleLoading
} = useFootball();
</script>

<style lang="scss">
.football_detail {
  .el-table--fit {
    max-height: 460px;
  }
}
</style>
