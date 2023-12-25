<template>
  <div class="main">
    <SearchForm />

    <PureTableBar
      title="结算管理"
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
          row-key="matchId"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @expand-change="getChildRenData"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #sn="{ index }">{{ index + 1 }}</template>
          <template #expand="{ row, childIndex }">
            <div class="m-4">
              <div class="flex mb-2">
                <el-button
                  link
                  type="primary"
                  :icon="useRenderIcon(icon_money)"
                >
                  {{ t("settle.firstHalfSettlement") }}
                </el-button>
                <el-button link type="danger" :icon="useRenderIcon(icon_money)">
                  {{ t("settle.secondHalfSettlement") }}
                </el-button>
              </div>
              <pure-table
                :data="row.childrenData"
                :loading="childloading"
                :columns="childColumns"
                size="small"
                table-layout="auto"
                border
                :header-cell-style="{
                  background: 'var(--el-fill-color-light)',
                  color: 'var(--el-text-color-primary)',
                  textAlign: 'center'
                }"
                :cell-style="{ textAlign: 'center' }"
              >
                <template #a="{ row }"> {{ row.a }} </template>
                <template #eventTime="{ row }">
                  <el-date-picker
                    v-model="row.eventTime"
                    type="datetime"
                    placeholder="请选择时间"
                    :disabled="true"
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </template>
                <template #matchPeriodId="{ row }">
                  <el-select
                    :disabled="true"
                    v-model="row.matchPeriodId"
                    :placeholder="t('common.select')"
                  >
                    <el-option label="上半场" :value="0" />
                    <el-option label="下半场" :value="1" />
                  </el-select>
                </template>
                <template #homeAway="{ row }">
                  <div>
                    <el-select
                      :disabled="true"
                      v-model="row.matchPeriodId"
                      :placeholder="t('common.select')"
                    >
                      <el-option label="主场" :value="0" />
                      <el-option label="客场" :value="1" />
                    </el-select>
                  </div>
                </template>
                <template #t1="{ row }">
                  <div
                    class="flex items-center w-[100px] justify-center m-auto"
                  >
                    <span>{{ row.t1 }}</span>
                    <span class="mr-0.5 ml-0.5">-</span>
                    <span>{{ row.t2 }}</span>
                  </div>
                </template>
                <template #operation="{ row }">
                  <div class="flex items-center justify-center">
                    <el-button
                      circle
                      type="primary"
                      @click="editChild(row, childIndex)"
                    >
                      <div class="w-[14px] h-[14px] align-middle">A</div>
                    </el-button>
                    <el-button circle type="primary">
                      <div class="w-[14px] h-[14px] align-middle">B</div>
                    </el-button>
                    <el-button circle type="primary">
                      <div class="w-[14px] h-[14px] align-middle">C</div>
                    </el-button>
                  </div>
                </template>
              </pure-table>
              <div class="mt-2 cursor-pointer">
                <IconifyIconOffline
                  width="25px"
                  :icon="icon_circle_fill"
                  @click="addChildRow(row, childIndex)"
                />
              </div>
            </div>
          </template>
          <template #operation="">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :fit="false"
              size="small"
              :icon="useRenderIcon(icon_money)"
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
import icon_money from "@iconify-icons/ri/money-cny-box-fill";
import icon_circle_fill from "@iconify-icons/ri/add-circle-fill";
import { useLeague } from "./utils/hook";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import SearchForm from "./component/SearchForm.vue";
const { t } = useTranslationLang();
defineOptions({ name: "League" });

const {
  loading,
  childloading,
  columns,
  dataList,
  pagination,
  onSearch,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  childColumns,
  getChildRenData,
  addChildRow,
  editChild
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
