<template>
  <div class="pt-[20px]">
    <div class="relative pl-10 pr-5 w-full text-white dark:bg-[#3e3e3e]">
      <TimeLine />
      <div>
        <div class="bg-[#deedfe] dark:bg-[#676877] h-[35px] flex relative">
          <EventIcon
            v-for="(item, index) in matchData.event"
            :key="index"
            :type="t('主队')"
            :data="item.home"
            :index="index"
          />
        </div>

        <!-- - 内容部分 -->
        <BetAmount
          :renderList="renderList"
          :matchId="matchId"
          @getBetDetail="getBetDetail"
        />

        <div class="bg-[#deedfe] dark:bg-[#676877] h-[35px] flex relative">
          <EventIcon
            v-for="(item, index) in matchData.event"
            :key="index"
            :type="t('客队')"
            :data="item.away"
            :index="index"
          />
        </div>
      </div>
      <TimeLine />

      <!-- - 左侧球队信息 -->
      <div
        :class="[
          'absolute top-[30px] flex items-center left-0 cursor-pointer justify-center',
          i === 1 && '!top-auto bottom-2'
        ]"
        v-for="i in [0, 1]"
        :key="i"
      >
        <el-tooltip
          :content="
            i === 0 ? matchData.homeTeamNameCn : matchData.awayTeamNameCn
          "
          placement="top-start"
        >
          <img
            :src="i === 0 ? homePic : awayPic"
            class="h-[30px]"
            :alt="i === 0 ? matchData.homeTeamNameCn : matchData.awayTeamNameCn"
          />
        </el-tooltip>
      </div>
    </div>
    <div class="pr-4 pl-10 pt-3" v-if="Object.keys(betInfo).length">
      <el-descriptions
        :title="t('注单信息')"
        direction="vertical"
        :column="8"
        size="small"
        border
      >
        <el-descriptions-item :label="t('用户信息')" align="center">
          <div class="flex flex-col">
            <div>
              <span>{{ t('用户ID:') }}</span>
              <span>{{ betInfo.userId }}</span>
            </div>
            <div>
              <span>{{ t('用户名:') }}</span>
              <span>{{ betInfo.userName }}</span>
            </div>
            <div>
              <span>{{ t('商户名:') }}</span>
              <span>{{ tenantObj[betInfo.tenantId]?.tenantName }}</span>
            </div>
            <div>
              <span>{{ t('商户编码:') }}</span>
              <span>{{ tenantObj[betInfo.tenantId]?.name }}</span>
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item :label="t('赛事信息')" align="center">
          <div>
            {{ betInfo.combineOrderDetails[0].homeTeamNameCn }}
            vs
            {{ betInfo.combineOrderDetails[0].awayTeamNameCn }}
          </div>
          <div>
            {{ betInfo.combineOrderDetails[0].sportNameCn }}/{{
              betInfo.combineOrderDetails[0].leagueNameCn
            }}
          </div>
          <div>
            {{ t('赛事ID:') }}{{ betInfo.combineOrderDetails[0].matchId }}
          </div>
          <div>
            {{ t('开赛时间:')
            }}{{
              dayjs(
                betInfo.combineOrderDetails[0].beginTime ?? Date.now()
              ).format('MM-DD HH:mm:ss')
            }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item :label="t('注单详情')" :span="2" align="center">
          <div>
            {{
              `玩法：${
                useSportFormatDetail(betInfo.combineOrderDetails[0])[4]
              } ${getIsInplay(betInfo.combineOrderDetails[0].isInplay)}`
            }}
            {{
              betInfo.combineOrderDetails[0].isInplay == 1
                ? displayHomeAwayScore(
                    betInfo.combineOrderDetails[0].scoreBenchmark,
                    betInfo.combineOrderDetails[0].sportId
                  )
                : ''
            }}
          </div>
          <div>
            {{ useSportFormatDetail(betInfo.combineOrderDetails[0])[3] }} @{{
              getViewOddFn(
                betInfo.combineOrderDetails[0].oddFinally,
                betInfo.combineOrderDetails[0].marketTypeFinally,
                betInfo.combineOrderDetails[0].marketType
              )
            }}
          </div>
          <div>{{ t('注单号:') }} {{ betInfo.id }}</div>
          <div>
            {{ t('投注时间:')
            }}{{
              betInfo.createTime
                ? dayjs(betInfo.createTime).format('MM-DD HH:mm:ss')
                : ''
            }}
          </div>
          <div
            v-if="
              betInfo.billStatus === 1 &&
              betInfo.combineOrderDetails[0].settleScore &&
              !(
                displayHomeAwayScore(
                  betInfo.combineOrderDetails[0].settleScore,
                  betInfo.combineOrderDetails[0].sportId,
                  'home'
                ) == '' ||
                displayHomeAwayScore(
                  betInfo.combineOrderDetails[0].settleScore,
                  betInfo.combineOrderDetails[0].sportId,
                  'away'
                ) == ''
              )
            "
          >
            {{ t('赛果：')
            }}{{
              displayHomeAwayScore(
                betInfo.combineOrderDetails[0].settleScore,
                betInfo.combineOrderDetails[0].sportId
              )
            }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item :label="t('状态')" align="center">
          <div class="flex flex-col items-center">
            <div
              :style="{
                background: getStatus(
                  betInfo.status,
                  betInfo.billStatus,
                  betInfo.betResultArr,
                  betInfo.isReserve,
                  betInfo.riskStatusArr,
                  betInfo.isSpecialSettle
                ).bgColor
              }"
              class="flex justify-center items-center rounded-md text-white px-5"
            >
              {{
                betStatusMap[
                  getStatus(
                    betInfo.status,
                    betInfo.billStatus,
                    betInfo.betResultArr,
                    betInfo.isReserve as number,
                    betInfo.riskStatusArr,
                    betInfo.isSpecialSettle
                  ).status as keyof typeof betStatusMap
                ]
              }}
            </div>
            <div
              class="text-center"
              v-if="
                getStatus(
                  betInfo.status,
                  betInfo.billStatus,
                  betInfo.betResultArr,
                  betInfo.isReserve,
                  betInfo.riskStatusArr,
                  betInfo.isSpecialSettle
                ).status === betStatus.settlementBet
              "
            >
              {{
                betInfo.settleTime
                  ? dayjs(betInfo.settleTime).format('MM-DD HH:mm:ss')
                  : ''
              }}
            </div>
            <div v-if="String(betInfo.seriesType).slice(-3) === '001'">
              {{ t('总赔率:')
              }}{{
                String(betInfo.seriesType).slice(-3) === '001'
                  ? calculateSeriesTypeTotal(betInfo.combineOrderDetails)
                  : ''
              }}
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item :label="t('赔率')" align="center">
          <div class="text-center">
            {{
              getViewOddFn(
                betInfo.combineOrderDetails[0].oddFinally,
                betInfo.combineOrderDetails[0].marketTypeFinally,
                betInfo.combineOrderDetails[0].marketType
              )
            }}
          </div>
          <div class="text-center">
            {{
              markeTypeMap[
                betInfo.combineOrderDetails[0]
                  .marketType as keyof typeof markeTypeMap
              ]
            }}
          </div>
          <div
            class="text-center"
            v-if="
              getOddStatus(
                betInfo.combineOrderDetails[0]?.betResult,
                betInfo.combineOrderDetails[0].riskStatus
              )
            "
          >
            <span
              :class="
                [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(
                  betInfo.combineOrderDetails[0]?.betResult
                )
                  ? 'win'
                  : 'lose'
              "
            >
              {{
                getOddStatus(
                  betInfo.combineOrderDetails[0]?.betResult,
                  betInfo.combineOrderDetails[0].riskStatus
                )
              }}
            </span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item :label="t('投注额')" align="center">
          <div class="text-center">
            {{ addThousandSeparator((+betInfo.productAmountTotal).toFixed(2)) }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item :label="t('用户输赢')" align="center">
          <span
            v-if="betInfo.profitAmount"
            :class="betInfo.profitAmount > 0 ? 'win' : 'lose'"
            >{{ (+betInfo.profitAmount).toFixed(2) }}</span
          >
          <span v-else>-</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import EventIcon from './com/EventIcon.vue';
import TimeLine from './com/TimeLine.vue';
import BetAmount from './com/BetAmount.vue';
import { message } from '@/utils/message';
import dayjs from 'dayjs';
import { addThousandSeparator } from '@/utils/formatNumber';
import {
  useSportFormatDetail,
  EBetResultType,
  getViewOddFn,
  markeTypeMap,
  calculateSeriesTypeTotal,
  displayHomeAwayScore,
  getIsInplay
} from '@/utils/formatMatch';
import { getStatus, betStatus, betStatusMap, getOddStatus } from './util/data';

const props = defineProps<{
  matchData: EventAPI.getMatchStatusticData;
  matchId: string;
}>();

const renderList = computed(() => {
  const s = props.matchData.bet.map(item => {
    let time = item.t.split(':');
    let t = +time[1];
    t = ((t / 60) * 100) / 100;
    t = +(+time[0] + t).toFixed(2);
    return [t, item.n, item.t, item.o];
  });
  return s;
});

const homePic = computed(() => {
  if (!props.matchData.homeTeamLogo) {
    return '';
  } else {
    return `https://awdpdownloads.domaf.com${props.matchData.homeTeamLogo}`;
  }
});
const awayPic = computed(() => {
  if (!props.matchData.awayTeamLogo) {
    return '';
  } else {
    return `https://awdpdownloads.domaf.com${props.matchData.awayTeamLogo}`;
  }
});

const betInfo = reactive<BetOrderAPI.BetOrderList>(
  {} as BetOrderAPI.BetOrderList
);

const getBetDetail = async (orderId: string) => {
  const res = await API.getCurrentBet({
    orderId,
    queryType: 1,
    pageSize: 20,
    pageNum: 1,
    export: false
  });
  if (res.code) return message(res.msg, { type: 'error' });
  Object.assign(betInfo, res.data.pageData[0]);
};

onMounted(() => {
  getTenantList();
});

const tenantList = reactive<{ name: string; id: number; tenantName: string }[]>(
  []
);
const tenantObj = reactive<any>({});
const getTenantList = async () => {
  const res = await API.queryTenantList({ category: 0 });
  if (res.data?.length) {
    tenantList.push(...res?.data);
    tenantList.map(item => {
      tenantObj[item.id] = item;
    });
  }
};
</script>
