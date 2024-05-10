<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />

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
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="matchEventList"
          :columns="dynamicColumns"
          :pagination="{
            ...pagination,
            pageSizes: [20, 50, 100, 200, 500, 1000]
          }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @page-current-change="handleCurrentChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #match_vs="{ row }">
            <span v-if="row.aTeamName && row.hTeamName">
              {{ row.aTeamName }} vs {{ row.hTeamName }}
            </span>
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
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import EditPen from '@iconify-icons/ep/edit-pen';
import SearchForm from './component/SearchForm.vue';

defineOptions({ name: 'CONFIGCENTER_EVENT_QUERY' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  pagination,
  onSearch,
  form,
  handleTableWidthChange,
  handleSelectionChange,
  // openDialog,
  matchEventList,
  handleCurrentChange,
  handlePageSizeChange
} = useEventQueryHook();
</script>

<style scoped></style>
