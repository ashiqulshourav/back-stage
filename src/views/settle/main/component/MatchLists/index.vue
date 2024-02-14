<template>
  <PureTableBar 
    :title="t(matchName + '结算管理')"
    :columns="columns"
    @refresh="onSearch('reload')"
  >
    <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          :loading="matchStore.settleRequestLoading"
          :size="size"
          :row-key="row => row.matchId"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              type="primary"
              :size="size"
              @click="goToDetails(row)"
            >
              {{ t('结算详情') }}
            </el-button>
          </template>
        </pure-table>
      </template>
  </PureTableBar>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { SearchFormType } from '../../utils/type';

import { PureTableBar } from '@/components/RePureTableBar';
import { useMatchStore } from '@/store/match';
import { usePublicHooks } from '@/hooks';
import { useMatchLists } from './util/hook';

const { tableHeaderStyle } = usePublicHooks();
const matchStore = useMatchStore();
const router = useRouter();

const props = defineProps<{
  form: SearchFormType;
}>();
const {
  onSearch,
  columns,
  dataList,
  pagination,
  matchName,
  handleTableWidthChange,
  handleCurrentChange,
  form,
} = useMatchLists();
form.value = props.form;
const filterData = (type: 'reload') => {
  onSearch(type);
};
const goToDetails = row => {
  const params = JSON.parse(JSON.stringify(row));
  router.push({
    name: 'SETTLE_DETAILS',
    state: { params }
  });
};
defineExpose({ filterData });

</script>

<style scoped>
</style>