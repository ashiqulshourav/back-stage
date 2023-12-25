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
          <template #expand="{ row, index: parentIndex }">
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
                <template #t1="{ row }">
                  <el-input
                    v-model="row.t1"
                    type="number"
                    :disabled="!row.isEdit"
                  />
                </template>
                <template #t2="{ row }">
                  <el-input
                    v-model="row.t2"
                    type="number"
                    :disabled="!row.isEdit"
                  />
                </template>

                <template #eventCode="{ row }">
                  <el-select
                    :disabled="!row.isEdit"
                    v-model="row.eventCode"
                    :placeholder="t('common.select')"
                  >
                    <el-option label="足球进球" value="goal" />
                  </el-select>
                </template>

                <template #sportId="{ row }">
                  <el-select
                    :disabled="!row.isEdit"
                    v-model="row.sportId"
                    :placeholder="t('common.select')"
                  >
                    <el-option label="足球" :value="1" />
                    <el-option label="篮球" :value="2" />
                    <el-option label="网球" :value="3" />
                  </el-select>
                </template>

                <template #eventTime="{ row }">
                  <el-date-picker
                    v-model="row.eventTime"
                    type="datetime"
                    placeholder="请选择时间"
                    :disabled="!row.isEdit"
                    value-format="x"
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </template>
                <template #matchPeriodId="{ row }">
                  <el-select
                    :disabled="!row.isEdit"
                    v-model="row.matchPeriodId"
                    :placeholder="t('common.select')"
                  >
                    <el-option label="上半场" :value="1" />
                    <el-option label="下半场" :value="2" />
                  </el-select>
                </template>
                <template #homeAway="{ row, parentIndex: childIndex }">
                  <div>
                    <el-select
                      :disabled="!row.isEdit"
                      v-model="row.homeAway"
                      :placeholder="t('common.select')"
                      @change="onHomeAwaySelectChange(row, childIndex)"
                    >
                      <el-option label="主场" value="home" />
                      <el-option label="客场" value="away" />
                    </el-select>
                  </div>
                </template>

                <template #player1Name="{ row }">
                  <el-input
                    v-model="row.player1Name"
                    type="number"
                    :disabled="!row.isEdit"
                  />
                </template>

                <template #addMatchEvent="{ row }">
                  <el-switch
                    v-model="row.addMatchEvent"
                    inline-prompt
                    :disabled="!row.isEdit"
                    class="pure-datatheme"
                  />
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
                    <el-button
                      circle
                      type="primary"
                      @click="row.isEdit = false"
                    >
                      <div class="w-[14px] h-[14px] align-middle">B</div>
                    </el-button>
                    <el-button circle type="primary" @click="saveData(row)">
                      <div class="w-[14px] h-[14px] align-middle">C</div>
                    </el-button>
                  </div>
                </template>
              </pure-table>

              <div class="mt-2 cursor-pointer">
                <IconifyIconOffline
                  width="25px"
                  :icon="icon_circle_fill"
                  @click="addChildRow(row, parentIndex)"
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
defineOptions({ name: "settle_admin" });

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
  editChild,
  onHomeAwaySelectChange,
  saveData
} = useLeague();

onMounted(() => {
  onSearch();
});
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
