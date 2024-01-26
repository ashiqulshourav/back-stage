<template>
  <div class="main">
    <SearchForm
      :loading="loading"
      @on-search="onSearch"
      :form="searchForm"
      :matchCondition="matchCondition"
      @changeMatchCondition="changeMatchCondition"
    />
    <PureTableBar :columns="columns" @refresh="onSearch('reload')">
      <template #title>{{ t('赛事列表') }}</template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :default-sort="{ prop: 'beginTimeLong', order: 'ascending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #isSale="{ row, index, props }">
            <el-switch
              :size="props.size === 'small' ? 'small' : 'default'"
              :loading="switchLoadMap[index]?.loading"
              v-model="row.isSale"
              :active-value="1"
              :inactive-value="0"
              inline-prompt
              :style="switchStyle"
              @change="changeSwitch({ row, index })"
            />
          </template>
          <template #saleHandicaps="{ row }: { row: SaleDataAPI.PreSaleList }">
            <span
              class="underline cursor-pointer"
              @click="openInfoDialog(row.matchId, row)"
              >{{ row.saleHandicaps }}/{{ row.allHandicaps }}</span
            >
          </template>
          <template #matchTeam="{ row }: EsportMatchRowType">
            <span>{{ row.homeTeamNameCn }}</span>
            <span class="font-bold mr-2 ml-2">VS</span>
            <span>{{ row.awayTeamNameCn }}</span>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              type="primary"
              :size="size"
              @click="
                $router.push(`/esportsSettlement/esportsSettlementDetail/123`)
              "
            >
              {{ t('结算详情') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from '@/components/RePureTableBar';
import { useEsportSettlement } from './utils/hook';
import { t } from '@/plugins/i18n';
import { columns } from './component/TableColumnList';
import SearchForm from './component/SearchForm.vue';
import OpeningPreview from './component/OpeningPreview.vue';
import { addDialog } from '@/components/ReDialog';
import { message } from '@/utils/message';
import { EsportMatchRowType } from './utils/types';

defineOptions({ name: 'EsportMatchList' });
const openInfoDialog = (matchId: number, row: SaleDataAPI.PreSaleList) => {
  if (row.saleHandicaps === 0)
    return message(t('请先解锁当前赛事!'), { type: 'error' });
  addDialog({
    title: t('盘口预览'),
    props: { matchId, matchInfo: row },
    width: '40%',
    draggable: true,
    hideFooter: true,
    contentRenderer: () =>
      h(OpeningPreview, {
        onReloadTable: () => onSearch()
      } as any)
  });
};

const {
  loading,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  switchLoadMap,
  changeSwitch,
  searchForm,
  switchStyle,
  matchCondition,
  changeMatchCondition
} = useEsportSettlement();
</script>

<style lang="scss">
.is-horizontal {
  display: block !important;
  height: 10px !important;
}
</style>
