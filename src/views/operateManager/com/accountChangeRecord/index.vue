<template>
  <div class="main">
    <button @click="goToUserListPage"class="back-button =">
      <IconifyIconOffline class="mx-1" icon="back"></IconifyIconOffline>
      {{ t('返回上一页') }}
    </button>
    <div>
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
  </div>
</template>

<script setup lang="ts">
import { useAccountChangeRecordHook } from './util/hook';
import SearchForm from './searchForm.vue';
import { columns } from './columns';
import { usePublicHooks } from '@/hooks';
import { onMounted } from "vue";
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Back from '@iconify-icons/ep/back';

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
  goToUserListPage,
} = useAccountChangeRecordHook();
onMounted(() => {
  onSearch();
});
</script>

<style lang="scss">
.is-horizontal {
  display: block !important;
  height: 10px !important;
}
.back-button {
  display: flex;
  background-color: transparent;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
  color: #409eff;
  font-size: 14px;
  line-height: 20px;
}
</style>
