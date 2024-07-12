<template>
  <div class="main">
    <SearchForm
      :form="form"
      :loading="loading"
      @on-search="onSearch"
      @exportFile="exportFile"
      :category="category"
      :tenantList="tenantList"
      :riskLabelList="riskLabelList"
      :venueType="props.venueType"
      :downloading="downloading"
    />

    <PureTableBar
      title=""
      :columns="columns"
      class="relative"
      :isShowHeader="false"
      @refresh="onSearch('reload')"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          class="table_container"
          adaptive
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handlePageSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #index="{ row }">
            <span>{{ row.index }}</span>
          </template>
          <template #userMessage="{ row }">
            <div class="flex">
              <div>
                <div
                  class="item_line cursor-pointer"
                  @click="
                    copyTest(
                      row.userId,
                      t('用户ID：{value}', { value: row.userId })
                    )
                  "
                >
                  <span>{{ t('用户ID：') }}</span
                  >{{ row.userId }}
                </div>
                <div
                  class="item_line cursor-pointer"
                  @click="
                    copyTest(
                      row.userName,
                      t('用户名：{value}', { value: row.userName })
                    )
                  "
                >
                  <span>{{ t('用户名：') }}</span
                  >{{ row.userName }}
                </div>
                <div
                  class="item_line cursor-pointer"
                  @click="
                    copyTest(
                      tenantObj[row.tenantId]?.tenantName,
                      t('商户名：{value}', {
                        value: tenantObj[row.tenantId]?.tenantName
                      })
                    )
                  "
                >
                  <span>{{ t('商户名：') }}</span
                  >{{ tenantObj[row.tenantId]?.tenantName }}
                </div>
                <div
                  class="item_line cursor-pointer"
                  @click="
                    copyTest(
                      row.tenantId,
                      t('商户编码：{value}', {
                        value: tenantObj[row.tenantId]?.name
                      })
                    )
                  "
                >
                  <span>{{ t('商户编码：') }}</span
                  >{{ tenantObj[row.tenantId]?.name }}
                </div>
                <div
                  v-if="row.combineOrderDetails.length > 1"
                  class="item_line mt-2 color_blue"
                >
                  {{
                    String(row.seriesType).slice(-3) === '001' ? '串关' : '复式'
                  }}
                  <span>{{
                    formatSeriesType(
                      row?.seriesType,
                      row.combineOrderDetails.length
                    )
                  }}</span>
                  <span class="ml-1"
                    >总计：{{
                      `${calculateSeriesTypeTotalBets(
                        row?.seriesType
                      )}注 每注：${row.orderAmount}`
                    }}</span
                  >
                </div>
              </div>
              <div>
                <RiskLabelList
                  :list="row.riskControlLabelList"
                  :showNumber="1"
                />
              </div>
            </div>
          </template>
          <template #matchMessage="{ row }">
            <div
              class="match_item match_detail eq-height"
              v-for="item in row.combineOrderDetails"
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
                  @click="
                    copyTest(
                      item.homeTeamNameCn,
                      t('主队：{value}', { value: item.homeTeamNameCn })
                    )
                  "
                  >{{ item.homeTeamNameCn }}</span
                >
                vs
                <span
                  class="cursor-pointer"
                  @click="
                    copyTest(
                      item.awayTeamNameCn,
                      t('客队：{value}', { value: item.awayTeamNameCn })
                    )
                  "
                  >{{ item.awayTeamNameCn }}</span
                >
              </div>
              <div
                class="item_line cursor-pointer"
                @click="
                  copyTest(
                    item.leagueNameCn,
                    t('联赛名：{value}', { value: item.leagueNameCn })
                  )
                "
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
                  dayjs(item.beginTime ?? Date.now())
                    .tz('Asia/Shanghai')
                    .format('MM-DD HH:mm:ss')
                }}
              </div>
            </div>
          </template>
          <template #betDetail="{ row }">
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
                class="item_line cursor-pointer flex items-baseline gap-1"
                @click="
                  copyTest(row.id, t('注单号：{value}', { value: row.id }))
                "
              >
                {{ t('注单号:') }} {{ row.id }}
                <span class="inline-block">
                  <IconifyIconOffline icon="copyIcon" />
                </span>
              </div>
              <div class="item_line">
                {{ t('投注时间:')
                }}{{
                  row.createTime
                    ? dayjs(row.createTime).format('MM-DD HH:mm:ss')
                    : ''
                }}
              </div>
              <div class="item_line">
                {{ t('投注IP:') }}
                <span
                  v-if="item.ip"
                  @click="openIpDialog(item.ip)"
                  class="text-[#409EFF] cursor-pointer"
                  >{{ item.ip }}</span
                >
                <span v-else>-</span>
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
              >{{ row.profitAmount.toFixed(2) }}</span
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
            <div v-if="String(row.seriesType).slice(-3) === '001'">
              {{ t('总赔率:')
              }}{{
                String(row.seriesType).slice(-3) === '001'
                  ? calculateSeriesTypeTotal(row.combineOrderDetails)
                  : ''
              }}
            </div>
          </template>
          <template #operation="{ row }">
            <div>
              <el-button
                class="mb-1 w-100"
                @click="handleCancel(row)"
                v-if="
                  row.billStatus === 0 &&
                  isShowCancel(row) &&
                  hasAuth('CANCELBET')
                "
              >
                {{ t('取消') }}
              </el-button>
            </div>
            <div>
              <el-button
                class="mb-1 w-100"
                @click="switchDialog(true, row)"
                v-if="
                  !(row.status == 2 || row.isReserve === 1) &&
                  hasAuth('specialSettlement'.toUpperCase())
                "
              >
                {{ t('特殊结算') }}
              </el-button>
            </div>
          </template>
          <template #operationRemark="{ row }">
            <div>
              <div>{{ row.orderRemark }}</div>
              <div>
                <el-button
                  size="small"
                  type="primary"
                  link
                  :icon="useRenderIcon(EditPen)"
                  @click="editOrderRemark(row.id, row.orderRemark)"
                >
                  {{ t('备注') }}
                </el-button>
              </div>
            </div>
          </template>
        </pure-table>
        <div
          class="bottom_content absolute bottom-7 flex max-w-[50%] items-center text-sm flex-wrap"
        >
          <div>
            <label>{{ t('总计：') }}</label>
            <span>{{ addThousandSeparator(totalInfo?.thisPageBetCount?.toString()||'0') }}{{ t('单') }}</span>
          </div>
          <div>
            <label>{{ t('用户数：') }}</label>
            <span
              >{{
                addThousandSeparator(
                  totalInfo?.thisPageBetUserCount?.toString()
                ) ?? 0
              }}{{ t('人') }}</span
            >
          </div>
          <div>
            <label>{{ t('总计投注额：') }}</label>
            <span class="ml-1">
              {{
                addThousandSeparator(
                  totalInfo?.thisPageBetTotalAmount?.toFixed(2)
                ) ?? '0.00'
              }}</span
            >
          </div>
          <div>
            <label>{{ t('总输赢：') }}</label>
            <span class="ml-1">
              {{
                addThousandSeparator(
                  totalInfo?.thisPageBetTotalProfitAmount?.toFixed(2)
                ) ?? '0.00'
              }}</span
            >
          </div>
          <div>
            <label>{{ t('注单均赔率：') }}</label>
            <span class="ml-1">
              {{
                addThousandSeparator(
                  totalInfo?.thisPageAvgOdds?.toFixed(2)
                ) ?? '0.00'
              }}</span
            >
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import { PureTableBar } from '@/components/RePureTableBar';
import { useBettingCenterHook } from './util/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import RiskLabelList from './component/riskLabelList.vue';
import { hasAuth } from '@/router/utils';
import { adjustContentWithRowHeight } from '@/utils/adjustRowCoulmnHeight';
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
  enterGoalMap
} from '@/utils/formatMatch';
import { betStatus, betStatusMap } from './util/types';
import { usePublicHooks } from '@/hooks';
import { addThousandSeparator } from '@/utils/formatNumber';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import EditPen from '@iconify-icons/ep/edit-pen';

const props = defineProps<{
  category: number;
  venueType: number;
}>();
defineOptions({ name: 'bettingCenter' });

dayjs.extend(utc);
dayjs.extend(timezone);

const { tableHeaderStyle } = usePublicHooks();
const {
  loading,
  dataList,
  pagination,
  totalInfo,
  form,
  onSearch,
  handlePageSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  exportFile,
  handleCancel,
  getStatus,
  copyTest,
  tenantList,
  switchDialog,
  tenantObj,
  isShowCancel,
  editOrderRemark,
  riskLabelList,
  getOddStatus,
  downloading,
  openIpDialog
} = useBettingCenterHook(props.category, props.venueType);

onMounted(() => {
  adjustContentWithRowHeight();
});

onUpdated(() => {
  adjustContentWithRowHeight();
});
</script>

<style lang="scss">
.is-horizontal {
  display: block !important;
  height: 10px !important;
}

.bottom_content {
  & > div {
    margin-left: 10px;
    display: flex;
    label {
      margin-left: 10px;
    }
  }
}
.match_detail {
  min-width: 200px;
}
.bet_detail {
  min-width: 200px;
}
.match_item {
  margin-bottom: 10px;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
}
.item_line {
  text-align: left;
  max-width: 250px;
}
.isInplay {
  position: absolute;
  right: 10px;
  top: 10px;
}
.win {
  padding: 2px 4px;
  font-style: normal;
  font-weight: 400;
  border-radius: 4px;
  color: #dd5454;
}
.lose {
  padding: 2px 4px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;

  color: green;
}
.color_blue {
  color: blue;
  font-size: 12px;
}
.status_btn {
  text-align: center;
  height: 25px;
  line-height: 25px;
  padding: 0 8px;
  color: #fff;
  border-radius: 4px;
  width: auto;
  display: inline-block;
  min-width: max-content;
}
.odd_item {
  min-width: 80px;
}

.operate {
  width: 100px;
}

.eq-height {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
