<template>
  <div class="main">
    <SearchForm
      :form="form"
      :loading="loading"
      @on-search="onSearch"
      @exportFile="exportFile"
    />

    <PureTableBar
      title=""
      :columns="columns"
      class="relative"
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
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #index="{ row }">
             <span>{{row.index}}</span>
          </template>
          <template #userMessage="{ row }">
            <div class="item_line cursor-pointer" v-copy="row.userId" >
              <span>用户ID：</span>{{row.userId}}
            </div>
            <div class="item_line cursor-pointer" v-copy="row.userName">
              <span>用户名：</span>{{row.userName}}
            </div>
            <div class="item_line cursor-pointer" v-copy="row.tenantId">
              <span>商户ID：</span>{{row.tenantId}}
            </div>
            <div  v-if="row.combineOrderDetails.length>1" class="item_line mt-2 color_blue">
             {{String(row.seriesType).slice(-3) ==='001'?'串关':'复式'}}
              <span >{{formatSeriesType(row?.seriesType,row.combineOrderDetails.length)}}</span>
              <span class="ml-1" >总计：{{`${calculateSeriesTypeTotalBets(row?.seriesType)}注 每注：${row.orderAmount}`}}</span>
            </div>
          </template>
          <template #matchMessage="{ row }">
            <div class="match_item"  v-for="item in row.combineOrderDetails" :key="item.betItemId">
              <div class="item_line">{{item.homeTeamNameCn}} vs {{item.awayTeamNameCn}}</div>
              <div class="item_line">{{item.sportNameCn}}/{{item.leagueNameCn}}</div>
              <div class="item_line cursor-pointer" v-copy="item.matchId">赛事ID {{item.matchId}}</div>
              <div class="item_line">开赛时间：{{dayjs(item.beginTime ?? Date.now()).format("YYYY-MM-DD HH:mm:ss")}}</div>
            </div>
          </template>
          <template #betDetail="{ row }">
            <div class="match_item"  v-for="item in row.combineOrderDetails" :key="item.betItemId">
              <div class="item_line">
                {{`${useSportFormatDetail(item)[4]} ${getIsInplay(item.isInplay)}`}}

                {{item.isInplay==1?displayHomeAwayScore(item.scoreBenchmark,item.sportId):''}}
              </div>
            <div class="item_line">{{useSportFormatDetail(item)[3]}}</div>
              <div class="item_line cursor-pointer" v-copy="row.id">注单号: {{row.id}}</div>
              <div class="item_line">投注时间：{{row.createTime ?dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss"):''}}</div>
              <div class="item_line" v-if="row.billStatus === 1&&item.settleScore">赛果：{{displayHomeAwayScore(item.settleScore,item.sportId)}}</div>
            </div>
          </template>
          <template #odd="{ row }">
            <div class="match_item"  v-for="item in row.combineOrderDetails" :key="item.id">
                <div>{{getViewOddFn(item.oddFinally,item.marketTypeFinally,item.marketType)}}</div>
                <div>{{markeTypeMap[item.marketType]}}</div>
              <div  v-if="BET_RESULT_TYPE_MAP[item?.betResult]">
                <span :class="[EBetResultType.WIN, EBetResultType.WIN_HALF].includes(item?.betResult)?'win':'lose'"> {{BET_RESULT_TYPE_MAP[item?.betResult]}}</span>
              </div>
            </div>
          </template>
          <template #profitAmount="{ row }">
            <span v-if="row.profitAmount" :class="row.profitAmount>0?'win':'lose'">{{row.profitAmount.toFixed(2)}}</span>
            <span v-else>-</span>
          </template>
          <template #status="{ row }">
            <div :style="{background:getStatus(row.status,row.billStatus,row.combineOrderDetails[0].betResult).bgColor}" class="status_btn mb-1">{{ betStatusMap[getStatus(row.status,row.billStatus,row.combineOrderDetails[0].betResult).status]}}</div>
            <div >{{ row.settleTime ? dayjs(row.settleTime).format('YYYY-MM-DD HH:mm:ss'):'' }}</div>
            <div v-if="String(row.seriesType).slice(-3) ==='001'" >总赔率:{{String(row.seriesType).slice(-3) ==='001'?calculateSeriesTypeTotal(row.combineOrderDetails):'' }}</div>
          </template>
          <template #operation="{ row }">
            <el-button
                class="reset-margin"
                @click="handleCancel(row)"
                v-if="row.billStatus===0&&hasAuth('DETAIL')"
            >
              {{ t('取消') }}
            </el-button>
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
import dayjs from "dayjs";
import { hasAuth } from '@/router/utils';
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
  getIsInplay,
} from "@/utils/formatMatch";
import {betStatusMap} from './util/types'
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
  handleCancel,
  getStatus,
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
.match_item{
  margin-bottom: 10px;
  position: relative;
  &:last-child{
    margin-bottom: 0;
  }
}
.item_line{
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 250px;
}
.isInplay{
  position: absolute;
  right: 10px;
  top: 10px;
}
.win{
  padding: 2px 4px;
  font-style: normal;
  font-weight: 400;
  border-radius: 4px;
  color: #dd5454;

}
.lose{
  padding: 2px 4px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;

  color: green;
}
.color_blue{
  color: blue;
  font-size: 12px;
}
.status_btn{
  text-align: center;
  height: 25px;
  line-height: 25px;
  width: 80px;
  color: #FFF;
  border-radius: 4px;
}
</style>
