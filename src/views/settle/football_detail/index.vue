<template>
  <!-- -盘口详情 -->
  <DetiltTitle
    @allSettleBtnClick="allSettleBtnClick"
    :renderObj="renderObj"
    :allSettleLoading="allSettleLoading"
  />

  

</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { MATCH_EVENT_CODE } from '@/utils/maps/sports_map';
import DetiltTitle from '../component/Settle_detail_title.vue';
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
import { MatchEventRowType, MatchEventType, parentRowType } from './util/type';
import { useMatchStore } from '@/store/match';

const {
  childloading,
  columns,
  dataList,
  pagination,
  handleTableWidthChange,
  handleCurrentChange,
  childColumns,
  expandChange,
  addChildRow,
  editChild,
  balanceLoading,
  settlementFunction,
  handleChildrenData,
  childDataTotal,
  reloadTable,
  changeSettleType,
  cancelMatchEvent,
  advanceSettlement,
  renderObj,
  yellow_red_column,
  allSettleBtnClick,
  allSettleLoading
} = useFootball();

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
</script>

<style scoped></style>
