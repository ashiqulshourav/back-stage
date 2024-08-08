<template>
  <div class="main">
    <MatchTitle />

    <SelectContainer />

    <MatchDetail :matchInfo="matchInfo"></MatchDetail>

    <!-- :adaptiveConfig="{ offsetBottom: 60 }" -->
    <pure-table
      class="table_container"
      align-whole="center"
      :loading="loading"
      :row-key="row => row.firstNum"
      adaptive
      :data="matchEventList"
      :columns="columns()"
      :header-cell-style="tableHeaderStyle"
    >
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useEventQueryHook } from './utils/hook';
import { usePublicHooks } from '@/hooks';
import { t } from '@/plugins/i18n';
import { columns } from './component/TableColumnList';
import MatchTitle from './component/MathcTitle.vue';
import SelectContainer from './component/SelectContainer.vue';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'EVENTMANAGEMENT_EVENTQUERY' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  pagination,
  onSearch,
  form,
  matchEventList,
  handleCurrentChange,
  handlePageSizeChange,
  matchInfo,
  exportFile
} = useEventQueryHook();
</script>

<style lang="scss">
.export_dialog {
  .el-message-box__btns {
    flex-direction: row;
  }
}
</style>
