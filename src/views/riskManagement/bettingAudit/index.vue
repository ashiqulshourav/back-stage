<template>
  <div class="main">
    <SearchForm
      :form="form"
      :loading="loading"
      @on-search="onSearch"
      @exportFile="exportFile"
      :tenantList="tenantList"
    />

    <PureTableBar
      title=""
      :columns="columns"
      class="relative"
      :isShowHeader="false"
      @refresh="onSearch('reload')"
    >
<!--      <template #title>
        <div class="flex item-center ">
          <el-button
            type="danger"
            @click="handleCancelAll"
          >
            {{ t('批量划单') }}
          </el-button>
          <el-button
            type="primary"
            @click="handleApproveAll"
          >
            {{ t('批量通过') }}

          </el-button>
          <el-button
            type="primary"
          >
            {{ t('导出注单') }}
          </el-button>
        </div>
      </template>-->
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          class="table_container"
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
            <div class="item_line cursor-pointer" @dblclick="copyTest(tenantObj[row.tenantId]?.tenantName,t('商户名：{value}',{value:tenantObj[row.tenantId]?.tenantName}))">
                <span>{{t('商户名：')}}</span>{{tenantObj[row.tenantId]?.tenantName}}
            </div>
            <div class="item_line cursor-pointer" @dblclick="copyTest(row.tenantId,t('商户编码：{value}',{value:tenantObj[row.tenantId]?.name}))">
              <span>{{ t('商户编码：') }}</span >{{ tenantObj[row.tenantId]?.name }}
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
              <div class="item_line">
                {{ useSportFormatDetail(item)[3] }} @{{
                  getViewOddFn(
                    item.oddFinally,
                    item.marketTypeFinally,
                    item.marketType
                  )
                }}
              </div>
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
                v-if="row.billStatus === 1 && item.settleScore&&!(displayHomeAwayScore(item.settleScore, item.sportId,'home')==''||displayHomeAwayScore(item.settleScore, item.sportId,'away')=='')"
              >
                {{ t('赛果：')
                }}{{ displayHomeAwayScore(item.settleScore, item.sportId) }}
              </div>
              <div v-if="item.riskStatus===riskStatus.reject">
                取消原因:{{item.riskType}}
              </div>
              <div :style="{background:getRiskStatus(item.riskStatus).bgColor}" class="status_btn mb-1">{{getRiskStatus(item.riskStatus).label}}</div>
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
          <template #profitAmount="{ row }">
            <span
              v-if="row.profitAmount"
              :class="row.profitAmount > 0 ? 'win' : 'lose'"
              >{{ row.profitAmount.toFixed(2) }}</span
            >
            <span v-else>-</span>
          </template>
          <template #status="{ row }">
            <div :style="{background:getStatus(row.status,row.billStatus,row.combineOrderDetails[0].betResult,row.isReserve).bgColor}" class="status_btn mb-1">{{ betStatusMap[getStatus(row.status,row.billStatus,row.combineOrderDetails[0].betResult,row.isReserve).status]}}</div>
            <div >{{ row.settleTime ? dayjs(row.settleTime).format('MM-DD HH:mm:ss'):'' }}</div>
            <div v-if="String(row.seriesType).slice(-3) ==='001'" >{{t('总赔率:')}}{{String(row.seriesType).slice(-3) ==='001'?calculateSeriesTypeTotal(row.combineOrderDetails):'' }}</div>
          </template>
          <template   #cancel="{ row }">
            <div  class="match_item cancel flex justify-between  items-center" v-for="(item,index) in row.combineOrderDetails"
                 :key="item.betItemId"
            >
<!--              <el-checkbox ></el-checkbox>-->
              <el-button
                size="small"
                type="danger"
                v-if="item.riskStatus===2"
                @click="handleCancel(row,index)"
              >
                {{ t('风控划单') }}
              </el-button>
            </div>
          </template>
          <template #approve="{ row }">
            <div class="match_item approve flex justify-between  items-center"  v-for="(item,index) in row.combineOrderDetails"
                  :key="item.betItemId"
            >
<!--              <el-checkbox ></el-checkbox>-->
              <el-button
                v-if="item.riskStatus===2"
                size="small"
                type="primary"
                @click="handleApprove(row,index)"
              >
                {{ t('审核通过') }}
              </el-button>
            </div>
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
import { useLeague } from './util/hook';
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
  calculateSeriesTypeTotal,
  calculateSeriesTypeTotalBets,
  displayHomeAwayScore,
  getIsInplay
} from '@/utils/formatMatch';
import {betStatusMap, riskStatus} from './util/types';
import { usePublicHooks } from '@/hooks';
defineOptions({ name: 'bettingCenter' });
const { tableHeaderStyle } = usePublicHooks();

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
  exportFile,
  getStatus,
  copyTest,
  tenantList,
  handleCancel,
  handleApprove,
  handleCancelAll,
  handleApproveAll,
  tenantObj,
  getRiskStatus,
} = useLeague();
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
.odd_item,.cancel,.approve {
  min-height: 100px;
}
.cancel,.approve {
width: 100px;
}

.operate {
  width: 110px;
}
</style>
