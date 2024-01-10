<template>
  <div class="main">
    <SearchForm
      :loading="loading"
      :operationTypeList="operationTypeList"
      :searchMenuList="searchMenuList"
      @on-search="onSearch"
      :form="form"
    />
    <PureTableBar
      :title="t('操作日志表')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
// import AddFill from '@iconify-icons/ri/add-circle-line';
import { useOperationLog } from './utils/hook';
import SearchForm from './component/SearchForm.vue';

import { t } from '@/plugins/i18n';
defineOptions({ name: 'History' });

// const formRef = ref();
const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  operationTypeList,
  searchMenuList,
  form
} = useOperationLog();
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
