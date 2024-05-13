<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />

    <div
      v-if="matchInfo.matchId"
      class="mt-3 search-form bg-bg_color w-[99/100] pl-8 pt-[12px] flex flex-col"
    >
      <span>{{ matchInfo.sportName }}</span>
      <span>{{ matchInfo.league }}</span>
      <span>{{ matchInfo.hTeamName }} vs {{ matchInfo.aTeamName }} </span>
      <span>{{ t('赛事ID ') }}: {{ matchInfo.matchId }}</span>
      <span>{{ t('开赛时间') }}: {{ matchInfo.startDateTime }}</span>
    </div>

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
          height={{   matchInfo.matchId ? '100' : 'auto' }}
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

defineOptions({ name: 'CONFIGCENTER_EVENT_QUERY' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  pagination,
  onSearch,
  form,
  matchEventList,
  handleCurrentChange,
  handlePageSizeChange,
  matchInfo
} = useEventQueryHook();
</script>

<style scoped></style>
