<template>
  <pure-table
    class="table_container"
    align-whole="center"
    showOverflowTooltip
    table-layout="auto"
    :loading="loading"
    size="small"
    adaptive
    :data="dataList"
    :columns="dynamicColumns"
    :pagination="{ ...pagination, pageSizes: [5, 10, 20, 50, 100] }"
    :paginationSmall="true"
    :header-cell-style="tableHeaderStyle"
    @page-current-change="handleCurrentChange"
  >
  </pure-table>
</template>

<script setup lang="ts">
import { usePublicHooks } from '@/hooks';
import { PaginationProps } from '@pureadmin/table';

const props = defineProps<{
  index: number;
  matchId: number | string;
}>();

const { tableHeaderStyle } = usePublicHooks();
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const loading = ref(false);
const dataList = reactive([]);

onMounted(() => {
  init();
});
/* 
{
  "matchId": 0,
  "startMinutes": 0,
  "pageSize": 20,
  "pageNum": 1
}
 */

const handleCurrentChange = () => {
  
 }

const init = async () => {
  const res = await API.getMatchBetList({
    matchId: props.matchId,
    startMinutes: props.index,
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage
  });
};
</script>

<style scoped></style>
