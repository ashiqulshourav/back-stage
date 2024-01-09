<template>
  <div class="main">
    <SearchForm :loading="loading" @on-search="onSearch" :form="searchForm" />
    <PureTableBar :columns="columns" @refresh="onSearch('reload')">
      <template #title>
        <div class="flex items-center justify-between">
          <span class="mr-3">{{ t('预开售管理') }}</span>
          <el-button size="small" :disabled="isLockAll" type="primary">{{
            t('一键锁盘')
          }}</el-button>
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :default-sort="{ prop: 'beginTimeLong', order: 'ascending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #isSale="{ row, index, props }">
            <el-switch
              :size="props.size === 'small' ? 'small' : 'default'"
              :loading="switchLoadMap[index]?.loading"
              v-model="row.isSale"
              :active-value="1"
              :inactive-value="0"
              inline-prompt
              :style="switchStyle"
              @change="changeSwitch({ row, index })"
            />
          </template>
          <template #num="{ row }">
            <span class="underline cursor-pointer" @click="openInfoDialog">{{
              row.num ?? '-'
            }}</span>
          </template>
          <template #isNeutral="{ row }">
            {{ row.isNeutral === 0 ? t('中立') : t('非中立') }}
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('开售编辑'), row)"
            >
              {{ t('编辑') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import EditPen from '@iconify-icons/ep/edit-pen';
import { usePreSale } from './utils/hook';
import { t } from '@/plugins/i18n';
import { columns } from './component/TableColumnList';
import SearchForm from './component/SearchForm.vue';
import OpeningPreview from './component/OpeningPreview.vue';
import { addDialog } from '@/components/ReDialog';

defineOptions({ name: 'pre_sale' });

const openInfoDialog = () => {
  addDialog({
    title: t('盘口预览'),
    props: {},
    width: '30%',
    draggable: true,
    contentRenderer: () => h(OpeningPreview),
    hideFooter: true
  });
};

const {
  loading,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  switchLoadMap,
  changeSwitch,
  openDialog,
  searchForm,
  switchStyle,
  isLockAll
} = usePreSale();
</script>
