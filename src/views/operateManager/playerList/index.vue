<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />
    <PureTableBar
      :title="t('用户列表')"
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
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="isEditUser = true"
            >
              {{ t('编辑') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
  <el-dialog v-model="isEditUser" class="divide-y divide-slate-200" width="800">
    <template #title>
      <p class="pl-5 font-medium">用户编辑</p>
    </template>
    <el-form class="p-5" label-width="160">
      <el-form-item prop="" label="用户ID: ">
        <el-input disabled />
      </el-form-item>
      <el-form-item prop="" label="所属商户: ">
        <el-input disabled />
      </el-form-item>
      <el-form-item prop="" label="账号启用: ">
        <el-switch
          inline-prompt
          v-model="test"
          active-text="o"
          inactive-text="p"
          size="large"
        />
      </el-form-item>
      <el-form-item prop="" label="特殊限额: ">
        <el-select>
          <el-option label="hi" value="hi" />
        </el-select>
      </el-form-item>
      <el-form-item prop="" label="最后下注时间: ">
        <el-row class="flex justify-between w-full items-center">
          <p>每个用户最多添加20个风控标签</p>
          <p class="text-primary cursor-pointer">风控标签修改记录>></p>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-button>adfad</el-button>
          </el-col>
          <el-col :span="6">
            <el-button>adfad</el-button>
          </el-col>
          <el-col :span="6">
            <el-button>adfad</el-button>
          </el-col>
          <el-col :span="6">
            <el-button>adfad</el-button>
          </el-col>
          <el-col :span="6">
            <el-button>adfad</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="" label="最后下注时间: ">
        <p>2024-03-17 15：00</p>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="pr-5">
        <el-button>取消</el-button>
        <el-button type="primary">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { userPlayerListHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';

defineOptions({ name: 'CONFIGCENTER_LEAGUE_TAGS' });
const { tableHeaderStyle } = usePublicHooks();

const test = ref(true);
const {
  loading,
  form,
  dataList,
  isEditUser,
  pagination,
  onSearch,
  openDialog,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange
} = userPlayerListHook();
</script>

<style>
.el-message-box .el-message-box__btns {
  display: flex;
  flex-direction: row;
}
.el-dialog {
  padding-left: 0;
  padding-right: 0;
}
</style>
