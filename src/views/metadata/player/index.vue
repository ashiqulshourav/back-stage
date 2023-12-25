<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="`${t('player.playerId')}:`" prop="playerId">
        <el-input
          v-model="form.teamId"
          :placeholder="t('player.playerId')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('metadata.belongingTeam')}:`" prop="level">
        <el-input
          v-model="form.countryId"
          :placeholder="t('metadata.belongingTeam')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('player.countryId')}:`" prop="countryId">
        <el-input
          v-model="form.countryId"
          :placeholder="t('player.countryId')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('player.isCountryPlayer')}:`" prop="countryId">
        <el-select
          v-model="form.isCountryPlayer"
          :placeholder="t('common.select')"
        >
          <el-option :label="t('common.yes')" :value="0" />
          <el-option :label="t('common.no')" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('metadata.height')}:`" prop="level">
        <el-input
          v-model="form.height"
          :placeholder="t('metadata.height')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('player.gender')}:`" prop="countryId">
        <el-select v-model="form.gender" :placeholder="t('common.select')">
          <el-option :label="t('common.man')" :value="0" />
          <el-option :label="t('common.woman')" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('player.birthday')}:`" prop="sportId">
        <el-input
          v-model="form.birthday"
          :placeholder="t('player.birthday')"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('player.nickName')}:`" prop="sportId">
        <el-input
          v-model="form.nickName"
          :placeholder="t('player.nickName')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('player.playerNameCn')}:`" prop="sportId">
        <el-input
          v-model="form.playerNameCn"
          :placeholder="t('player.playerNameCn')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('player.createdAt')}:`" prop="sportId">
        <el-input
          v-model="form.createdAt"
          :placeholder="t('player.createdAt')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('player.updatedAt')}:`" prop="sportId">
        <el-input
          v-model="form.updatedAt"
          :placeholder="t('player.updatedAt')"
          clearable
          class="!w-[130px]"
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
      title="球员管理列表"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog(t('player.add'))"
        >
          {{ t("player.add") }}
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
              :preview-src-list="dataList.map(v => v.picture)"
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
