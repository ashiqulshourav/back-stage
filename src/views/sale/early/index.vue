<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
        <el-input
          v-model="form.matchId"
          :placeholder="t('赛事ID')"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('赛事名称')}:`" prop="matchName">
        <el-input
          v-model="form.matchName"
          :placeholder="t('赛事名称')"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('开售状态')}:`" prop="isSale">
        <el-select
          v-model="form.isSale"
          :placeholder="t('请选择')"
          class="!w-[150px]"
        >
          <el-option :label="t('关闭')" :value="0" />
          <el-option :label="t('开售')" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('比赛时间')}:`" prop="sportId">
        <el-date-picker
          v-model="form.beginTime"
          type="datetime"
          :placeholder="t('比赛时间')"
          value-format="x"
          format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch('reload')"
        >
          {{ t('筛选') }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          {{ t('重置') }}
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
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, pageSizes: [5, 10, 20, 50, 100] }"
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
              :active-text="t('关闭')"
              :inactive-text="t('开售')"
              inline-prompt
              :style="switchStyle"
              @change="changeSwitch({ row, index })"
            />
          </template>
          <template #isNeutral="{ row }">
            {{ row.isNeutral === 0 ? t('中立') : t('非中立') }}
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import { useLeague } from './utils/hook';
import { t } from '@/plugins/i18n';

defineOptions({ name: 'League' });

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
  handleTableWidthChange,
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
