<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="`${t('sell.matchId')}:`" prop="matchId">
        <el-input
          v-model="form.matchId"
          :placeholder="t('sell.matchId')"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('sell.matchName')}:`" prop="matchName">
        <el-input
          v-model="form.matchName"
          :placeholder="t('sell.matchName')"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('sell.isSale')}:`" prop="isSale">
        <el-select v-model="form.isSale" :placeholder="t('common.select')">
          <el-option :label="t('sell.close')" :value="0" />
          <el-option :label="t('sell.open')" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('sell.beginTime')}:`" prop="sportId">
        <el-input
          v-model="form.beginTime"
          :placeholder="t('sell.beginTime')"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch('reload')"
        >
          {{ t("commonTable.search") }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          {{ t("commonTable.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="预开售管理"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
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
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #isSale="{ row, index, props }">
            <el-switch
              :size="props.size === 'small' ? 'small' : 'default'"
              :loading="switchLoadMap[index]?.loading"
              v-model="row.isSale"
              :active-value="1"
              :inactive-value="0"
              :active-text="t('sell.close')"
              :inactive-text="t('sell.open')"
              inline-prompt
              :style="switchStyle"
              @change="changeSwitch({ row, index })"
            />
          </template>
          <template #isNeutral="{ row }">
            {{ row.isNeutral === 0 ? t("sell.neutral") : t("sell.nonNeutral") }}
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
  handleSelectionChange,
  switchLoadMap,
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
