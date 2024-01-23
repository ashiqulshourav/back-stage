<template>
  <div class="main">
    <SearchForm :loading="loading" @onSearch="onSearch" :form="form" />
    <PureTableBar
      title="球队管理列表"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <!-- <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog(t('新增球队'))"
        >
          {{ t("新增球队") }}
        </el-button>
      </template> -->
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
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
          <!-- <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('编辑赛事'), row)"
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
                  :icon="useRenderIcon(Delete)"
                >
                  {{ t('删除') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template> -->
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
// import Delete from '@iconify-icons/ep/delete';
// import EditPen from '@iconify-icons/ep/edit-pen';

// import AddFill from '@iconify-icons/ri/add-circle-line';
import { useLeague } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { usePublicHooks } from '@/hooks';

// import { t } from '@/plugins/i18n';

defineOptions({ name: 'eTeam' });
const { tableHeaderStyle } = usePublicHooks();
const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  // openDialog,
  // handleDelete,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  form
} = useLeague();
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
