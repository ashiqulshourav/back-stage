<template>
  <div class="main">
    <!-- -盘口详情 -->
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
      :allSettleLoading="allSettleLoading"
    />
    <PureTableBar :columns="childColumns" @refresh="reloadTable">
      <template #title>{{ baseTitle }}</template>
      <template v-slot="{ size, dynamicColumns }"> </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { MATCH_EVENT_CODE, MATH_RULE } from '@/utils/maps/sports_map';
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

const baseTitle = computed(() => {
  return MATH_RULE.basketBall.find(item => item.key === renderObj.periodType)
    ?.val;
});
</script>

<style scoped></style>
