<template>
  <PureTableBar
    :title="t('飞镖结算管理')"
    :columns="columns"
    @refresh="onSearch('reload')"
  >
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        class="table_container"
        align-whole="center"
        showOverflowTooltip
        :loading="matchStore.settleRequestLoading"
        :size="size"
        :row-key="row => row.matchId"
        adaptive
        :data="dataList"
        :columns="dynamicColumns"
        :pagination="{ ...pagination, pageSizes: [5, 10, 20, 50, 100] }"
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
            @click="goDartsDetail(row)"
          >
            {{ t('结算详情') }}
          </el-button>
        </template>
      </pure-table>
    </template>
  </PureTableBar>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { t } from '@/plugins/i18n';
import { useDartsHook } from './util/hook';
import { usePublicHooks } from '@/hooks';
import { SearchFormType } from '../../utils/type';
import { useMatchStore } from '@/store/match';

const { tableHeaderStyle } = usePublicHooks();
const router = useRouter();
const matchStore = useMatchStore();

const props = defineProps<{
  form: SearchFormType;
}>();

const {
  onSearch,
  columns,
  dataList,
  pagination,
  handleTableWidthChange,
  handleCurrentChange,
  form
} = useDartsHook();

form.value = props.form;
const filterData = (type: 'reload') => {
  onSearch(type);
};

const goDartsDetail = row => {
  const params = JSON.parse(JSON.stringify(row));
  router.push({
    name: 'SETTLE_DARTS_DETAIL',
    state: { params }
  });
};

defineExpose({ filterData });
</script>
