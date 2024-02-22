<template>
  <div class="main">
    <!-- -盘口详情 -->
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
      :allSettleLoading="allSettleLoading"
    />
    <PureTableBar
      :title="t('蓝球结算管理')"
      :columns="childColumns"
      @refresh="reloadTable"
    >
      <template v-slot="{ size, dynamicColumns }">
        <div class="m-4">
          <div class="mt-3 mb-1 font-bold">
            {{ MATCH_EVENT_CODE[item.type] }}
          </div>

          <pure-table
            align-whole="center"
            :row-key="row => row.id"
            :data="item.tableList"
            :loading="childloading"
            :columns="dynamicColumns"
            :row-class-name="tableRowClassName"
            size="small"
            table-layout="auto"
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

            <!-- -事件是否有效 -->
            <!-- <template #canceled="{ row }: MatchEventRowType">
                  <el-text
                    :class="[
                      '!text-xs',
                      row.canceled === 1 && '!text-sm font-bold'
                    ]"
                    :type="row.canceled === 1 ? 'danger' : 'info'"
                    >{{ row.canceled === 1 ? t('否') : t('是') }}</el-text
                  >
                </template> -->

            <!-- -结算类型 -->
            <template #settleType="{ row }: MatchEventRowType">
              <CountDownBtn
                :row="row"
                :parentRow="parentRow"
                v-show="row.isShowCount"
              />
              <span v-show="!row.isShowCount">
                {{
                  row.settleType === 0 || parentRow.settlementType === 1
                    ? t('自动结算')
                    : t('人工结算')
                }}
              </span>
            </template>

            <!-- -比赛进行时间 -->
            <template #eventTime="{ row, index }: MatchEventRowType">
              <MatchTime
                :row="row"
                :index="index"
                :item="item"
                :beginTime="parentRow.beginTimeLong"
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
                <template v-if="row.isBackEndReturnData">
                  <BackEndBtnGroupCom
                    :row="row"
                    :parentRow="parentRow"
                    :size="size"
                    @changeSettleType="changeSettleType"
                    :parIndex="parIndex"
                    @handleChildrenData="handleChildrenData"
                    @cancelMatchEvent="cancelMatchEvent"
                    :dataList="parentRow.childrenData[idx].tableList"
                    :index="i"
                    :isShowCount="row.isShowCount"
                    @advanceSettlement="advanceSettlement"
                  />
                </template>
                <template v-else="!row.isBackEndReturnData">
                  <FrontBtnGroupCom
                    :size="size"
                    :row="row"
                    @editChild="editChild"
                    @handleChildrenData="
                      handleChildrenData(row, parIndex, 'save', parentRow)
                    "
                  />
                </template>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  v-if="!row.isBackEndReturnData"
                  :disabled="!row.isSave || row.isEdit"
                  :icon="useRenderIcon('uploadIcon')"
                  @click="
                    handleChildrenData(row, parIndex, 'upload', parentRow)
                  "
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
          <div class="mt-2 cursor-pointer">
            <el-button
              v-if="parentRow.settlementType === 1"
              class="ml-1 reset-margin"
              @click="changeSettleType(parentRow.matchId)"
              >{{ t('开启人工结算') }}</el-button
            >
            <div class="flex items-center" v-else>
              <span class="mr-3 text-[var(--el-color-danger)]"
                >{{ t('人工结算中') }}...</span
              >
              <IconifyIconOffline
                width="25px"
                icon="icon_circle_fill"
                @click="addChildRow(item.tableList, item.type)"
              />
            </div>
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { MATCH_EVENT_CODE } from '@/utils/maps/sports_map';
import BackEndBtnGroupCom from './component/BackEndBtnGroup.vue';
import FrontBtnGroupCom from './component/FrontBtnGroup.vue';
import CountDownBtn from './component/CountDownBtn.vue';
import SettleMatchBtn from './component/SettleMatchBtn.vue';
import MatchTime from './component/MatchTime.vue';
import EventCode from './component/EventCode.vue';
import MatchStage from './component/MatchStage.vue';
import EventSource from './component/EventSource.vue';
import { t } from '@/plugins/i18n';
import { useNewBasketBallHook } from './utils/hook';
import { usePublicHooks } from '@/hooks';
import Delete from '@iconify-icons/ep/delete';
import {
  MatchEventRowType,
  MatchEventType,
  SearchFormType,
  parentRowType
} from './utils/type';
import { useMatchStore } from '@/store/match';
import DetiltTitle from '../component/Settle_detail_title.vue';

defineOptions({ name: 'SETTLE_NEW_BASKETBALL_DETAIL' });

const {
  childloading,
  allSettleLoading,
  dataList,
  form,
  switchLoadMap,
  childColumns,
  getChildrenData,
  addChildRow,
  editChild,
  balanceLoading,
  settlementFunction,
  handleChildrenData,
  childDataTotal,
  expandMatchList,
  reloadTable,
  changeSettleType,
  cancelMatchEvent,
  advanceSettlement,
  renderObj,
  allSettleBtnClick
} = useNewBasketBallHook();

const props = defineProps<{
  form: SearchFormType;
}>();

const { tableHeaderStyle } = usePublicHooks();

const eventQuotientList = [
  { type: 'xjFlag', val: t('188数据') },
  { type: 'psFlag', val: t('熊猫数据') },
  { type: 'vsFlag', val: t('播控数据') }
];

const matchStore = useMatchStore();

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
    row.t1 = isHome ? (isYellowRedCard ? row.redOrYellow : 1) : 0;
    row.t2 = isHome ? 0 : isYellowRedCard ? row.redOrYellow : 1;
  } else {
    const prevRow = childrenData[childIndex - 1];
    const t1Increment = isHome
      ? isYellowRedCard
        ? (row.redOrYellow as number)
        : 1
      : 0;
    const t2Increment = isHome
      ? 0
      : isYellowRedCard
      ? (row.redOrYellow as number)
      : 1;
    row.t1 = +prevRow.t1 + t1Increment;
    row.t2 = +prevRow.t2 + t2Increment;
  }
};

form.value = props.form;

const filterData = (type: 'reload') => {
  onSearch(type);
};

defineExpose({ filterData });
</script>

<style scoped></style>
