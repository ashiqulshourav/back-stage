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
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, pageSizes: [5, 10, 20, 50, 100] }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-auth="['UPDATE']"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
            >
              {{ t('编辑') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import SearchForm from './component/SearchForm.vue';
import { useEventQueryHook } from './utils/hook';
import { usePublicHooks } from '@/hooks';
import { t } from '@/plugins/i18n';
import { columns } from './component/TableColumnList';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import EditPen from '@iconify-icons/ep/edit-pen';

defineOptions({ name: 'CONFIGCENTER_EVENT_QUERY' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  pagination,
  onSearch,
  form,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  // openDialog,
  dataList
} = useEventQueryHook();
</script>

<style scoped></style>
