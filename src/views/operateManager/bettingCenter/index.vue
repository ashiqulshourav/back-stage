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
            <div class="item_line" v-copy="row.userId">
              <span>用户ID：</span>{{row.userId}}
            </div>
            <div class="item_line">
              <span>用户名：</span>{{row.userName}}
            </div>
            <div class="item_line">
              <span>商户编号：</span>{{row.tenantCode}}
            </div>
            <div  v-if="row.combineOrderDetails.length>1" class="item_line">
             {{String(row.seriesType).slice(-3) ==='001'?'串关':'复式'}}
              <span class="ml-2">{{formatSeriesType(row?.seriesType,row.combineOrderDetails.length)}}</span>
            </div>
          </template>
          <template #matchMessage="{ row }">
            <div class="match_item"  v-for="item in row.combineOrderDetails" :key="item">
              <div class="item_line">{{item.homeTeamNameCn}} vs {{item.awayTeamNameCn}}</div>
              <div class="item_line">{{item.sportNameCn}}/{{item.leagueNameCn}}</div>
              <div class="item_line">赛事ID {{item.matchId}}</div>
              <div class="item_line">开赛时间 {{dayjs(item.beginTime ?? Date.now()).format("YYYY-MM-DD HH:mm:ss")}}</div>
            </div>
          </template>
          <template #betDetail="{ row }">
            <div class="match_item"  v-for="item in row.combineOrderDetails" :key="item">
              <div class="item_line">
                {{`${useSportFormatDetail(item)[4]}  ${item.isInplay===1?'滚球':'早盘'}`}}
              </div>
              <div class="item_line">{{useSportFormatDetail(item)[3]}}</div>
              <div class="item_line">注单号: {{row.id}}</div>
              <div class="item_line">投注时间 {{dayjs(item.createTime ?? Date.now()).format("YYYY-MM-DD HH:mm:ss")}}</div>
            </div>
          </template>
          <template #odd="{ row }">
            <div class="match_item"  v-for="item in row.combineOrderDetails" :key="item">
                <div>{{getViewOddFn(item.oddFinally,item.marketTypeFinally,item.marketType)}}</div>
                <div>{{markeTypeMap[item.marketType]}}</div>
              <div class="item_line">
                <span :class="[EBetResultType.WIN, EBetResultType.WIN_HALF].includes(item?.betResult)?'win':'lose'"> {{BET_RESULT_TYPE_MAP[item?.betResult]}}</span>
              </div>
            </div>
          </template>
          <template #operation="{ row }">
            <el-button
                class="reset-margin"
                :disabled="row.settleTimes!==0"
                @click="handleCancel(row)"
            >
              {{ t('取消') }}
            </el-button>
          </template>
        </pure-table>
        <div
          class="bottom_content absolute bottom-7 flex max-w-[50%] items-center text-sm flex-wrap"
        >
          <div>
            <label>{{ t('总计:') }}</label>
            <span>{{ totalInfo?.thisPageBetCount ?? 0 }}{{ t('单') }}</span>
          </div>
          <div>
            <label>{{ t('用户数:') }}</label>
            <span>{{ totalInfo?.thisPageBetUserCount ?? 0 }}{{ t('人') }}</span>
          </div>
          <div>
            <label>{{ t('总计投注额:') }}</label>
            <span class="ml-1">
              {{
                totalInfo?.thisPageBetTotalAmount?.toFixed(2) ?? '0.00'
              }}</span
            >
          </div>
          <div>
            <label>{{ t('总输赢:') }}</label>
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

import {
  formatSeriesType,
  useSportFormatDetail,
  BET_RESULT_TYPE_MAP,
  EBetResultType, getViewOddFn, markeTypeMap,
} from "@/utils/formatMatch";
// import { usePublicHooks } from '@/hooks';
import dayjs from "dayjs";

defineOptions({ name: 'bettingCenter' });
// const { tableHeaderStyle } = usePublicHooks();

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
  margin-bottom: 5px;
  height: 120px;
  position: relative;
  &:last-child{
    margin-bottom: 0;
  }
}
.item_line{
  text-align: left;
}
.isInplay{
  position: absolute;
  right: 10px;
  top: 10px;
}
.win{
  padding: 2px 4px;
  border-radius: 4px;
  border: 0.5px solid #f85454;
  background: #dd5454;
  color: #fff;
}
.lose{
  padding: 2px 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  border-radius: 4px;
  border: 0.5px solid #dbdbdb;
}
</style>
