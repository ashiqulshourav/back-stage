<template>
  <div class="main">
    <PureTableBar :columns="columns" @refresh="onSearch">
      <template #title>
        <el-button type="primary" @click="openRoleDialog(t('新增菜单'))">
          {{ t('新增菜单') }}
        </el-button>
      </template>
      <template v-slot="{ dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          size="large"
          show-overflow-tooltip
          row-key="id"
          adaptive
          :indent="32"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
          :tree-props="{
            children: 'childResourceList',
            hasChildren: 'hasChildren'
          }"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              size="large"
              @click="openRoleDialog(t('编辑菜单'), row)"
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
import { useRoleHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';

defineOptions({ name: 'SYSTEMMANAGER_MENUMANAGER' });
const { tableHeaderStyle } = usePublicHooks();

const { loading, columns, dataList, onSearch, openRoleDialog } = useRoleHook();
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

:deep {
  .first_table {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
