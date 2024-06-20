<template>
  <div class="main">
    <SearchForm 
    :form="form" 
    :loading="loading" 
    @exportFile="exportFile"
    @on-search="onSearch" 
    :downloading="downloading"
  />

    <MatchDetail :matchInfo="matchInfo"></MatchDetail>
    <PureTableBar
      :title="t('赛事列表')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          adaptive
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="matchEventList"
          :columns="dynamicColumns"
          :pagination="{
            ...pagination,
            pageSizes: [30, 50, 100, 200, 500, 1000]
          }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @page-current-change="handleCurrentChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #score="{ row }">
            <span> {{ row.t1 }} - {{ row.t2 }} </span>
          </template>
          <template #canceled="{ row }">
            <span class="text-red-500">{{
              row.canceled == 0 ? '' : t('是')
            }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useEventQueryHook } from './utils/hook';
import { usePublicHooks } from '@/hooks';
import { t } from '@/plugins/i18n';
import { columns } from './component/TableColumnList';
import SearchForm from './component/SearchForm.vue';
import MatchDetail from './component/MatchDetail.vue';

defineOptions({ name: 'EVENTMANAGEMENT_EVENTQUERY' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  pagination,
  onSearch,
  form,
  matchEventList,
  handleCurrentChange,
  handlePageSizeChange,
  matchInfo,
  downloading,
  exportFile,
} = useEventQueryHook();
</script>

<style scoped></style>
