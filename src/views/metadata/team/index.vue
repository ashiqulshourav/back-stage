<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="`${t('team.teamId')}:`" prop="teamId">
        <el-input
          v-model="form.teamId"
          :placeholder="t('team.teamId')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('metadata.countryId')}:`" prop="level">
        <el-input
          v-model="form.countryId"
          :placeholder="t('metadata.countryId')"
          
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('team.isCountryTeam')}:`" prop="countryId">
        <el-select v-model="form.isCountryTeam" placeholder="Select">
          <el-option :label="t('common.yes')" :value="0" />
          <el-option :label="t('common.no')" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item :label="`${t('team.leagueId')}:`" prop="leagueId">
        <el-input
          v-model="form.leagueId"
          :placeholder="t('team.leagueId')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('metadata.level')}:`" prop="level">
        <el-input
          v-model="form.level"
          :placeholder="t('metadata.level')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('metadata.raceId')}:`" prop="sportId">
        <el-input
          v-model="form.sportId"
          :placeholder="t('metadata.raceId')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('team.teamNameCn')}:`" prop="sportId">
        <el-input
          v-model="form.teamNameCn"
          :placeholder="t('team.teamNameCn')"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('team.teamNameEn')}:`" prop="sportId">
        <el-input
          v-model="form.teamNameEn"
          :placeholder="t('team.teamNameEn')"
          clearable
          class="!w-[200px]"
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
      title="球队管理列表"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog(t('team.add'))"
        >
          {{ t("team.add") }}
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
          <template #isCountryTeam="row">
            {{ row.isCountryTeam ?? "-" }}
          </template>
          <template #stadiumName="row">
            {{ row.stadiumName ?? "-" }}
          </template>
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
              @click="openDialog(t('commonTable.editMatch'), row)"
            >
              {{ t("commonTable.edit") }}
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
                  {{ t("commonTable.delete") }}
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
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
const { t } = useTranslationLang();
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
