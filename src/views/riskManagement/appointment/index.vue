<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />

    <pure-table
      class="table_container"
      align-whole="center"
      showOverflowTooltip
      table-layout="auto"
      :loading="loading"
      size="small"
      adaptive
      :data="dataList"
      :columns="columns"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
    >
      <template #userCount="{ row }">
        <el-link @click="goToUserList(row)">{{ row.count }}</el-link>
      </template>
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { useAppointmentHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';

defineOptions({ name: 'RISKMANAGEMENT_APPOINTMENT' });

const { loading, dataList, onSearch, form, goToUserList } =
  useAppointmentHook();
</script>

<style>
.el-message-box .el-message-box__btns {
  display: flex;
  flex-direction: row;
}
</style>
