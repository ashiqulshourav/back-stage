<template>
  <div class="main">
    <SearchForm 
     :form="form" 
     :loading="loading"
     @on-search="onSearch"
     @openModifyBalanceDialog="openModifyBalanceDialog" 
     :userData="userData"
    />
    <pure-table
      align-whole="center"
      table-layout="auto"
      :loading="loading"
      adaptive
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      :paginationSmall="true"
      :header-cell-style="tableHeaderStyle"
      @selection-change="handleSelectionChange"
      @page-size-change="handleTableWidthChange"
      @page-current-change="handleCurrentChange"
    >
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { useAccountChangeRecordHook } from './util/hook';
import SearchForm from './searchForm.vue';
import { columns } from './columns';
import { usePublicHooks } from '@/hooks';
import { t } from '@/plugins/i18n';
const { tableHeaderStyle } = usePublicHooks();
const {
  loading,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  form,
  openModifyBalanceDialog,
  userData,
} = useAccountChangeRecordHook();
</script>

<style lang="scss">
.is-horizontal {
  display: block !important;
  height: 10px !important;
}
</style>
