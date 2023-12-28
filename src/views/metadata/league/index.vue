<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="`${t('联赛杯赛ID')}:`" prop="leagueId">
        <el-input
          v-model="form.leagueId"
          :placeholder="t('联赛杯赛ID')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('赛事等级')}:`" prop="level">
        <el-input
          v-model="form.level"
          :placeholder="t('赛事等级')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('联赛杯赛英文名称')}:`" prop="leagueNameEn">
        <el-input
          v-model="form.leagueNameEn"
          :placeholder="t('联赛杯赛英文名称')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('国家ID')}:`" prop="countryId">
        <el-input
          v-model="form.countryId"
          :placeholder="t('国家ID')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('188数据源联赛杯ID')}:`" prop="leagueId188Bet">
        <el-input
          v-model="form.leagueId188Bet"
          :placeholder="t('188数据源联赛杯ID')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('赛种')}:`" prop="sportId">
        <el-select v-model="form.sportId" :placeholder="t('赛种')">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in SPORT_ID_MAP"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch('reload')"
        >
          {{ t("筛选") }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          {{ t("重置") }}
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :title="t('联赛列表')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog(t('新增联赛'))"
        >
          {{ t("新增联赛") }}
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
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #leagueLogo="{ row, index }">
            <el-image
              preview-teleported
              loading="lazy"
              :src="row.leagueLogo"
              :preview-src-list="dataList.map(v => v.leagueLogo)"
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
              @click="openDialog(t('编辑赛事'), row)"
            >
              {{ t("编辑") }}
            </el-button>
            <el-popconfirm
              :title="`是否确认删除${row.name}的这条数据`"
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
                  {{ t("删除") }}
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
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { useLeague } from "./utils/hook";

import { SPORT_ID_MAP } from "@/utils/maps/sports_map";

import { t } from "@/plugins/i18n";

defineOptions({ name: "League" });

const formRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
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
