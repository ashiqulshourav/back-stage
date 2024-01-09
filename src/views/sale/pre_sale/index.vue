<template>
  <div class="main">
    <SearchForm :loading="loading" @on-search="onSearch" />
    <PureTableBar :columns="columns" @refresh="onSearch('reload')">
      <template #title>
        <div class="flex items-center">
          <span class="mr-3">{{ t('预开售管理') }}</span>
          <el-switch
            v-model="allSaleSatatus"
            :active-value="1"
            :inactive-value="0"
            :active-text="t('关闭')"
            :inactive-text="t('开售')"
            inline-prompt
            :style="switchStyle"
            @change="changeAllSaleStatus"
          />
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :default-sort="{ prop: 'beginTimeLong', order: 'ascending' }"
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
          <template #leagueId="{ row }">
            <el-popover
              placement="bottom"
              trigger="click"
              :visible="isShowPopover"
            >
              <template #reference>
                <span
                  class="underline cursor-pointer"
                  @click="isShowPopover = true"
                  >{{ row.leagueId }}</span
                >
              </template>
              <OpeningPreview />
            </el-popover>
          </template>
          <template #isNeutral="{ row }">
            {{ row.isNeutral === 0 ? t('中立') : t('非中立') }}
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('开售编辑'), row)"
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
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import EditPen from '@iconify-icons/ep/edit-pen';
import { usePreSale } from './utils/hook';
import { t } from '@/plugins/i18n';
import { columns } from './component/TableColumnList';
import SearchForm from './component/SearchForm.vue';
import OpeningPreview from './component/OpeningPreview.vue';

defineOptions({ name: 'pre_sale' });

const isShowPopover = ref<boolean>(false);

const {
  loading,
  dataList,
  switchStyle,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  switchLoadMap,
  changeSwitch,
  openDialog,
  changeAllSaleStatus,
  allSaleSatatus
} = usePreSale();
</script>
