<template>
  <PureTableBar
    :title="t('曲棍球结算管理')"
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
            @click="goHockeyDetail(row)"
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
import { useHockeyHook } from './util/hook';
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
} = useHockeyHook();
form.value = props.form;

const filterData = (type: 'reload') => {
  onSearch(type);
};
const goHockeyDetail = row => {
  const params = JSON.parse(JSON.stringify(row));
  router.push({
    name: 'SETTLE_HOCKEY_DETAIL',
    state: { params }
  });
};

defineExpose({ filterData });
</script>
