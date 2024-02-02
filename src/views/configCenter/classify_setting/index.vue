<template>
  <div class="main">
    <!-- <SearchForm :loading="loading" @on-search="onSearch" :form="searchForm" /> -->
    <PureTableBar
      :title="t('分类列表')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon('addFill')"
          @click="openDialog(t('新增分类'))"
        >
          {{ t('新增分类') }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="fixed"
          :loading="loading"
          :size="size"
          border
          adaptive
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
          <template #teamLogo="{ row, index }">
            <el-image
              preview-teleported
              loading="lazy"
              :src="row.leagueLogo"
              :preview-src-list="dataList.map(v => v.teamLogo)"
              :initial-index="index"
              fit="cover"
              class="w-[80px] h-[30px]"
            />
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('编辑分类'), row)"
            >
              {{ t('编辑') }}
            </el-button>
            <el-popconfirm
              :title="`是否确认删除角色名称为${row.name}的这条数据`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon('Delete')"
                >
                  {{ t('删除') }}
                </el-button>
              </template>
            </el-popconfirm>
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
import { useClassifySetting } from './utils/hook';
// import SearchForm from './component/SearchForm.vue';
import { t } from '@/plugins/i18n';

defineOptions({ name: 'TEAM' });

const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  openDialog,
  handleDelete,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange
  // searchForm
} = useClassifySetting();
</script>
