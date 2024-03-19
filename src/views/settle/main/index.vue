<template>
  <div class="main">
    <SearchForm @onSearch="onSearch" :form="form" />
    <SportTypeNav
      @changeNavType="changeNavType"
      :currentSportId="currentSportId"
    />
    <SportTable
      :dataList="dataList"
      :currentSport="currentSport"
      :columns="renderColumnList"
      :pagination="pagination"
      :loading="loading"
      @handleTableWidthChange="handleTableWidthChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <template #default="{ row }">
        <el-button
          v-if="hasAuth('DETAIL')"
          class="reset-margin"
          type="primary"
          size="small"
          @click="goDetailPage(row)"
        >
          {{ t('结算详情') }}
        </el-button>
        <el-button
          v-if="row.isShowCancelBtn && hasAuth('CANCELMATCH')"
          type="danger"
          size="small"
          :disabled="row.cancelOrderTimes > 0"
          @click="cancelClick(row)"
          >{{ t('取消比赛') }}</el-button
        >
      </template>
    </SportTable>
  </div>
</template>

<script setup lang="tsx">
import SearchForm from './component/SearchForm.vue';
import SportTypeNav from './component/SportTypeNav.vue';
import { useSettileHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import SportTable from './component/SportTable.vue';
import { SPORT_LIST_MAP } from './utils/map';
import { handleTableWidth } from '@/utils/getTableWidth';
import { SPORT_NAME_TYPE } from './utils/map';
import { hasAuth } from '@/router/utils';


defineOptions({ name: 'SETTLE_MAIN' });

const currentSport = computed(() =>
  SPORT_LIST_MAP.find(item => item.value === currentSportId.value)
);

const renderColumnList = computed(() => {
  const fillList = [
    {
      label: t('是否中立场地'),
      prop: 'isNeutral',
      formatter: ({ isNeutral }) => (isNeutral ? t('是') : t('否')),
      headerRenderer: d => handleTableWidth(d, t('是否中立场地')),
      hide: () => currentSport.value.value != 1
    },
    {
      label: t('上半场结算'),
      prop: 'halfSettlementStatus',
      formatter: ({ halfSettlementStatus }) =>
        halfSettlementStatus === 0 ? (
          t('未结算')
        ) : (
          <el-text type="danger">{t('已结算')}</el-text>
        ),
      headerRenderer: d => handleTableWidth(d, t('上半场结算')),
      hide: () =>
        currentSport.value.value != SPORT_NAME_TYPE.football &&
        currentSport.value.value != SPORT_NAME_TYPE.basketball
    },
    {
      label: t('未结算'),
      prop: 'unSettlementEvents',
      headerRenderer: d => handleTableWidth(d, t('未结算')),
      hide: () => currentSport.value.value != SPORT_NAME_TYPE.football
    }
  ];
  const _ = [...columns];
  _.splice(_.length - 2, 0, ...fillList);
  return _;
});

const {
  changeNavType,
  form,
  onSearch,
  columns,
  dataList,
  pagination,
  handleTableWidthChange,
  handleCurrentChange,
  goDetailPage,
  currentSportId,
  cancelClick,
  loading
} = useSettileHook();
</script>

<style lang="scss">
.pure-warning-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-7);
  &:hover {
    td.el-table__cell {
      background-color: var(--el-color-danger-light-7) !important;
    }
  }
}
.canceled {
  .el-input__wrapper {
    box-shadow: none !important;
    border: none !important;
    background-color: transparent !important;
  }
}
</style>
