<template>
  <div class="main">
    <MatchTitle />
    <SelectContainer />

    <VxeTableBar
      :vxeTableRef="vxeTableRef"
      :columns="columns()"
      title=""
      @refresh="onSearch"
    >
      <template v-slot="{ dynamicColumns }">
        <vxe-grid
          ref="vxeTableRef"
          headerAlign="center"
          cellAlign="center"
          v-loading="loading"
          border
          height="460"
          :show-overflow="true"
          size="small"
          :column-config="{ resizable: true }"
          :columns="dynamicColumns"
          :scroll-y="{ enabled: true }"
          :pagerConfig="pagination"
          :data="tableData"
          @page-change="handlePageChange"
        />
      </template>
    </VxeTableBar>
  </div>
</template>

<script setup lang="ts">
import { VxeTableBar } from '@/components/ReVxeTableBar';
import { VxeTableDefines } from 'vxe-table';
import { t } from '@/plugins/i18n';
import { useOddsHistoryDetailHook } from './utils/hook';
import MatchTitle from './component/MathcTitle.vue';
import SelectContainer from './component/SelectContainer.vue';

defineOptions({ name: 'EVENTMANAGEMENT_EVENTQUERY' });

const columns1 = ref<VxeTableDefines.ColumnInfo<any>[]>([]);

setTimeout(() => {
  nextTick(() => {
    // 获取所有列配置
    const $table = vxeTableRef.value;
    if ($table) {
      loading.value = true;
      columns1.value = $table.getColumns();
      setTimeout(() => {
        loading.value = false;
      }, 800);
    }
  });
}, 100);

const {
  loading,
  pagination,
  onSearch,
  vxeTableRef,
  tableData,
  matchEventList,
  matchInfo,
  columns,
  handlePageChange
} = useOddsHistoryDetailHook();
</script>

<style lang="scss">
.export_dialog {
  .el-message-box__btns {
    flex-direction: row;
  }
}
</style>
