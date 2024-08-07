<template>
  <div class="w-1/2" v-if="bettingHistory">
    <div class="flex gap-2 mb-3">
      <span>{{ t('注单编号') }}:</span>
      <span>{{ bettingHistory.orderId }}</span>
    </div>
    <div class="flex mb-3">
      <p class="flex-1 flex gap-2">
        <span>{{ t('会员账号') }}:</span>
        <span>{{ bettingHistory.userName }}</span>
      </p>
      <p class="flex-1 flex gap-2">
        <span>{{ t('投注金额') }}:</span>
        <span>{{ bettingHistory.orderAmount }}</span>
      </p>
    </div>
    <div class="flex mb-3">
      <p class="flex-1 flex gap-2">
        <span>{{ t('过关类型') }}:</span>
        <span>{{ bettingHistory.seriesType }}</span>
      </p>
      <p class="flex-1 flex gap-2">
        <span>{{ t('投注时间') }}:</span>
        <span>{{ dayjs(bettingHistory.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
      </p>
    </div>
  </div>

  <pure-table
    maxHeight="500"
    align-whole="center"
    table-layout="fixed"
    showOverflowTooltip
    size="small"
    border
    :header-cell-style="tableHeaderStyle"
    :data="bettingHistoryList"
    :columns="settleHistoryColumns"
  >
    <template #matchMessage="{ row }">
      <div
        class="match_item match_detail eq-height"
        v-for="item in row.details"
        :key="item.betItemId"
      >
        <div
          v-if="
            item.kindsCode?.includes('Outright') ||
            item.kindsCode?.includes('moutright')
          "
          class="item_line"
        >
          <span>冠军赛事</span>
        </div>
        <div v-else class="item_line">
          <span
            class="cursor-pointer"
            >{{ item.homeTeamNameCn }}</span
          >
          vs
          <span
            class="cursor-pointer"
            >{{ item.awayTeamNameCn }}</span
          >
        </div>
        <div
          class="item_line cursor-pointer"
        >
          {{ item.sportNameCn }}/{{ item.leagueNameCn }}
        </div>
        <div
          class="item_line cursor-pointer flex items-baseline gap-1"
          @click="
            copyTest(
              item.matchId,
              t('赛事ID：{value}', { value: item.matchId })
            )
          "
        >
          {{ t('赛事ID:') }} {{ item.matchId }}
          <span class="inline-block">
            <IconifyIconOffline icon="copyIcon" />
          </span>
        </div>
        <div class="item_line">
          {{ t('开赛时间:')
          }}{{
            dayjs(item.beginTime)
              ?.tz('Asia/Shanghai')
              ?.format('MM-DD HH:mm:ss')
          }}
        </div>
      </div>
    </template>
    <template #betItem="{ row }">
      <div
        class="match_item bet_detail eq-height"
        v-for="item in row.combineOrderDetails"
        :key="item.betItemId"
      >
        <div class="item_line">
          {{
            `玩法：${useSportFormatDetail(item)[4]} ${getIsInplay(
              item.marketType
            )}`
          }}
          {{
            item.marketType == 1
              ? displayHomeAwayScore(item.scoreBenchmark, item.sportId)
              : ''
          }}
        </div>
        <div class="item_line">
                <span v-if="item.kindsCode === 'FT_TTS'">
                  {{
                    enterGoalMap[
                      item.betHandicap.toUpperCase() as keyof typeof enterGoalMap
                      ]
                  }}
                </span>
          {{ useSportFormatDetail(item)[3] }} @{{
            getViewOddFn(
              item.oddFinally,
              item.marketTypeFinally,
              item.marketType
            )
          }}
        </div>
        <div
          class="item_line"
          v-if="
                  row.billStatus === 1 &&
                  item.settleScore &&
                  !(
                    displayHomeAwayScore(
                      item.settleScore,
                      item.sportId,
                      'home'
                    ) == '' ||
                    displayHomeAwayScore(
                      item.settleScore,
                      item.sportId,
                      'away'
                    ) == ''
                  )
                "
        >
                <span v-if="item.kindsCode !== 'TeamToKickOff'">
                  {{ t('结算比分：')
                  }}{{ displayHomeAwayScore(item.settleScore, item.sportId) }}
                </span>
        </div>
      </div>
    </template>
<!--    <template #betItem="{ row }">
      <div
        class="match_item bet_detail eq-height"
        v-for="item in row.combineOrderDetails"
        :key="item.betItemId"
      >
        <div class="item_line">
          {{
            `玩法：${useSportFormatDetail(item)[4]} ${getIsInplay(
              item.isInplay
            )}`
          }}
          {{
            item.isInplay == 1
              ? displayHomeAwayScore(item.scoreBenchmark, item.sportId)
              : ''
          }}
        </div>
        <div class="item_line">
          <span v-if="item.kindsCode === 'FT_TTS'">
            {{
              enterGoalMap[
                item.betHandicap.toUpperCase() as keyof typeof enterGoalMap
                ]
            }}
          </span>
          {{ useSportFormatDetail(item)[3] }} @{{
            getViewOddFn(
              item.oddFinally,
              item.marketTypeFinally,
              item.marketType
            )
          }}
        </div>
        <div
          class="item_line"
          v-if="
            row.billStatus === 1 &&
            item.settleScore &&
            !(
              displayHomeAwayScore(
                item.settleScore,
                item.sportId,
                'home'
              ) == '' ||
              displayHomeAwayScore(
                item.settleScore,
                item.sportId,
                'away'
              ) == ''
            )
          "
        >
          <span v-if="item.kindsCode !== 'TeamToKickOff'">
            {{ t('结算比分：')
            }}{{ displayHomeAwayScore(item.settleScore, item.sportId) }}
          </span>
        </div>
      </div>
    </template>
    <template #orderStatusView="{row}">
      {{ row.orderStatusView }}
    </template>
    <template #odd="{ row }">
      <div
        class="match_item odd_item eq-height"
        v-for="item in row.combineOrderDetails"
        :key="item.id"
      >
        <div>
          {{
            getViewOddFn(
              item.oddFinally,
              item.marketTypeFinally,
              item.marketType
            )
          }}
        </div>
        <div>
          {{ markeTypeMap[item.marketType as keyof typeof markeTypeMap] }}
        </div>
        <div v-if="getOddStatus(item?.betResult, item.riskStatus)">
          <span
            :class="
              [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(
                item?.betResult
              )
                ? 'win'
                : 'lose'
            "
          >
            {{ getOddStatus(item?.betResult, item.riskStatus) }}
          </span>
        </div>
      </div>
    </template>
    <template #profitAmount="{ row }">
      <span
        v-if="row.profitAmount"
        :class="row.profitAmount > 0 ? 'win' : 'lose'"
        >{{ row.profitAmount > 0 ? "+" + row.profitAmount.toFixed(2): row.profitAmount.toFixed(2) }}</span
      >
      <span v-else>-</span>
    </template>
    <template #status="{ row }">
      <div
        :style="{
          background: getStatus(
            row.status,
            row.billStatus,
            row.betResultArr,
            row.isReserve,
            row.riskStatusArr,
            row.isSpecialSettle
          ).bgColor
        }"
        class="status_detail status_btn mb-1 mx-auto"
      >
        {{
          betStatusMap[
            getStatus(
              row.status,
              row.billStatus,
              row.betResultArr,
              row.isReserve,
              row.riskStatusArr,
              row.isSpecialSettle
            ).status as keyof typeof betStatusMap
          ]
        }}
      </div>
      <div
        v-if="
          getStatus(
            row.status,
            row.billStatus,
            row.betResultArr,
            row.isReserve,
            row.riskStatusArr,
            row.isSpecialSettle
          ).status === betStatus.settlementBet
        "
      >
        {{
          row.settleTime
            ? dayjs(row.settleTime).format('MM-DD HH:mm:ss')
            : ''
        }}
      </div>
    </template>-->
  </pure-table>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import dayjs from "dayjs";
import { settleHistoryColumns } from './TableColumnList';
import { usePublicHooks } from '@/hooks';
import { copyTextToClipboard } from '@pureadmin/utils';
import { message } from '@/utils/message';
import {
  formatSeriesType,
  useSportFormatDetail,
  EBetResultType,
  getViewOddFn,
  markeTypeMap,
  calculateSeriesTypeTotal,
  calculateSeriesTypeTotalBets,
  displayHomeAwayScore,
  getIsInplay,
  enterGoalMap,
  openIpDialog,
  BET_RESULT_TYPE_MAP
} from '@/utils/formatMatch';
import { riskStatus } from '@/views/riskManagement/com/bettingAudit/util/types';
import { betStatus, betStatusMap } from '../util/types';

const { tableHeaderStyle } = usePublicHooks();

const bettingHistory = ref<any>({});
const bettingHistoryList = reactive<any>([]);

const props = defineProps<{
  order_id: string;
}>();

const init = async () => {
  try {
    const res = await API.getSettleHistory(props.order_id)
    if (!res.code) {
      bettingHistory.value = res.data;
      bettingHistoryList.length = 0;
      bettingHistoryList.push(...res.data.settleHistorys)

      console.log(33333,bettingHistoryList)
    }

  } catch (e) {

  }
}

onMounted(() => {
  init();
})

function copyTest(str: string, tip: string) {
  if (!str) return;
  const success = copyTextToClipboard(str.toString());
  success
    ? message(t('复制{value}成功!', { value: tip || str || '' }), {
      type: 'success'
    })
    : message(t('复制失败'), { type: 'error' });
}

const getOddStatus = (betResult: number, riskSt: number) => {
  if (riskSt === riskStatus.reject1 || riskSt === riskStatus.autoReject1) {
    return '投注失败';
  } else if (
    riskSt === riskStatus.reject ||
    riskSt === riskStatus.autoReject
  ) {
    return '无效注单';
  } else if (betResult === 24 && riskSt == riskStatus.autoApprove) {
    return '盘口取消';
  } else {
    return (
      BET_RESULT_TYPE_MAP[betResult as keyof typeof BET_RESULT_TYPE_MAP] || ''
    );
  }
};

const getStatus = (
  status: number,
  billStatus: number,
  betResultArr: number[],
  isReserve: number,
  riskStatusArr?: number[],
  isSpecialSettle?: number
) => {
  let obj = { status: -1, bgColor: '' };
  if (isSpecialSettle === 1) {
    // 特殊结算也算已结算
    obj = { status: betStatus.settlementBet, bgColor: '#40A9FF' };
  } else if (betResultArr?.includes(22) || betResultArr?.includes(25)) {
    //预约取消
    obj = { status: betStatus.reverseCancel, bgColor: '#F57582' };
  } else if (riskStatusArr?.includes(riskStatus.rejectBetting)) {
    //待审核
    obj = { status: betStatus.PendingApprove, bgColor: '#F57582' };
  } else if (
    betResultArr?.includes(61) &&
    (riskStatusArr?.includes(riskStatus.reject) ||
      riskStatusArr?.includes(riskStatus.autoReject))
  ) {
    // 封控划单 203 204
    obj = { status: betStatus.riskReject, bgColor: '#F88D48' };
  } else if (
    riskStatusArr?.includes(riskStatus.reject1) ||
    riskStatusArr?.includes(riskStatus.autoReject1)
  ) {
    // 封控拒单 201 202
    obj = { status: betStatus.betFail, bgColor: '#F88D48' };
  } else if (
    status == 2 &&
    billStatus === 1 &&
    (betResultArr?.includes(22) || betResultArr?.includes(23) || betResultArr?.includes(25))
  ) {
    // 注单无效
    obj = { status: betStatus.betInvalid, bgColor: '#E54752' };
  } else if (
    riskStatusArr?.includes(riskStatus.autoApprove) &&
    betResultArr.includes(24)
  ) {
    // 注单无效
    obj = { status: betStatus.betInvalid, bgColor: '#E54752' };
  } else if (status === 2 && billStatus === 1 && betResultArr?.includes(21)) {
    // 预约失败
    obj = { status: betStatus.reserveFail, bgColor: '#F57582' };
  } else if (status === 0 && billStatus === 0) {
    // 未结算
    if (isReserve === 1) {
      // 预约中
      obj = { status: betStatus.onReverse, bgColor: '#F57582' };
    } else {
      obj = { status: betStatus.unsettlementBet, bgColor: '#FFC53D' };
    }
  } else if (status === 1 && billStatus === 1) {
    // 已结算
    obj = { status: betStatus.settlementBet, bgColor: '#40A9FF' };
  } else if (status === 3) {
    // 待确认
    obj = { status: betStatus.PendingApprove, bgColor: '#FFC53D' };
  } else if (status === 4) {
    // 投注失败
    obj = { status: betStatus.betFail, bgColor: '#F57582' };
  } else if (status === 5) {
    // 赛事异常
    obj = { status: betStatus.eventAbnormal, bgColor: '#F88D48' };
  }
  return obj;
};
</script>

<style lang="scss">

</style>
