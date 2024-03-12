<template>
  <div class="main">
    <SearchForm @onSearch="onSearch" />
    <SportTypeNav @changeNavType="changeNavType" />
    <!-- <SportTable>
      <el-button
        v-auth="['DETAIL']"
        class="reset-margin"
        type="primary"
        size="small"
        @click="goDetailPage(row)"
      >
        {{ t('结算详情') }}
      </el-button>
      <el-button
        v-if="row.isShowCancelBtn"
        type="danger"
        size="small"
        :disabled="row.cancelOrderTimes > 0"
        @click="cancelClick(row)"
        >{{ t('取消比赛') }}</el-button
      >
    </SportTable> -->
    <!-- <component
      :is="currentComponentName.name"
      ref="componentStrName"
      :form="form"
    ></component> -->
  </div>
</template>

<script setup lang="ts">
import SearchForm from './component/SearchForm.vue';
import SportTypeNav from './component/SportTypeNav.vue';
import { useMatchStore } from '@/store/match';
import { useSettingStoreHook } from '@/store/settings';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { useSettileHook } from './utils/hook';

defineOptions({ name: 'SETTLE_MAIN' });
const componentStrName = ref<any>('FootBall');
const settingStore = useSettingStoreHook();

const matchStore = useMatchStore();

const comType = SPORT_ID_MAP.find(item => {
  return item.value === (settingStore.settlePageInfo.matchType ?? 1);
}).type;

// const changeCurrentComponentName = (_: { value: number; type: string }) => {
//   currentComponentName.name = markRaw(comoMap[_.type]);
//   currentSportId.value = _.value;
//   matchStore.set_lagueList(0, _.value);
//   settingStore.save_selttle_page_info({ page: null, matchType: null });
//   form.leagueId = '';
// };

const {
  changeNavType,
  form,
  onSearch,
  columns,
  dataList,
  pagination,
  handleTableWidthChange,
  handleCurrentChange,
  classifyNavList
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
