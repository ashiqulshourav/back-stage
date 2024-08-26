<template>
  <el-dialog
    v-model="props.visible"
    class="divide-y divide-slate-200"
    width="800"
    @close="emits('onClose')"
    :title="t('修改记录')"
  >
    <template #title> </template>
    <pure-table
      class="table_container"
      align-whole="center"
      showOverflowTooltip
      table-layout="fixed"
      :loading="loading"
      size="small"
      border
      adaptive
      :data="recordList"
      :header-cell-style="tableHeaderStyle"
      :pagination="{ ...pagination, pageSizes: pageSizeArr }"
      :columns="recordColumns"
      :paginationSmall="true"
      @selection-change="handleSelectionChange"
      @page-size-change="handleSelectionChange"
      @page-current-change="handleSelectionChange"
    >
    </pure-table
    >>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import type { PaginationProps } from '@pureadmin/table';
import { pageSizeArr } from '@/utils/math';
import { recordColumns } from './TableColumnList';

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 12,
  currentPage: 1,
  background: true
});
const loading = ref<boolean>(false);

const { tableHeaderStyle } = usePublicHooks();

const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false
  },
  type: {
    type: Number,
    default: 1
  }
});

const recordList = ref<any[]>([]);

const handleSelectionChange = (n: number) => {
  pagination.currentPage = n;
  fetch();
};
const fetch = async () => {
  loading.value = true;
  const params = {
    description: 1,
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage
  };
  try {
    const res = await API.getUserLevelLimitLogList(params);
    recordList.value = res.data.list;
    pagination.total = res.data.total;
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
};
const emits = defineEmits(['onClose', 'update:visible']);
onMounted(() => {
  fetch();
});
</script>
