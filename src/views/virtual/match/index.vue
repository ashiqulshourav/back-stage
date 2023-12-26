<template>
  <div class="main">

    <PureTableBar
      :title="t('vMatch.title')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog(t('commonTable.add'))"
        >
          {{ t("vMatch.titleNew") }}
        </el-button>
      </template>
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('commonTable.editMatch'), row)"
            >
              {{ t("commonTable.edit") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { useLeague } from "./utils/hook";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
const { t } = useTranslationLang();
defineOptions({ name: "League" });

const formRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  switchStyle,
  pagination,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
  switchLoadMap,
  openDialog,
  changeSwitch
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
