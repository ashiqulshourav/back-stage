<template>
  <div class="main">
    <!-- @exportFile="exportFile" -->
    <SearchForm
      :form="form"
      :loading="loading"
      @on-search="onSearch"
      :tenantList="tenantList"
    />
    <PureTableBar
      :title="t('温馨提示：点击任一关的“拒接注单”按钮，即拒绝整个串关注单。')"
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
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #userMessage="{ row }">
            <div
              class="item_line cursor-pointer"
              @dblclick="
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
              @dblclick="
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
              @dblclick="
                copyTest(
                  row.tenantId,
                  t('商户ID：{value}', { value: row.tenantId })
                )
              "
            >
              <span>{{ t('商户ID：') }}</span
              >{{ row.tenantId }}
            </div>
            <div
              v-if="row.combineOrderDetails.length > 1"
              class="item_line mt-2 color_blue"
            >
              {{ String(row.seriesType).slice(-3) === '001' ? '串关' : '复式' }}
              <span>{{
                formatSeriesType(
                  row?.seriesType,
                  row.combineOrderDetails.length
                )
              }}</span>
              <span class="ml-1"
                >总计：{{
                  `${calculateSeriesTypeTotalBets(row?.seriesType)}注 每注：${
                    row.orderAmount
                  }`
                }}</span
              >
            </div>
          </template>

          <template #matchMessage="{ row }">
            <div
              class="match_item"
              v-for="item in row.combineOrderDetails"
              :key="item.betItemId"
            >
              <div class="item_line">
                <span
                  class="cursor-pointer"
                  @dblclick="
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
                  @dblclick="
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
                @dblclick="
                  copyTest(
                    item.leagueNameCn,
                    t('联赛名：{value}', { value: item.leagueNameCn })
                  )
                "
              >
                {{ item.sportNameCn }}/{{ item.leagueNameCn }}
              </div>
              <div
                class="item_line cursor-pointer"
                @dblclick="
                  copyTest(
                    item.matchId,
                    t('赛事ID：{value}', { value: item.matchId })
                  )
                "
              >
                {{ t('赛事ID:') }} {{ item.matchId }}
              </div>
              <div class="item_line">
                {{ t('开赛时间:')
                }}{{
                  dayjs(item.beginTime ?? Date.now()).format('MM-DD HH:mm:ss')
                }}
              </div>
            </div>
          </template>

          <template #betDetail="{ row }">
            <div
              class="match_item"
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
              <div class="item_line">{{ useSportFormatDetail(item)[3] }}</div>
              <div
                class="item_line cursor-pointer"
                @dblclick="
                  copyTest(row.id, t('注单号：{value}', { value: row.id }))
                "
              >
                {{ t('注单号:') }} {{ row.id }}
              </div>
              <div class="item_line">
                {{ t('投注时间:')
                }}{{
                  row.createTime
                    ? dayjs(row.createTime).format('MM-DD HH:mm:ss')
                    : ''
                }}
              </div>
              <div
                class="item_line"
                v-if="row.billStatus === 1 && item.settleScore"
              >
                {{ t('赛果：')
                }}{{ displayHomeAwayScore(item.settleScore, item.sportId) }}
              </div>
            </div>
          </template>
          <template #orderAcceptanceStatus="{ row }">
            <div class="h-full">
              <div
                class="match_item"
                v-for="item in row.combineOrderDetails"
                :key="item.betItemId"
              >
                <span v-if="row.combineOrderDetails.length < 2">
                  {{
                    getVal(
                      row.billStatus,
                      row.status,
                      item.betResult,
                      item.settleStatus
                    )
                  }}
                </span>
                <span v-else>
                  {{
                    getVal1(
                      row.billStatus,
                      item.betResult,
                      item.settleStatus,
                      item
                    )
                  }}
                </span>
              </div>
            </div>
          </template>
          <template #odd="{ row }">
            <div
              class="match_item odd_item"
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
              <div>{{ markeTypeMap[item.marketType] }}</div>
              <div v-if="BET_RESULT_TYPE_MAP[item?.betResult]">
                <span
                  :class="
                    [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(
                      item?.betResult
                    )
                      ? 'win'
                      : 'lose'
                  "
                >
                  {{ BET_RESULT_TYPE_MAP[item?.betResult] }}</span
                >
              </div>
            </div>
          </template>
          <!--   <template #profitAmount="{ row }">
            <span
              v-if="row.profitAmount"
              :class="row.profitAmount > 0 ? 'win' : 'lose'"
              >{{ row.profitAmount.toFixed(2) }}</span
            >
            <span v-else>-</span>
          </template> -->
          <!--   <template #status="{ row }">
            <div class="flex justify-center flex-col items-center">
              <div
                :style="{
                  background: getStatus(
                    row.status,
                    row.billStatus,
                    row.combineOrderDetails[0]?.betResult
                  )?.bgColor
                }"
                class="status_btn mb-1"
              >
                {{
                  betStatusMap[
                    getStatus(
                      row.status,
                      row.billStatus,
                      row.combineOrderDetails[0].betResult
                    ).status
                  ]
                }}
              </div>
              <div>
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
            </div>
          </template> -->

          <template #operation="{ row }">
            <div class="h-full" v-if="form.queryType !== 1">
              <div
                v-for="item in row.combineOrderDetails"
                :key="item.betItemId"
              >
                <div
                  class="flex item-center flex-col"
                  v-if="item.settleStatus === 3 && !item.rejectStatus"
                >
                  <el-button
                    size="small"
                    @click="confirmBetClick(item.detailId)"
                    type="primary"
                  >
                    {{ t('确认注单') }}
                  </el-button>
                  <el-button
                    class="!ml-0 mt-2"
                    size="small"
                    :disabled="item.settleStatus === 1"
                    @click="refuseBetClick(item.detailId)"
                    type="danger"
                  >
                    {{ t('拒接注单') }}
                  </el-button>
                </div>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </pure-table>

        <div
          class="bottom_content absolute bottom-7 flex max-w-[50%] items-center text-sm flex-wrap"
        >
          <div>
            <label>{{ t('总计：') }}</label>
            <span>{{ totalInfo?.thisPageBetCount ?? 0 }}{{ t('单') }}</span>
          </div>
          <div>
            <label>{{ t('用户数：') }}</label>
            <span>{{ totalInfo?.thisPageBetUserCount ?? 0 }}{{ t('人') }}</span>
          </div>
          <div>
            <label>{{ t('总计投注额：') }}</label>
            <span class="ml-1">
              {{
                totalInfo?.thisPageBetTotalAmount?.toFixed(2) ?? '0.00'
              }}</span
            >
          </div>
          <div>
            <label>{{ t('总输赢：') }}</label>
            <span class="ml-1">
              {{
                totalInfo?.thisPageBetTotalProfitAmount?.toFixed(2) ?? '0.00'
              }}</span
            >
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useManualOrderRejectionHook } from './util/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import dayjs from 'dayjs';
import {
  formatSeriesType,
  useSportFormatDetail,
  BET_RESULT_TYPE_MAP,
  EBetResultType,
  getViewOddFn,
  markeTypeMap,
  // calculateSeriesTypeTotal,
  calculateSeriesTypeTotalBets,
  displayHomeAwayScore,
  getIsInplay
} from '@/utils/formatMatch';
// import { betStatusMap } from './util/types';
import { usePublicHooks } from '@/hooks';
defineOptions({ name: 'bettingCenter' });
const { tableHeaderStyle } = usePublicHooks();

const getVal = (s1, s2, s3, s4) => {
  let val = '-';
  switch (true) {
    case s1 === 0 && s2 === 0 && s3 === 0:
      val = t('已接单');
      break;
    case s4 === 3:
      val = t('待确认');
      break;
    case s3 === 61:
      val = t('已拒单');
      break;
  }
  return val;
};
const getVal1 = (billStatus, betResult, settleStatus, item) => {
  let val = '-';
  switch (true) {
    case billStatus === 0 && betResult === 0 && settleStatus === 0:
      val = t('已接单');
      item.rejectStatus = true;
      break;
    case settleStatus === 3:
      val = t('待确认');
      break;
    case betResult === 61 && settleStatus === 1:
      val = t('已拒单');
      break;
  }
  return val;
};

const {
  loading,
  dataList,
  pagination,
  totalInfo,
  form,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  // exportFile,
  // getStatus,
  copyTest,
  tenantList,
  confirmBetClick,
  refuseBetClick
} = useManualOrderRejectionHook();
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
.match_item {
  margin-bottom: 10px;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
}
.item_line {
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
  width: 80px;
  color: #fff;
  border-radius: 4px;
}
.odd_item {
  min-height: 100px;
}

.postion {
  position: relative;
  .h-full {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    & > div {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
